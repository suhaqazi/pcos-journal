import { ReactNode } from "react";
import Logo from "@/components/layout/Logo";

// The wallpaper background + cream card shared by login and signup
interface AuthShellProps {
  title: string;
  subtitle?: ReactNode;
  wide?: boolean;
  children: ReactNode;
}

export default function AuthShell({
  title,
  subtitle,
  wide = false,
  children,
}: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[url('/wallpaper.svg')] bg-cover bg-fixed bg-center bg-no-repeat px-4 py-8">
      <div
        className={`flex w-full flex-col items-center gap-6 rounded-card bg-paper p-12 ${
          wide ? "max-w-2xl" : "max-w-md"
        }`}
      >
        <Logo size="md" stacked className="items-center" />

        <div className="text-center">
          <h1 className="mb-2 text-display font-bold text-ink">{title}</h1>
          {subtitle && (
            <p className="text-[0.9375rem] text-muted">{subtitle}</p>
          )}
        </div>

        {children}
      </div>
    </main>
  );
}
