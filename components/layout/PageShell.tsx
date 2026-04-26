import Link from "next/link";
import { type Exercise } from "@/lib/data/exercises";

interface PageShellProps {
  exercise: Exercise;
  children: React.ReactNode;
}

export function PageShell({ exercise, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-beige-200 bg-texture flex flex-col">
      {/* Header */}
      <header className="bg-beige-100/90 backdrop-blur border-b border-beige-300 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-full bg-forest-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-beige-100" stroke="currentColor" strokeWidth="2">
                <path d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7l3 2 3-2c2.5-1.5 4-4 4-7 0-4-3-8-7-8z" strokeLinecap="round"/>
                <path d="M12 8v8M9 11h6" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-semibold text-base text-forest-800">
              Respir<span className="text-copper-500">facile</span>
            </span>
          </Link>
          <Link href="/exercises" className="text-sm text-forest-500 hover:text-forest-700 transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Mes exercices
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        {children}
      </main>
    </div>
  );
}
