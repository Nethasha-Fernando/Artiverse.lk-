import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { icons } from '../../Constants/icons';
import { images } from '../../Constants/images';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus the input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search logic here
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <header className="w-full bg-page-background border-b h-16">
      <div className="w-full px-2 sm:px-4 lg:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0">
          <img src={images.logo} alt="Company Logo" className="h-12 w-auto" />
        </div>

        {/* Navigation Menu */}
        <nav className={`hidden md:flex space-x-6 lg:space-x-8 xl:space-x-10 flex-1 justify-center transition-all duration-300 ${
          isSearchOpen ? 'mr-48 lg:mr-64' : ''
        }`}>
          {[
            { label: 'Home', to: '/' },
            { label: 'Arts', to: '/artworks' },
            { label: 'Artists', to: '/artists' },
            { label: 'Events', to: '#' },
            { label: 'Contact Us', to: '#' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="relative text-text-body hover:text-text-main-heading transition-colors font-regular font-body whitespace-nowrap
              after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full hover:font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center  flex-shrink-0 relative">
          {/* Search Bar - appears when isSearchOpen is true */}
          {isSearchOpen && (
            <div className="hidden md:block absolute mr-1 right-full top-1/2 transform -translate-y-1/2 w-60">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="flex items-center w-full bg-card-background rounded-xl border border-border focus-within:border-sec-button-stroke shadow-sm h-9">
                  <div className="pl-3">
                    <img src={icons.search} alt="search" width={16} height={16} className="opacity-60" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-2 py-2 bg-transparent outline-none text-text-body placeholder-text-footnote text-sm"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="pr-2"
                    >
                      <img
                        src={icons.close}
                        alt="Clear"
                        width={14}
                        height={14}
                        className="opacity-60 hover:opacity-100 transition"
                      />
                    </button>

                  )}
                </div>
              </form>
            </div>
          )}


          {/* Search Icon */}
          <button
            onClick={toggleSearch}
            className={`h-9 w-9 mr-3 flex items-center justify-center transition-colors ${
              isSearchOpen
                ? 'bg-primary text-white hover:bg-red-500 rounded-xl'
                : 'rounded-xl hover:bg-accent'
            }`}
          >
            <img
              src={icons.search}
              alt="search"
              width={20}
              height={20}
              className={isSearchOpen ? 'filter brightness-0 invert' : ''}
            />
          </button>

          {/* Shopping Cart Icon */}
          <button className="h-9 w-9 mr-4 flex items-center justify-center rounded-xl hover:bg-accent transition-colors">
            <img src={icons.shopping_cart} alt="shopping cart" width={20} height={20} />
          </button>

          {/* Sign in Button */}
          <button className="px-4 sm:px-5 lg:px-6 py-2 rounded-full bg-gradient-to-b from-[#FF5C5C] to-[#C41A1A] text-white font-medium font-body shadow-md hover:shadow-[0_2px_10px_0_#BF4D4D] transition whitespace-nowrap text-sm sm:text-base">
            Sign in
          </button>
        </div>
      </div>

      {/* Mobile Search Bar - appears below header on mobile */}
      {isSearchOpen && (
        <div className="block md:hidden px-4 py-3 bg-page-background border-b">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="flex items-center w-full bg-card-background rounded-lg border border-border focus-within:border-sec-button-stroke shadow-sm">
              <div className="pl-3">
                <img src={icons.search} alt="search" width={18} height={18} className="opacity-60" />
              </div>
              <input
                type="text"
                placeholder="Search for arts, artists, events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-3 bg-transparent outline-none text-text-body placeholder-text-footnote text-sm"
              />
               {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="pr-2"
                    >
                      <img
                        src={icons.close}
                        alt="Clear"
                        width={14}
                        height={14}
                        className="opacity-60 hover:opacity-100 transition"
                      />
                    </button>

                  )}
            </div>
          </form>
        </div>
      )}

      {/* Mobile Navigation Menu */}
      <nav className={`md:hidden px-4 py-2 border-t bg-gray-50 ${isSearchOpen ? 'border-t-0' : ''}`}>
        <div className="flex flex-wrap justify-center gap-4">
          {[
            { label: 'Home', to: '/' },
            { label: 'Arts', to: '/artworks' },
            { label: 'Artists', to: '/artists' },
            { label: 'Events', to: '#' },
            { label: 'Contact Us', to: '#' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="relative text-text-body hover:text-text-main-heading transition-colors font-regular font-body text-sm
                after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full hover:font-medium"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
