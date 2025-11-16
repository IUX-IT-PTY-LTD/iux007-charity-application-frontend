'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FaShoppingBasket, FaUser } from 'react-icons/fa';
import { apiService } from '@/api/services/app/apiService';
import { ENDPOINTS } from '@/api/config';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '@/store/features/userSlice';
import  Loader  from '@/components/shared/loader';
import toast from 'react-hot-toast';


const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const cartCount = useSelector((state) => state.user.cart.cartCount);
  const [menus, setMenus] = useState([]);
  const [settings, setSettings] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdownState, setMobileDropdownState] = useState(null);

  const fetchMenus = async () => {
    try {
      const response = await apiService.get(ENDPOINTS.COMMON.MENUS);
      setMenus(response.data);
    } catch (error) {
      console.error('Error fetching menus:', error);
      setMenus([]);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await apiService.get(ENDPOINTS.COMMON.SETTINGS);
      const settingsData = {
        site_name:
          response.data.find((item) => item.key === 'company_name')?.value || 'Default Name',
        logo:
          response.data.find((item) => item.key === 'company_logo')?.value ||
          '/assets/img/logo.svg',
      };
      setSettings(settingsData);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSettings({
        site_name: 'Default Site Name',
        logo: '/assets/img/logo.svg',
      });
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await apiService.post(ENDPOINTS.AUTH.LOGOUT);
      localStorage.removeItem('token');
      dispatch(logoutAction());
      toast.success('Logout successful');
      setIsLoading(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/login');
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchSettings();
  }, []);

  const toggleBurgerMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (menuId) => {
    setOpenDropdown(openDropdown === menuId ? null : menuId);
  };


  const closeDropdowns = () => {
    setOpenDropdown(null);
  };

  const handleMenuLinkClick = () => {
    closeMobileMenu();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        closeDropdowns();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex shadow-md py-4 px-4 sm:px-10 bg-white min-h-[70px] tracking-wide relative z-50">
      <div className="container mx-auto">
      {isLoading && <Loader title="Logging Out..." />}
        <div className="flex flex-wrap items-center justify-between gap-5 w-full">
          <Link href="./" className="flex justify-start items-center gap-3">
            <Image src={settings?.logo || "/assets/img/logo.svg"} width={100} height={100} alt="logo" className="w-8" />
            <span>
              <strong className="text-primary font-semibold text-lg">{settings?.site_name}</strong>
            </span>
          </Link>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
              onClick={closeMobileMenu}
            />
          )}

          {/* Mobile Menu */}
          <div
            className={`
              lg:hidden fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl z-50
              transform transition-transform duration-300 ease-in-out overflow-hidden
              ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <Link href="./" onClick={handleMenuLinkClick}>
                <Image
                  src={settings?.logo || "/assets/img/logo.svg"}
                  alt="logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="overflow-y-auto h-full pb-20">
              <ul className="p-4 space-y-1">
                {menus.map((menu, index) => (
                  <li
                    key={index}
                    className={`border-b border-gray-100 last:border-b-0 ${
                      pathname === '/' + menu.slug ? 'bg-primary/5' : ''
                    }`}
                  >
                    {menu.children && menu.children.length > 0 ? (
                      <div className="relative">
                        {/* Mobile: Collapsible Parent */}
                        <button
                          onClick={() => {
                            const newState = mobileDropdownState === menu.id ? null : menu.id;
                            setMobileDropdownState(newState);
                            setOpenDropdown(newState);
                          }}
                          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                        >
                          <span className={`font-medium ${
                            pathname === '/' + menu.slug ? 'text-primary' : 'text-gray-700'
                          }`}>
                            {menu.name}
                          </span>
                          <svg
                            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
                              mobileDropdownState === menu.id ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Mobile Dropdown */}
                        <div
                          className={`
                            bg-gray-50 border-l-4 border-primary
                            transition-all duration-300 ease-in-out
                            ${mobileDropdownState === menu.id ? 'block' : 'hidden'}
                          `}
                        >
                          <div className="py-3">
                            {menu.children.map((child, childIndex) => (
                              <Link
                                key={childIndex}
                                href={`/${child.slug}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  // Close dropdown and menu, then navigate
                                  setOpenDropdown(null);
                                  closeMobileMenu();
                                  router.push(`/${child.slug}`);
                                }}
                                className="block px-6 py-3 text-sm text-gray-700 hover:text-primary hover:bg-white transition-colors duration-200 border-b border-gray-200 last:border-b-0"
                              >
                                <div className="flex items-center">
                                  <svg className="w-2 h-2 text-primary mr-3" fill="currentColor" viewBox="0 0 8 8">
                                    <circle cx="4" cy="4" r="2"/>
                                  </svg>
                                  {child.name}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={`/${menu.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          closeMobileMenu();
                          router.push(`/${menu.slug}`);
                        }}
                        className={`block px-4 py-3 font-medium transition-colors duration-200 ${
                          pathname === '/' + menu.slug
                            ? 'text-primary bg-primary/5'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                        }`}
                      >
                        {menu.name}
                      </Link>
                    )}
                  </li>
                ))}

                {/* User Account Section for Mobile */}
                {isAuthenticated && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Account
                    </div>
                    <Link
                      href="./profile"
                      onClick={(e) => {
                        e.preventDefault();
                        closeMobileMenu();
                        router.push('./profile');
                      }}
                      className="block px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200"
                    >
                      Profile
                    </Link>
                    <Link
                      href="./change-password"
                      onClick={(e) => {
                        e.preventDefault();
                        closeMobileMenu();
                        router.push('./change-password');
                      }}
                      className="block px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200"
                    >
                      Change Password
                    </Link>
                    <button
                      onClick={(e) => {
                        handleLogout(e);
                        closeMobileMenu();
                      }}
                      className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </ul>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="max-lg:hidden">
            <ul className="nav-menu lg:flex gap-x-5">
              {menus.map((menu, index) => (
                <li
                  key={index}
                  className={`relative ${pathname === '/' + menu.slug ? 'active' : ''}`}
                >
                  {menu.children && menu.children.length > 0 ? (
                    <div className="relative dropdown-container">
                      <button
                        onClick={() => toggleDropdown(menu.id)}
                        className="hover:text-primary text-gray-500 font-semibold text-[15px] flex items-center gap-1"
                      >
                        {menu.name}
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${
                            openDropdown === menu.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Desktop Dropdown */}
                      <div
                        className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200 ${
                          openDropdown === menu.id ? 'block' : 'hidden'
                        }`}
                      >
                        {menu.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            href={`/${child.slug}`}
                            onClick={() => closeDropdowns()}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors duration-200 no-underline hover:no-underline"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={`/${menu.slug}`}
                      className="hover:text-primary text-gray-500 block font-semibold text-[15px]"
                    >
                      {menu.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex max-lg:ml-auto space-x-3">
            <Link
                  href={'./checkout'}
                  className="w-[40px] h-[40px] flex justify-center items-center text-xl relative rounded-full font-bold text-white border-2 border-primary bg-primary transition-all ease-in-out duration-300 hover:!bg-transparent hover:text-primary"
                >
                  <FaShoppingBasket />
                  <span className="absolute cart-amount bg-black text-xs w-[20px] h-[20px] flex justify-center items-center rounded-full font-normal top-[-5px] right-[-5px]">
                    {cartCount}
                  </span>
                </Link>
            {isAuthenticated ? (
              <>
               
                <div className="relative">
                  <button
                    onClick={() => {
                      const dropdown = document.getElementById('userDropdown');
                      dropdown.classList.toggle('hidden');

                      // Add click event listener to close dropdown when clicking outside
                      const closeDropdown = (e) => {
                        if (!dropdown.contains(e.target) && e.target.tagName !== 'BUTTON') {
                          dropdown.classList.add('hidden');
                          document.removeEventListener('click', closeDropdown);
                        }
                      };
                      document.addEventListener('click', closeDropdown);
                    }}
                    className="w-[40px] h-[40px] flex justify-center items-center text-xl rounded-full font-bold text-white border-2 border-primary bg-primary transition-all ease-in-out duration-300 hover:!bg-transparent hover:text-primary"
                  >
                    <FaUser />
                  </button>
                  <div
                    id="userDropdown"
                    className="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
                  >
                    <Link
                      href="./profile"
                      onClick={() => document.getElementById('userDropdown').classList.add('hidden')}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Profile
                    </Link>
                    <Link
                      href="./change-password"
                      onClick={() => document.getElementById('userDropdown').classList.add('hidden')}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Change Password
                    </Link>
                    <button
                      onClick={(e) => {
                        document.getElementById('userDropdown').classList.add('hidden');
                        handleLogout(e);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link
                href={'./login'}
                className="px-4 py-2 text-sm rounded-full font-bold text-white border-2 border-primary bg-primary transition-all ease-in-out duration-300 hover:bg-transparent hover:text-[#007bff]"
              >
                Login
              </Link>
            )}

            <button id="toggleOpen" onClick={toggleBurgerMenu} className="lg:hidden">
              <svg
                className="w-7 h-7"
                fill="#000"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
