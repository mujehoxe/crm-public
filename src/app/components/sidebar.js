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
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ sidePanelStat, setSidePanelStat, buttonRef }) => {
  const handleLogout = () => {
    axios
      .post("/api/users/logout")
      .then(() => {
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error("Failed to logout inactive user:", error);
      });
  };

  const userdata = TokenDecoder();
  const userid = userdata ? userdata.id : null;
  const userrole = userdata ? userdata.role : null;
  const hidden = ["Admin", "superAdmin", "Operations", "HR"];

  const pathname = usePathname();

  const path = usePathname();

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
    if (index == 5) {
      handleLogout();
    }
  };
  const divRef = useRef(null);

  // Effect to add and remove click outside event listener
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
      icon: <HomeIcon className="ml-3 w-6 text-gray-400" />,
      visibility: ["all"],
    },
    {
      id: 1,
      name: "staff",
      link: "/Staff",
      icon: <UserGroupIcon className="ml-3 w-6 text-gray-400" />,
      notifications: 5,
      visibility: ["hr", "admin", "superadmin"],
    },
    {
      id: 2,
      name: "leads",
      link: "",
      icon: <IoGitNetworkSharp className="ml-3 w-6 text-gray-400" />,
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
      icon: <ClipboardDocumentCheckIcon className="ml-3 w-6 text-gray-400" />,
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
      icon: <FaHandshake className="ml-3 w-6 text-gray-400" />,
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

    {
      id: 5,
      name: "Log out",
      icon: (
        <ArrowLeftStartOnRectangleIcon className="ml-3 w-6 text-gray-400" />
      ),
      visibility: ["all"],
    },
  ];

  return (
    <Menu
      as="div"
      className={`fixed top-0 h-screen bg-gray-900 text-gray-100 shadow-lg z-[200] transition-all duration-300 ease-in-out ${
        sidePanelStat ? "w-64" : "w-20"
      }`}
    >
      <div className="flex p-2 py-3 bg-gray-800">
        <MenuButton
          onClick={() => {
            setSidePanelStat(!sidePanelStat);
          }}
          className={`flex py-2 items-center ${
            !sidePanelStat && "justify-center pl-0"
          } w-full rounded-lg transition-colors pl-1 duration-200 text-gray-400 hover:bg-gray-700 hover:text-white`}
        >
          <Bars3Icon className="text-xl mx-3 w-6 text-gray-400" />
          {sidePanelStat && (
            <span className="capitalize whitespace-nowrap">Collapse</span>
          )}
        </MenuButton>
      </div>

      <div className="relative flex flex-col h-full my-2">
        <nav className="flex flex-col flex-grow overflow-y-auto">
          <ul className="flex flex-1 flex-col space-y-2 px-2 w-full h-full">
            {sideMenus.map(
              (item, index) =>
                (item.visibility?.includes(userrole?.toLowerCase()) ||
                  item.visibility?.includes("all")) && (
                  <li key={item.id}>
                    <Link
                      href={item.link || "#"}
                      className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                        pathname === item.link
                          ? "bg-gray-700 text-white"
                          : "text-gray-400 hover:bg-gray-700 hover:text-white"
                      } ${
                        item.name === "Log out"
                          ? "hover:bg-red-600 hover:text-white mt-auto"
                          : ""
                      }`}
                      onClick={() => sideHandler(index)}
                    >
                      <span className="text-xl mr-3">{item.icon}</span>
                      {sidePanelStat && (
                        <span className="flex-1 capitalize whitespace-nowrap">
                          {item.name}
                        </span>
                      )}
                      {sidePanelStat && item.notifications && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-900 bg-blue-200 rounded-full">
                          {item.notifications}
                        </span>
                      )}
                      {sidePanelStat && item.nested && (
                        <FaChevronDown
                          className={`ml-auto transition-transform duration-200 ${
                            currentIndex === index ? "transform rotate-180" : ""
                          }`}
                        />
                      )}
                    </Link>
                    {sidePanelStat && currentIndex === index && item.nested && (
                      <ul className="pl-6 mt-2 space-y-2">
                        {item.nested.map(
                          (subItem, subIndex) =>
                            subItem.visibility?.includes(
                              userrole.toLowerCase()
                            ) && (
                              <li key={subIndex}>
                                <Link
                                  href={subItem.link || "#"}
                                  className={`block p-2 rounded-lg transition-colors duration-200 ${
                                    pathname === subItem.link
                                      ? "bg-gray-700 text-white"
                                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                  }`}
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            )
                        )}
                      </ul>
                    )}
                  </li>
                )
            )}
          </ul>
        </nav>
        {sidePanelStat && (
          <div className="mt-auto">
            <img
              src="/login-logo.png"
              className="w-20 m-auto px-2 object-center"
            />
          </div>
        )}
      </div>
      <div className="relative flex flex-col h-screen my-2">
        <nav className="flex flex-col flex-grow overflow-y-auto">
          <ul className="space-y-2 px-2 w-full">
            {sideMenus.map(
              (item, index) =>
                (item.visibility?.includes(userrole?.toLowerCase()) ||
                  item.visibility?.includes("all")) && (
                  <li key={item.id}>
                    <Link
                      href={item.link || "#"}
                      className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
                        pathname === item.link
                          ? "bg-gray-700 text-white"
                          : "text-gray-400 hover:bg-gray-700 hover:text-white"
                      } ${
                        item.name === "Log out"
                          ? "hover:bg-red-600 hover:text-white"
                          : ""
                      }`}
                      onClick={() => sideHandler(index)}
                    >
                      <span className="text-xl mr-3">{item.icon}</span>
                      {sidePanelStat && (
                        <span className="flex-1 capitalize whitespace-nowrap">
                          {item.name}
                        </span>
                      )}
                      {sidePanelStat && item.notifications && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-gray-900 bg-blue-200 rounded-full">
                          {item.notifications}
                        </span>
                      )}
                      {sidePanelStat && item.nested && (
                        <FaChevronDown
                          className={`ml-auto transition-transform duration-200 ${
                            currentIndex === index ? "transform rotate-180" : ""
                          }`}
                        />
                      )}
                    </Link>
                    {sidePanelStat && currentIndex === index && item.nested && (
                      <ul className="pl-6 mt-2 space-y-2">
                        {item.nested.map(
                          (subItem, subIndex) =>
                            subItem.visibility?.includes(
                              userrole.toLowerCase()
                            ) && (
                              <li key={subIndex}>
                                <Link
                                  href={subItem.link || "#"}
                                  className={`block p-2 rounded-lg transition-colors duration-200 ${
                                    pathname === subItem.link
                                      ? "bg-gray-700 text-white"
                                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                                  }`}
                                >
                                  {subItem.name}
                                </Link>
                              </li>
                            )
                        )}
                      </ul>
                    )}
                  </li>
                )
            )}
          </ul>
        </nav>
      </div>
    </Menu>
  );
};

export default Sidebar;
