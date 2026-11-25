import matter from 'gray-matter'
import { createOrUpdateFile, deleteFile, getFile, getProductionBranch } from '@/lib/github'

function getBranches(): { preview: string; production: string } {
  const preview = process.env.GITHUB_BRANCH?.trim()
  const production = getProductionBranch()

  if (!preview) {
    throw new Error('GITHUB_BRANCH is not set — drafts cannot be saved safely.')
  }
  if (preview === production) {
    throw new Error(
      `GITHUB_BRANCH and GITHUB_PRODUCTION_BRANCH both point to "${preview}". Configure a separate Preview branch so draft saves cannot publish to Production.`
    )
  }

  return { preview, production }
}

function assertProductionWritesAllowed(): void {
  if (process.env.VERCEL_ENV !== 'production') {
    throw new Error(
      'Production content can only be published or deleted from the Production deployment. Open the live admin site to make this change.'
    )
  }
}

export async function saveContentToBranches(
  path: string,
  content: string,
  previewCommitMessage: string,
  productionCommitMessage: string,
  unpublishCommitMessage: string,
  status: 'draft' | 'published'
): Promise<{ productionUpdated: boolean }> {
  const { preview, production } = getBranches()
  const productionFile = await getFile(path, production)
  const isPublishedInProduction =
    productionFile !== null && matter(productionFile.content).data.status === 'published'
  const shouldUpdateProduction = status === 'published' || isPublishedInProduction

  if (shouldUpdateProduction) {
    assertProductionWritesAllowed()
  }

  await createOrUpdateFile(path, content, previewCommitMessage, preview)

  if (shouldUpdateProduction) {
    try {
      await createOrUpdateFile(
        path,
        content,
        status === 'published' ? productionCommitMessage : unpublishCommitMessage,
        production
      )
      return { productionUpdated: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const action = status === 'published' ? 'publish' : 'unpublish'
      throw new Error(
        `Saved to Preview, but failed to ${action} on Production: ${message}`
      )
    }
  }

  return { productionUpdated: false }
}

export async function deleteContentFromBranches(path: string, commitMessage: string): Promise<void> {
  const { preview, production } = getBranches()
  const [previewFile, productionFile] = await Promise.all([
    getFile(path, preview),
    getFile(path, production),
  ])

  if (productionFile) {
    assertProductionWritesAllowed()
    await deleteFile(path, productionFile.sha, commitMessage, production)
  }

  if (previewFile) {
    try {
      await deleteFile(path, previewFile.sha, commitMessage, preview)
    } catch (error) {
      if (productionFile) {
        const message = error instanceof Error ? error.message : String(error)
        throw new Error(`Deleted from Production, but failed to delete from Preview: ${message}`)
      }
      throw error
    }
  }
}
