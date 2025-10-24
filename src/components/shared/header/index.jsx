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
    const menu = document.getElementById('collapseMenu');
    if (menu) {
      menu.classList.toggle('active');
    }
  };

  const toggleDropdown = (menuId) => {
    setOpenDropdown(openDropdown === menuId ? null : menuId);
  };

  const closeDropdowns = () => {
    setOpenDropdown(null);
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

          <div
            id="collapseMenu"
            className="max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50"
          >
            <button
              id="toggleClose"
              onClick={toggleBurgerMenu}
              className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 fill-black"
                viewBox="0 0 320.591 320.591"
              >
                <path
                  d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
                  data-original="#000000"
                ></path>
                <path
                  d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
                  data-original="#000000"
                ></path>
              </svg>
            </button>

            <ul className="nav-menu lg:flex gap-x-5 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
              <li className="mb-6 hidden max-lg:block">
                <Link href="./">
                  <Image
                    src={settings?.logo || "/assets/img/logo.svg"}
                    alt="logo"
                    width={100}
                    height={100}
                    className="w-36"
                  />
                </Link>
              </li>

              {menus.map((menu, index) => (
                <li
                  key={index}
                  className={`relative max-lg:border-b border-gray-300 max-lg:py-3 px-3 ${
                    pathname === '/' + menu.slug ? 'active' : ''
                  }`}
                >
                  {menu.children && menu.children.length > 0 ? (
                    <div 
                      className="relative dropdown-container"
                    >
                      <button
                        onClick={() => toggleDropdown(menu.id)}
                        className="hover:text-primary text-gray-500 font-semibold text-[15px] flex items-center gap-1 w-full text-left"
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
                        className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200 max-lg:hidden ${
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
                      
                      {/* Mobile Dropdown */}
                      <div
                        className={`lg:hidden mt-2 pl-4 space-y-2 ${
                          openDropdown === menu.id ? 'block' : 'hidden'
                        }`}
                      >
                        {menu.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            href={`/${child.slug}`}
                            onClick={() => closeDropdowns()}
                            className="block py-2 text-gray-600 hover:text-primary transition-colors duration-200 border-l-2 border-gray-200 pl-3 no-underline hover:no-underline"
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
