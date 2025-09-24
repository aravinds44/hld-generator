import { Bot } from 'lucide-react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold font-headline">
            <Bot className="h-7 w-7 text-primary" />
            <span>HLD Autopilot</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
