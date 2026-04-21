import type { LucideIcon } from "lucide-react";
import {
  Atom,
  ArrowUpRight,
  Award,
  Bot,
  Brain,
  Briefcase,
  Cloud,
  Code,
  Code2,
  CodeXml,
  Container,
  Cpu,
  Database,
  DatabaseZap,
  ExternalLink,
  FileText,
  Flame,
  GitBranch,
  GraduationCap,
  Gpu,
  Link2,
  Layers,
  Mail,
  Network,
  Package,
  Palette,
  Sigma,
  Sparkles,
  Server,
  Table,
  Terminal,
  TrendingUp,
  Wrench,
  X,
  LineSquiggle,
  Box,
  Smile,
  Link,
  Star,
  ChartNetwork,
  Zap,
} from "lucide-react";

import type { IconName } from "@/content/site";
import { cn } from "@/lib/cn";

const ICONS: Record<IconName, LucideIcon> = {
  Mail,
  Github: GitBranch,
  Linkedin: Link,
  X,
  FileText,
  ExternalLink,
  ArrowUpRight,
  Code,
  Code2,
  CodeXml,
  Terminal,
  Server,
  Cloud,
  Cpu,
  Gpu,
  Database,
  DatabaseZap,
  Table,
  Palette,
  Sparkles,
  Atom,
  Layers,
  Link2,
  Bot,
  Wrench,
  Award,
  Sigma,
  Brain,
  TrendingUp,
  Flame,
  Package,
  Container,
  Network,
  Briefcase,
  LineSquiggle,
  Box,
  Smile,
  Link,
  Star,
  GraduationCap,
  ChartNetwork,
  Zap,
};

export function Icon({
  name,
  className,
  "aria-label": ariaLabel,
}: {
  name: IconName;
  className?: string;
  "aria-label"?: string;
}) {
  const Component = ICONS[name];

  if (!Component) return null;

  return (
    <Component
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={cn("h-4 w-4", className)}
    />
  );
}
