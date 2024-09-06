"use client";

import axios from "axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FaHandshake } from "react-icons/fa6";
import { IoGitNetworkSharp } from "react-icons/io5";
import TokenDecoder from "./Cookies";

import { Menu, MenuButton } from "@headlessui/react";
import {
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

const Sidebar = ({ sidePanelStat, setSidePanelStat, buttonRef }) => {
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

  const userdata = TokenDecoder();
  const userrole = userdata ? userdata.role : null;

  const pathname = usePathname();

  const [currentIndex, setCurrentIndex] = useState(null);

  const sideHandler = (index) => {
    if (currentIndex == index) {
      setCurrentIndex(null);
    } else {
      setCurrentIndex(index);
    }
    if (sideMenus[index].nested) {
      setSidePanelStat(true);
    }
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
            "bussinesshead",
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
        "bussinesshead",
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
            "bussinesshead",
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
            "bussinesshead",
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
        "bussinesshead",
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
            "bussinesshead",
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
        "bussinesshead",
        "pnl",
        "tl",
        "atl",
        "fos",
        "operations",
        "marketing",
        "finance",
      ],
    },
  ];

  return (
    <Menu
      as="div"
      className="fixed top-0 h-screen bg-gray-900 text-gray-100 shadow-lg transition-all duration-300 ease-in-out overflow-hidden"
      style={{ width: sidePanelStat ? "16rem" : "5rem" }}
    >
      <div className="flex flex-col h-full">
        <div className="p-2 py-3 bg-gray-800">
          <div
            onClick={() => setSidePanelStat(!sidePanelStat)}
            className="flex w-full py-2 gap-1 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 cursor-pointer"
          >
            <MenuButton className="flex px-2 items-center transition-colors duration-200 hover:text-white">
              <Bars3Icon className="ml-3 w-6 text-gray-400" />
            </MenuButton>
            <span
              className={`flex-1 text-xs capitalize align-middle my-auto whitespace-nowrap transition-opacity duration-300 ${
                sidePanelStat ? "opacity-100" : "opacity-0"
              }`}
            >
              {sidePanelStat ? "Collapse" : ""}
            </span>
          </div>
        </div>

        <nav className="flex-grow my-2">
          <ul className="space-y-2 px-2">
            {sideMenus.map((item, index) =>
              (item.visibility?.includes(userrole?.toLowerCase()) ||
                item.visibility?.includes("all")) &&
              item.name !== "Log out" ? (
                <li key={item.id}>
                  <Link
                    href={item.link || "#"}
                    className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                      pathname === item.link
                        ? "bg-gray-700 text-white"
                        : "text-gray-400 hover:bg-gray-700 hover:text-white"
                    } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                    onClick={() => !loading && sideHandler(index)}
                  >
                    <span className="text-2xl min-w-[1.5rem]">{item.icon}</span>
                    <span
                      className={`flex-1 ml-3 text-xs capitalize whitespace-nowrap transition-opacity duration-300 ${
                        sidePanelStat ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {sidePanelStat ? item.name : ""}
                    </span>
                    {item.notifications && (
                      <span
                        className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-900 bg-blue-200 rounded-full transition-opacity duration-300 ${
                          sidePanelStat ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {sidePanelStat ? item.notifications : ""}
                      </span>
                    )}
                    {item.nested && (
                      <FaChevronDown
                        className={`ml-auto transition-transform duration-200 ${
                          currentIndex === index ? "transform rotate-180" : ""
                        } ${sidePanelStat ? "opacity-100" : "opacity-0"}`}
                      />
                    )}
                  </Link>
                  {currentIndex === index && item.nested && (
                    <ul
                      className={`pl-6 mt-2 space-y-2 transition-all duration-300 ${
                        sidePanelStat
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      } overflow-hidden`}
                    >
                      {item.nested.map((subItem, subIndex) =>
                        subItem.visibility?.includes(userrole.toLowerCase()) ? (
                          <li key={subIndex}>
                            <Link
                              href={subItem.link || "#"}
                              className={`block p-2 text-xs rounded-lg transition-colors duration-200 ${
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
          </ul>
        </nav>

        <div className="mt-auto p-2">
          <ul className="space-y-2">
            <li
              onClick={() =>
                window.document.body.classList.toggle("right-bar-enabled")
              }
              className={`rounded-lg ${
                pathname === "/settings" && !loading
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <Link
                href=""
                onClick={(e) => e.preventDefault()}
                className={`flex text-inherit items-center p-2 transition-colors duration-200 ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <Cog6ToothIcon className="w-6 min-w-[1.5rem]" />
                <span
                  className={`ml-3 text-xs capitalize whitespace-nowrap transition-opacity duration-300 ${
                    sidePanelStat ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {sidePanelStat ? "Settings" : ""}
                </span>
              </Link>
            </li>
            <li
              onClick={handleLogout}
              className={`rounded-lg text-gray-400 hover:bg-gray-700 ${
                !loading ? "hover:text-white" : ""
              }`}
            >
              <Link
                href=""
                onClick={(e) => e.preventDefault()}
                className={`flex text-inherit items-center p-2 transition-colors duration-200 ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <ArrowLeftStartOnRectangleIcon className="w-6 min-w-[1.5rem]" />
                <span
                  className={`ml-3 text-xs capitalize whitespace-nowrap transition-opacity duration-300 ${
                    sidePanelStat ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {sidePanelStat ? "Log out" : ""}
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </Menu>
  );
};

export default Sidebar;
