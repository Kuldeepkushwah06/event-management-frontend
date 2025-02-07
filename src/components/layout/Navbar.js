import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Disclosure } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <Disclosure as="nav" className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link to="/" className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="ml-2 text-xl font-bold text-white">EventHub</span>
                </Link>
              </div>

              {/* Desktop menu */}
              <div className="hidden sm:flex sm:items-center sm:ml-6">
                <div className="flex space-x-4">
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/events/create"
                        className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Create Event
                      </Link>
                      <button
                        onClick={logout}
                        className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile menu button */}
              <div className="sm:hidden flex items-center">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none">
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/events/create"
                    className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Create Event
                  </Link>
                  <button
                    onClick={logout}
                    className="text-white hover:bg-blue-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default Navbar; 