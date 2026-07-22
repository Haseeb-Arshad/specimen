import { Link } from '@tanstack/react-router'

export function Masthead() {
  return (
    <header className="masthead">
      <div className="specimen-shell masthead-inner">
        <Link to="/" className="masthead-wordmark-link">
          <div className="masthead-wordmark">
            SPECIMEN<span className="masthead-period">.</span>
          </div>
        </Link>

        <div className="masthead-right">
          <div className="masthead-tag mono">IMAGE &rarr; DESIGN TOKENS &middot; AI EXTRACTION</div>
          <nav className="masthead-nav mono" aria-label="Primary">
            <Link
              to="/"
              className="masthead-nav-link"
              activeOptions={{ exact: true }}
              activeProps={{ className: 'masthead-nav-link masthead-nav-link-active' }}
            >
              Extract
            </Link>
            <Link
              to="/history"
              className="masthead-nav-link"
              activeProps={{ className: 'masthead-nav-link masthead-nav-link-active' }}
            >
              History
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
