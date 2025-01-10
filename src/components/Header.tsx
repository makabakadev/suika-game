import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="border-b-2 border-gray-800 bg-gray-50 fixed top-0 left-0 w-full z-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <a href="https://bork.institute" className="flex items-center gap-4 cursor-pointer">
            <img src="/bork.svg" alt="BORK" className="w-10 sm:w-12 h-10 sm:h-12" />
            <div>
              <h1 className="font-serif text-xl sm:text-2xl">The BORK Institute</h1>
              <p className="font-serif text-sm text-gray-500 italic">Center for Advanced Chicken Studies</p>
            </div>
          </a>
          <div className="flex items-center gap-4">
            {/* Social Links */}
            <div className="hidden sm:flex items-center gap-6">
              {/* Navigation Items */}
              <a
                href='https://journal.bork.institute/'
                className={`font-serif text-gray-500 hover:text-gray-800 transition-colors `}
              >
                Publications
              </a>
              <a
                href='https://bork.institute/'
                className={`font-serif text-gray-500 hover:text-gray-800 transition-colors `}
              >
                Research
              </a>
            </div>
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="sm:hidden">
            <a
              href='https://journal.bork.institute/'
              className={`block w-full text-left px-4 py-3 font-serif hover:bg-gray-100`}
            >
              Publications
            </a>
            <a
              href='https://bork.institute/'
              className={`block w-full text-left px-4 py-3 font-serif hover:bg-gray-100`}
            >
              Research
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
