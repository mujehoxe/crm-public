"use client";
import { Menu, MenuButton } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { BellIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";

const Topbar = ({ sidePanelStat, setSidePanelStat, userData, buttonRef }) => {
  const [isBodyClassActive, setIsBodyClassActive] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  const username = userData ? userData.name : null;
  const avatar = userData ? userData.avatar : null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(max-width: 768px)");

      const handleMediaQueryChange = (e) => {
        setIsMobileScreen(e.matches);
      };

      handleMediaQueryChange(mediaQuery);
      mediaQuery.addListener(handleMediaQueryChange);

      return () => {
        mediaQuery.removeListener(handleMediaQueryChange);
      };
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const body = document.querySelector("body");
      if (body) {
        if (isBodyClassActive) {
          body.classList.add("sidebar-enable", "vertical-collpsed");
        } else {
          body.classList.remove("vertical-collpsed");
        }
      }
    }
  }, [isBodyClassActive]);

  useEffect(() => {
    if (isMobileScreen) {
      if (isBodyClassActive) {
        document.body.classList.remove("vertical-collpsed");

        document.body.classList.add("sidebar-enable");
      } else {
        document.body.classList.remove("sidebar-enable");
      }
      document.body.classList.remove("vertical-collapsed");
    } else {
      document.body.classList.remove("sidebar-enable");
      if (!isBodyClassActive) {
        document.body.classList.add("vertical-collapsed");
      } else {
        document.body.classList.remove("vertical-collapsed");
      }
    }
  }, [isBodyClassActive, isMobileScreen]);

  return (
    <header className="top-0 flex h-[4.5rem] items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 bg-white justify-between gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center">
          <img src="/login-logo.png" className="h-8 ml-20 w-auto" alt="Logo" />
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
            aria-hidden="true"
          />

          <Menu as="div" className="relative">
            <MenuButton className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">Open user menu</span>
              <div className="flex items-center">
                {avatar ? (
                  <img
                    src={(process.env.NEXT_PUBLIC_BASE_URL || "") + avatar}
                    className="h-8 w-8 rounded-full"
                    alt={username}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center">
                    <FaRegUser className="text-gray-400" />
                  </div>
                )}
                <span className="hidden lg:flex lg:items-center">
                  <span
                    className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                    aria-hidden="true"
                  >
                    {username}
                  </span>
                  <ChevronDownIcon
                    className="ml-2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </MenuButton>
            {/* <MenuItems className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              {userNavigation.map((item) => (
                <MenuItem key={item.name}>
                  {({ active }) => (
                    <a
                      href={item.href}
                      className={`block px-3 py-1 text-sm leading-6 text-gray-900 ${
                        active ? "bg-gray-50" : ""
                      }`}
                    >
                      {item.name}
                    </a>
                  )}
                </MenuItem>
              ))}
            </MenuItems> */}
          </Menu>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
