import * as React from "react";
import type { IconName } from "@/content/site";

type GlyphProps = React.SVGAttributes<SVGSVGElement> & {
  size?: number;
};

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const MailGlyph = ({ size = 14, ...rest }: GlyphProps) => (
  <svg {...base(size)} {...rest}>
    <rect x="1.5" y="3" width="13" height="10" rx="0.5" />
    <path d="M1.75 3.5 8 8.5l6.25-5" />
  </svg>
);

export const GithubGlyph = ({ size = 14, ...rest }: GlyphProps) => (
  <svg {...base(size)} {...rest}>
    <path d="M8 1.5c-3.6 0-6.5 2.9-6.5 6.5 0 2.87 1.86 5.3 4.44 6.17.32.06.44-.14.44-.31v-1.18c-1.81.39-2.19-.77-2.19-.77-.3-.76-.73-.96-.73-.96-.6-.4.04-.4.04-.4.66.05 1.01.68 1.01.68.59 1 1.54.71 1.92.54.06-.42.23-.71.42-.87-1.45-.16-2.97-.72-2.97-3.22 0-.71.25-1.29.67-1.75-.07-.16-.29-.83.06-1.72 0 0 .55-.17 1.79.67a6.2 6.2 0 0 1 1.62-.22c.55 0 1.1.07 1.62.22 1.24-.84 1.79-.67 1.79-.67.36.89.13 1.56.06 1.72.42.46.67 1.04.67 1.75 0 2.5-1.53 3.06-2.98 3.22.24.2.45.6.45 1.21v1.8c0 .17.12.38.45.31A6.5 6.5 0 0 0 14.5 8 6.5 6.5 0 0 0 8 1.5Z" />
  </svg>
);

export const LinkedinGlyph = ({ size = 14, ...rest }: GlyphProps) => (
  <svg {...base(size)} {...rest}>
    <rect x="1.5" y="1.5" width="13" height="13" rx="0.5" />
    <line x1="4.5" y1="6.5" x2="4.5" y2="11.5" />
    <circle cx="4.5" cy="4.5" r="0.6" />
    <path d="M7 6.5v5M7 8.5c0-1.1.9-2 2-2s2 .9 2 2v3" />
  </svg>
);

export const XGlyph = ({ size = 14, ...rest }: GlyphProps) => (
  <svg {...base(size)} {...rest}>
    <path d="m2.5 2.5 11 11M13.5 2.5l-11 11" />
  </svg>
);

export const FileTextGlyph = ({ size = 14, ...rest }: GlyphProps) => (
  <svg {...base(size)} {...rest}>
    <path d="M3 1.5h6l4 4v9H3z" />
    <path d="M9 1.5v4h4" />
    <path d="M5 8.5h6M5 10.5h6M5 12.5h4" />
  </svg>
);

export const ExternalLinkGlyph = ({ size = 14, ...rest }: GlyphProps) => (
  <svg {...base(size)} {...rest}>
    <path d="M7 2.5H2.5v11h11V9" />
    <path d="M9 2.5h4.5V7" />
    <path d="m7.5 8.5 6-6" />
  </svg>
);

export const ArrowUpRightGlyph = ({ size = 14, ...rest }: GlyphProps) => (
  <svg {...base(size)} {...rest}>
    <path d="M4 12 12 4" />
    <path d="M5.5 4H12v6.5" />
  </svg>
);

export const ApertureGlyph = ({ size = 14, ...rest }: GlyphProps) => (
  <svg {...base(size)} {...rest}>
    <circle cx="8" cy="8" r="6.5" />
    <path d="M8 1.5v5.5M14.5 8H9M11.7 12.7 8.7 8.5M4.3 12.7l3-4.2M1.5 8h5.5M4.3 3.3 7.3 7.5" />
  </svg>
);

const REGISTRY: Record<IconName, React.FC<GlyphProps>> = {
  Mail: MailGlyph,
  Github: GithubGlyph,
  Linkedin: LinkedinGlyph,
  X: XGlyph,
  FileText: FileTextGlyph,
  ExternalLink: ExternalLinkGlyph,
  ArrowUpRight: ArrowUpRightGlyph,
  Aperture: ApertureGlyph,
};

export function Glyph({
  name,
  ...rest
}: GlyphProps & { name: IconName }) {
  const Cmp = REGISTRY[name];
  if (!Cmp) return null;
  return <Cmp {...rest} />;
}
