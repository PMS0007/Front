import type { ReactNode } from 'react';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen w-full bg-[#f4f2ec]">
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/atmosphere.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 0vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-black/20" />

        <div className="absolute bottom-14 left-10 right-10 max-w-md">
          <p className="font-serif text-2xl italic leading-snug text-white/95">
            &ldquo;A quiet sanctuary for unhurried days — forest air, warm
            timber, and rooms that feel like an exhale.&rdquo;
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="h-px w-8 bg-amber-400/70" />
            <span className="text-xs font-semibold tracking-[0.2em] text-amber-300/90">
              THE HAVENWOOD PHILOSOPHY
            </span>
          </div>
        </div>
      </div>


      <div className="flex w-full items-center justify-center px-6 py-16 lg:w-1/2">
        {children}
      </div>
    </main>
  );
}