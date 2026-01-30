import { Shield } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Gavanav</h1>
            <p className="text-xs text-muted-foreground">Kenya Public Services Guide</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full bg-secondary px-3 py-1.5 sm:flex">
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">Verified Data Sources</span>
        </div>
      </div>
    </header>
  )
}
