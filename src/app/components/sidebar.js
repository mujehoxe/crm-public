"use client";

import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaHandshake } from "react-icons/fa6";
import { IoGitNetworkSharp } from "react-icons/io5";
import TokenDecoder from "./Cookies";

import { Menu, MenuButton } from "@headlessui/react";
import {
  ChevronRightIcon,
  ClipboardDocumentCheckIcon,
  HomeIcon,
  MapIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  Cog6ToothIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { toast } from "react-toastify";

const Sidebar = ({ setSettingsBarOpen }) => {
  const [sidePanelStat, setSidePanelStat] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);
    axios
      .post("/api/users/logout")
      .then(() => {
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Failed to logout:", error);
        toast.error("Failed to logout");
        setLoading(false);
      });
  };

  const userData = TokenDecoder();
  const userRole = userData ? userData.role : null;

  const pathname = usePathname();

  const [currentIndex, setCurrentIndex] = useState(null);

  const sideHandler = (index) => {
    if (sidePanelStat)
      if (currentIndex === index) {
        setCurrentIndex(null);
      } else {
        setCurrentIndex(index);
      }
    if (sideMenus[index].nested) {
      setSidePanelStat(true);
    }
  };

  useEffect(() => {
    const parentItem = sideMenus.find((item) =>
      item.nested?.some((subItem) => subItem.link === pathname)
    );
    if (parentItem) {
      setCurrentIndex(parentItem.id);
    } else {
      setCurrentIndex(null);
    }
  }, [pathname]);

  const isActive = (item) => {
    if (item.link === pathname) return true;
    if (item.nested) {
      return item.nested.some((subItem) => subItem.link === pathname);
    }
    return false;
  };

  const divRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      divRef.current &&
      !divRef.current.contains(event.target) &&
      !(buttonRef.current && buttonRef.current.contains(event.target))
    ) {
      setSidePanelStat(false);
    }
  };

  // Effect to add and remove click outside event listener
  useEffect(() => {
    if (sidePanelStat) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidePanelStat]);

  const sideMenus = [
    {
      id: 0,
      name: "profile",
      link: "/profile",
      icon: <HomeIcon className="ml-3 w-6" />,
      visibility: ["all"],
    },
    {
      id: 1,
      name: "staff",
      link: "/Staff",
      icon: <UserGroupIcon className="ml-3 w-6" />,
      notifications: 5,
      visibility: ["hr", "admin", "superadmin"],
    },
    {
      id: 2,
      name: "leads",
      link: "",
      icon: <IoGitNetworkSharp className="ml-3 w-6" />,
      nested: [
        {
          name: "Community Leads",
          link: "/Community-Leads",
          visibility: [
            "admin",
            "superadmin",
            "BusinessHead",
            "pnl",
            "tl",
            "atl",
            "fos",
            "operations",
            "marketing",
          ],
        },
      ],
      visibility: [
        "marketing",
        "admin",
        "superadmin",
        "operations",
        "BusinessHead",
        "pnl",
        "tl",
        "atl",
        "fos",
      ],
    },
    {
      id: 3,
      name: "reports",
      link: "",
      icon: <ClipboardDocumentCheckIcon className="ml-3 w-6" />,
      nested: [
        {
          name: "Timesheet",
          link: "/Timesheet",
          visibility: [
            "admin",
            "superadmin",
            "BusinessHead",
            "pnl",
            "tl",
            "atl",
            "fos",
            "hr",
          ],
        },
        {
          name: "Detailed progress report",
          link: "/Detailed-Progress-Report",
          visibility: [
            "admin",
            "superadmin",
            "hr",
            "BusinessHead",
            "pnl",
            "tl",
            "atl",
            "fos",
          ],
        },
      ],
      visibility: [
        "admin",
        "superadmin",
        "hr",
        "BusinessHead",
        "pnl",
        "tl",
        "atl",
        "fos",
      ],
    },
    {
      id: 4,
      name: "your deals",
      link: "",
      icon: <FaHandshake className="ml-3 w-6" />,
      nested: [
        {
          name: "Deals Approvals",
          link: "/Your-Deals",
          visibility: [
            "admin",
            "superadmin",
            "BusinessHead",
            "pnl",
            "tl",
            "atl",
            "fos",
            "marketing",
            "operations",
          ],
        },
        {
          name: "KYC and Sanction",
          link: "/KYC-and-Sanctions",
          visibility: ["admin", "superadmin", "operations"],
        },
        {
          name: "MIS",
          link: "/mis",
          visibility: ["admin", "superadmin", "finance"],
        },
      ],
      visibility: [
        "admin",
        "superadmin",
        "BusinessHead",
        "pnl",
        "tl",
        "atl",
        "fos",
        "operations",
        "marketing",
        "finance",
      ],
    },
    {
      id: 5,
      name: "locate",
      link: "/locate",
      icon: <MapIcon className="ml-3 w-6" />,
      visibility: ["all"],
    },
    {
      id: 6,
      name: "permissions",
      link: "/permissions",
      icon: (
        <div className="relative ml-3 w-6">
          <UserIcon className="relative -top-[1px] -left-[2.7px]" />
          <ShieldCheckIcon className="absolute z-10 -bottom-[1px] -right-[2.7px] w-4" />
        </div>
      ),
      visibility: ["all"],
    },
  ];

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setSidePanelStat(false);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`fixed ${sidePanelStat && "inset-0"} top-0 left-0 z-40`}>
      <Menu
        as="div"
        ref={menuRef}
        className={`select-none z-50 bg-gray-900 text-gray-100 shadow-lg ${
          sidePanelStat ? "w-full sm:w-64" : "w-20"
        } transition-all duration-300 ease-in-out overflow-hidden flex flex-col`}
      >
        <div className="flex-shrink-0 flex h-[4.5rem] max-h-[4.5rem] min-h-[4.5rem] p-2 py-3 shadow-sm bg-gray-800">
          <div
            onClick={() => setSidePanelStat(!sidePanelStat)}
            className="flex w-full py-2 gap-1 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 cursor-pointer"
          >
            <MenuButton className="flex my-auto px-2 items-center transition-colors duration-200 hover:text-white">
              <Bars3Icon className="ml-3 w-6 text-gray-400" />
            </MenuButton>
            <span
              className={`flex-1 text-sm font-medium capitalize align-middle my-auto whitespace-nowrap transition-opacity duration-300 ${
                sidePanelStat ? "opacity-100" : "opacity-0"
              }`}
            >
              {sidePanelStat ? "Collapse" : ""}
            </span>
          </div>
        </div>

        <nav
          className={`${
            sidePanelStat ? "" : "hidden sm:block"
          }  h-[calc(100vh-72px)]`}
        >
          <ul className="relative space-y-2 px-2 py-2 flex flex-col h-full">
            {sideMenus.map((item) =>
              item.visibility?.includes(userRole?.toLowerCase()) ||
              item.visibility?.includes("all") ? (
                <li key={item.id}>
                  <Link
                    href={item.link || "#"}
                    className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                      isActive(item)
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:bg-gray-700 hover:text-white"
                    } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                    onClick={() => !loading && sideHandler(item.id)}
                  >
                    <span className="text-2xl min-w-[1.5rem]">{item.icon}</span>
                    <span
                      className={`flex-1 ml-3 text-sm capitalize whitespace-nowrap transition-opacity duration-300 ${
                        sidePanelStat ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {sidePanelStat ? item.name : ""}
                    </span>
                    {item.notifications && (
                      <span
                        className={`inline-flex items-center justify-center px-2 py-1 text-sm font-bold leading-none text-gray-900 bg-miles-200 rounded-full transition-opacity duration-300 ${
                          sidePanelStat ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {sidePanelStat ? item.notifications : ""}
                      </span>
                    )}
                    {item.nested && (
                      <ChevronRightIcon
                        className={`ml-auto size-4 transition-transform duration-200 ${
                          currentIndex === item.id ? "transform rotate-90" : ""
                        } ${sidePanelStat ? "opacity-100" : "opacity-0"}`}
                      />
                    )}
                  </Link>
                  {currentIndex === item.id && sidePanelStat && item.nested && (
                    <ul
                      className={`pl-6 mt-2 space-y-2 transition-all duration-300 max-h-96 opacity-100 overflow-hidden`}
                    >
                      {item.nested.map((subItem, subIndex) =>
                        subItem.visibility?.includes(userRole.toLowerCase()) ? (
                          <li key={subIndex}>
                            <Link
                              href={subItem.link || "#"}
                              className={`block p-2 text-sm rounded-lg transition-colors duration-200 ${
                                pathname === subItem.link
                                  ? "bg-gray-700 text-white"
                                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
                              }`}
                            >
                              {subItem.name}
                            </Link>
                          </li>
                        ) : null
                      )}
                    </ul>
                  )}
                </li>
              ) : null
            )}
            <div className="absolute w-full right-0 px-2 bottom-0">
              <div className="border-t py-2 w-full space-y-2 border-gray-700">
                <li className="w-full">
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSettingsBarOpen((prev) => !prev);
                    }}
                    className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                      pathname === "/settings" && !loading
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:bg-gray-700 hover:text-white"
                    } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <Cog6ToothIcon className="ml-3 w-6 min-w-[1.5rem]" />
                    <span
                      className={`ml-3 text-sm capitalize whitespace-nowrap transition-opacity duration-300 ${
                        sidePanelStat ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {sidePanelStat ? "Settings" : ""}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    className={`flex items-center p-2 rounded-lg transition-colors duration-200 text-gray-400 hover:bg-red-700 ${
                      !loading ? "hover:text-white" : ""
                    } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <ArrowLeftStartOnRectangleIcon className="ml-3 w-6 min-w-[1.5rem]" />
                    <span
                      className={`ml-3 text-sm capitalize whitespace-nowrap transition-opacity duration-300 ${
                        sidePanelStat ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {sidePanelStat ? "Log out" : ""}
                    </span>
                  </Link>
                </li>
              </div>
            </div>
          </ul>
        </nav>
      </Menu>
    </div>
  );
};

export default Sidebar;
