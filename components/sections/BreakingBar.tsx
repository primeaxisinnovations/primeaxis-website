const headlines = [
  "Nigeria's new National Transport Policy sets bold maritime targets for 2030",
  "NIMASA launches West African Maritime Security Dialogue",
  "Lekki Deep Sea Port records 1 million TEU milestone in first operational year",
  "African Blue Economy Strategy 2063 gains momentum as AU member states align",
  "IMO regional training programme extends to 12 new African coastal states",
  "West African freight rates stabilise following Red Sea rerouting pressure",
]

const ticker = headlines.join("  ·  ")

export default function BreakingBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[110] bg-gold h-[38px] overflow-hidden flex items-center">
      <div className="flex items-center gap-4 w-full">
        <span className="font-mono text-[9.5px] tracking-[0.18em] uppercase bg-deep text-gold px-3 py-[3px] whitespace-nowrap flex-shrink-0 ml-4">
          Latest
        </span>
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker text-[12px] font-medium text-deep tracking-[0.02em] whitespace-nowrap inline-block">
            {ticker}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;{ticker}
          </div>
        </div>
      </div>
    </div>
  )
}
