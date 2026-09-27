import type { SiteMode } from "@/components/site/StatusBar";

const MODE_LABEL: Record<SiteMode, string> = {
  default: "NORMAL",
  diagnostic: "DIAGNOSTIC",
  "glitch storm": "GLITCH STORM",
  crt: "CRT",
  all: "ALL EFFECTS",
};

const LEFT_CHANNELS = ["AUTHENTICATION", "MIDDLEWARE", "APIs", "BACKGROUND JOB"];
const RIGHT_CHANNELS = ["INPUT", "LOSS FUNCTION", "OPTIMIZER", "OUTPUT"];

export function HeroTelemetryFrame({ mode }: { mode: SiteMode }) {
  return (
    <div className="hero-telemetry diag-hud" aria-hidden="true">
      <div className="hero-telemetry-top">
        <span className="hero-telemetry-group">
          <span className="hero-telemetry-signal" />
          <span>PORTFOLIO</span>
        </span>
        <span className="hero-telemetry-divider" />
        <span className="hero-telemetry-group">
          <span className="hero-telemetry-signal hero-telemetry-signal--online" />
          <span>ONLINE</span>
        </span>
        <span className="hero-telemetry-divider hidden sm:block" />
        <span className="hidden sm:inline">V3</span>
        <span className="hero-telemetry-spacer" />
        <span className="hero-telemetry-bars hidden md:flex">
          {[3, 8, 5, 11, 6, 9, 4, 7].map((height, index) => (
            <span key={index} style={{ height }} />
          ))}
        </span>
        <span className="hero-telemetry-mode">MODE / {MODE_LABEL[mode]}</span>
      </div>

      <div className="hero-telemetry-side hero-telemetry-side--left">
        {LEFT_CHANNELS.map((channel) => (
          <span key={channel} className="hero-telemetry-channel">
            {channel}
          </span>
        ))}
      </div>
      <div className="hero-telemetry-side hero-telemetry-side--right">
        {RIGHT_CHANNELS.map((channel) => (
          <span key={channel} className="hero-telemetry-channel">
            {channel}
          </span>
        ))}
      </div>

      <div className="hero-telemetry-bottom">
        <span>ROUTE / HOME</span>
        <span className="hero-telemetry-divider hidden sm:block" />
        <span className="hidden">BUILD / V3</span>
        <span className="hero-telemetry-sparkline hidden sm:inline-flex">
          <svg viewBox="0 0 44 14" focusable="false" aria-hidden="true">
            <path className="hero-telemetry-sparkline-axis" d="M1 12.5H43" />
            <polyline points="1,10 9,8 16,11 24,3 32,6 42,2" />
            <circle cx="24" cy="3" r="1.5" />
            <circle cx="42" cy="2" r="1.5" />
          </svg>
        </span>
        <span className="hero-telemetry-spacer" />
        <span className="hidden sm:inline">REACT / NEXT.JS / SWISS DESIGN</span>
        <span className="hero-telemetry-divider hidden sm:block" />
        <span className="hero-telemetry-group">
          <span className="hero-telemetry-signal hero-telemetry-signal--online" />
          <span>READY</span>
        </span>
      </div>
    </div>
  );
}
