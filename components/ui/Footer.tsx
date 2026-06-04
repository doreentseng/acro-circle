import {
  HeartIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/solid';

export default function Footer() {
  return (
    <footer className="w-full mt-10 border-t border-zinc-100 py-6 flex flex-col items-center space-y-1 text-xs text-zinc-500">
      <div className="flex items-center gap-2">
        <CodeBracketIcon className="w-4 h-4 text-zinc-400" />
        <span>Built with Next.js + Supabase</span>
      </div>
      <div className="flex flex-col items-center gap-1 md:flex-row md:gap-2">
        <div className="flex items-center gap-1">
          <HeartIcon className="w-4 h-4 text-pink-400" />
          <span>
            Yoga Icon by Community on
            <a href="https://icon-icons.com/authors/878-community">
              Icon-Icons.com
            </a>
          </span>
        </div>

        <div className="flex items-center gap-1">
          <ShieldCheckIcon className="w-4 h-4 text-zinc-400" />
          <span>All rights reserved © {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
