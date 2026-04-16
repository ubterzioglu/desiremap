export function AdminSettingsWorkspace() {
  return (
    <div className="rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Settings</div>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Workspace Konfiguration</h2>
      <p className="mt-4 max-w-[70ch] text-sm leading-7 text-slate-400">
        Diese erste Version konzentriert sich auf Host-Trennung, Operator-Login und die zentralen Arbeitsbereiche. Erweiterte Business-
        und Venue-Einstellungen folgen, sobald die zugehoerigen Referenzendpunkte im Backend verifiziert sind.
      </p>
    </div>
  )
}
