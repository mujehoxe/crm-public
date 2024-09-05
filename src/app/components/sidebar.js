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
import { useRouter } from "next/router";
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
      className={`fixed top-0 h-screen bg-gray-900 text-gray-100 shadow-lg transition-all duration-300 ease-in-out ${
        sidePanelStat ? "w-64" : "w-20"
      }`}
    >
      <div className="relative flex flex-col h-full overflow-hidden">
        <div className="p-2 py-3 bg-gray-800">
          <div
            onClick={() => {
              setSidePanelStat(!sidePanelStat);
            }}
            className="flex w-full py-2 gap-1 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700"
          >
            <MenuButton className="flex px-2 items-center transition-colors duration-200 hover:text-white">
              <Bars3Icon className={`ml-3 w-6 text-gray-400`} />
            </MenuButton>
            {sidePanelStat && (
              <span className="flex-1 text-xs capitalize align-middle my-auto whitespace-nowrap">
                Collapse
              </span>
            )}
          </div>
        </div>
        <nav className="flex flex-col flex-grow overflow-y-auto my-2">
          <ul className="flex flex-1 flex-col space-y-2 px-2 w-full h-full">
            {sideMenus.map(
              (item, index) =>
                (item.visibility?.includes(userrole?.toLowerCase()) ||
                  item.visibility?.includes("all")) && (
                  <li
                    key={item.id}
                    className={`${item.name === "Log out" && "mt-auto"}`}
                  >
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
                      } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                      onClick={() => !loading && sideHandler(index)}
                    >
                      <span className="mr-3 text-2xl">{item.icon}</span>
                      {sidePanelStat && (
                        <span className="flex-1 text-xs capitalize whitespace-nowrap">
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
                                  className={`block p-2 text-xs rounded-lg transition-colors duration-200 ${
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
