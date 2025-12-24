import { Music2 } from 'lucide-react';
import Link from 'next/link';

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#create', label: 'Create' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center">
          <Link className="flex items-center space-x-2" href="#home">
            <Music2 className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">VocalCraft AI</span>
          </Link>
        </div>
        
        <nav className="flex flex-1 items-center justify-center space-x-6 text-sm font-medium text-muted-foreground">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User profile button removed */}
      </div>
    </header>
  );
}
