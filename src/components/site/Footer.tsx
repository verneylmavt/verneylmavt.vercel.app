import { Hairline } from "@/components/ui/Hairline";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[88rem] px-6 md:px-12 pb-16">
      <Hairline className="mb-6" />
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 text-[0.6875rem] tracking-[0.04em] text-muted-soft">
        <p>
          ©verneylmavt — built w/ next.js 15 • react 19 • tailwind css 4
        </p>
        <p aria-hidden="true">{"// inspired by swiss design"}</p>
      </div>
    </footer>
  );
}
