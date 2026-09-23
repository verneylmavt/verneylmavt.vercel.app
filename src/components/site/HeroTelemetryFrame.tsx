import type { SiteMode } from "@/components/site/StatusBar";

const MODE_LABEL: Record<SiteMode, string> = {
  default: "NORMAL",
  diagnostic: "DIAGNOSTIC",
  "glitch storm": "GLITCH STORM",
  crt: "CRT",
  all: "ALL EFFECTS",
};

const LEFT_CHANNELS = ["OBSERVE", "TRACE", "METRICS", "LOGS"];
const RIGHT_CHANNELS = ["INPUT", "RENDER", "OUTPUT", "CACHE"];

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
        <span className="hidden sm:inline">V3 / SOFTWARE ENGINEERING</span>
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
        <span className="hidden sm:inline">BUILD / V3</span>
        <span className="hero-telemetry-spacer" />
        <span className="hidden sm:inline">NEXT.JS / REACT</span>
        <span className="hero-telemetry-divider hidden sm:block" />
        <span className="hero-telemetry-group">
          <span className="hero-telemetry-signal hero-telemetry-signal--online" />
          <span>READY</span>
        </span>
      </div>
    </div>
  );
}
