import { useState } from 'react';
import { Wallet, Trophy, X, Menu, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };
  
  return (
    <>
      {/* Menu Button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 right-4 z-50 p-2 bg-white border-2 border-gray-800 rounded-lg shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-gray-50 border-l border-gray-200 transform transition-transform duration-200 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 relative">
          {/* Close Button */}
          <button onClick={toggleSidebar} className="absolute top-4 right-4">
            <X className="w-6 h-6" />
          </button>

          {/* Logo and Title */}
          <Link to='/' className="flex items-center space-x-3 mb-8">
            <img src="/bork.svg" alt="BORK" className="w-10 sm:w-12 h-10 sm:h-12" />
            <div>
              <h1 className="font-serif text-xl sm:text-2xl">Journal of Bork Science</h1>
              <p className="font-serif text-sm text-gray-500 italic">Reports on Advanced Chicken Studies</p>
            </div>
          </Link>
          
          {/* Scholar Level */}
          {/* <div className="mb-8 p-4 bg-white border-2 border-gray-800 font-serif">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Scholar Level</span>
              <span className="text-sm font-bold">Senior Fellow</span>
            </div>
            <div className="w-full bg-gray-100 h-2">
              <div className="bg-blue-600 h-2" style={{ width: '60%' }}></div>
            </div>
          </div> */}

          {/* Action Buttons */}
          <div className="space-y-4 font-serif">
            {/* <button className="w-full flex items-center justify-between p-3 bg-white border-2 border-gray-800 hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <Trophy className="w-5 h-5 text-amber-600" />
                <span>Citations</span>
              </div>
              <span className="text-sm bg-gray-100 px-2 py-1">1,234</span>
            </button> */}
            <button
              className="w-full flex items-center justify-between p-3 bg-white border-2 border-gray-800 hover:bg-gray-50 cursor-not-allowed"
              disabled
            >
              <div className="flex items-center space-x-3">
                <Wallet className="w-5 h-5 text-blue-500" />
                <span className="flex items-center gap-1">
                  Connect Wallet
                  <Lock className="w-4 h-4 text-gray-500 ml-2" />
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
