import Button from "@/components/ui/Button";

// Shown in place of the history cabinet when nobody is signed in
export default function GuestHistoryPrompt() {
  return (
    <div className="relative flex flex-wrap items-center justify-between gap-8 rounded-t-xl bg-parchment px-12 py-10">
      <div className="absolute -top-6 left-4 rounded-t-lg bg-parchment px-5 py-1.5 font-hand text-sm font-bold tracking-wider text-burgundy">
        YOUR HISTORY
      </div>

      <div className="flex items-start gap-4">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="mt-1 shrink-0 text-burgundy"
          aria-hidden="true"
        >
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" // design feature (shield shape)
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div>
          <p className="mb-2 font-display text-xl font-bold italic text-burgundy">
            Want to keep your questions?
          </p>
          <p className="max-w-lg text-[0.9375rem] leading-relaxed text-muted">
            Sign in for a bigger question allowance and a private history you
            can revisit any time. Your journal and insights come with it too.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button href="/login">Sign in</Button>
        <Button href="/signup" variant="secondary">
          Create an account
        </Button>
      </div>
    </div>
  );
}
