import { assets } from '../assets/assets'
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useAppContext } from '../context/AppContext'

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const navigate = useNavigate()

  const { favoriteMovies } = useAppContext()
  
  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
    closeMobileMenu();
  };

  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5'>
      <Link to="/" className='max-md:flex-1'>
        <img src={assets} alt="" className='w-36 h-auto' />
      </Link>

      {/* Desktop Navigation */}
      <div className='hidden md:flex items-center gap-8 px-8 py-3 rounded-full backdrop-blur bg-white/10 border border-gray-300/20'>
        <Link onClick={scrollToTop} to="/" className='text-red-500 hover:text-red-400 transition-colors'>Home</Link>
        <Link onClick={scrollToTop} to="/theaters" className='text-red-500 hover:text-red-400 transition-colors'>Theaters</Link>
        <Link onClick={scrollToTop} to="/releases" className='text-red-500 hover:text-red-400 transition-colors'>Releases</Link>
        <Link onClick={scrollToTop} to="/movies" className='text-red-500 hover:text-red-400 transition-colors'>Movies</Link>
        {favoriteMovies.length > 0 && (
          <Link onClick={scrollToTop} to="/favorites" className='text-red-500 hover:text-red-400 transition-colors flex items-center gap-1'>
            Favorites ({favoriteMovies.length})
          </Link>
        )}
      </div>

      {/* Desktop Right Side */}
      <div className='hidden md:flex items-center gap-8'>
        <SearchIcon className='w-6 h-6 cursor-pointer hover:text-red-500 transition-colors' />
        {
          !user ? (
            <button onClick={openSignIn} className='px-7 py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Login</button>
          ) : (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action label='My Bookings' labelIcon={<TicketPlus width={15} />} onClick={() => navigate('/my-bookings')} />
              </UserButton.MenuItems>
            </UserButton>
          )
        }
      </div>

      {/* Mobile Menu Button */}
      <MenuIcon className='md:hidden w-8 h-8 cursor-pointer hover:text-red-500 transition-colors' onClick={() => setIsOpen(true)} />

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className='fixed inset-0 bg-black/50 z-40 md:hidden'
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Navigation Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black/95 backdrop-blur-md z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Mobile Menu Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-700'>
          <img src={assets} alt="" className='w-24 h-auto' />
          <XIcon 
            className='w-8 h-8 cursor-pointer hover:text-red-500 transition-colors' 
            onClick={closeMobileMenu} 
          />
        </div>

        {/* Mobile Navigation Links */}
        <div className='flex flex-col p-6 space-y-6'>
          <Link 
            onClick={scrollToTop} 
            to="/" 
            className='text-white text-lg font-medium hover:text-red-500 transition-colors py-2'
          >
            Home
          </Link>
          <Link 
            onClick={scrollToTop} 
            to="/theaters" 
            className='text-white text-lg font-medium hover:text-red-500 transition-colors py-2'
          >
            Theaters
          </Link>
          <Link 
            onClick={scrollToTop} 
            to="/releases" 
            className='text-white text-lg font-medium hover:text-red-500 transition-colors py-2'
          >
            Releases
          </Link>
          <Link 
            onClick={scrollToTop} 
            to="/movies" 
            className='text-white text-lg font-medium hover:text-red-500 transition-colors py-2'
          >
            Movies
          </Link>
          {favoriteMovies && (
            <Link 
              onClick={scrollToTop} 
              to="/favorites" 
              className='text-white text-lg font-medium hover:text-red-500 transition-colors py-2 flex items-center gap-2'
            >
              Favorites ({favoriteMovies.length})
            </Link>
          )}
        </div>

        {/* Mobile Search and Auth Section */}
        <div className='absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700'>
          <div className='flex flex-col space-y-4'>
            {/* Search Button */}
            <button className='flex items-center justify-center gap-2 w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors'>
              <SearchIcon className='w-5 h-5' />
              <span className='text-white font-medium'>Search Movies</span>
            </button>

            {/* Authentication */}
            {!user ? (
              <button 
                onClick={() => {
                  openSignIn();
                  closeMobileMenu();
                }} 
                className='w-full py-3 bg-primary hover:bg-primary-dull transition rounded-lg font-medium cursor-pointer'
              >
                Login
              </button>
            ) : (
              <div className='flex items-center justify-between'>
                <span className='text-white font-medium'>Welcome back!</span>
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action 
                      label='My Bookings' 
                      labelIcon={<TicketPlus width={15} />} 
                      onClick={() => {
                        navigate('/my-bookings');
                        closeMobileMenu();
                      }} 
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
