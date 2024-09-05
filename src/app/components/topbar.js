"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MdOutlineSettings } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";

const Topbar = ({ sidePanelStat, setSidePanelStat, userData, buttonRef }) => {
  const [isBodyClassActive, setIsBodyClassActive] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [settingRotate, setSettingRotate] = useState(false);

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

  function handleButtonClick() {
    setIsBodyClassActive((prev) => !prev);
  }

  const rightsidebar = () => {
    setSettingRotate(!settingRotate);
    document.body.classList.add("right-bar-enabled");
  };

  return (
    <header className="!w-full !h-16 py-1 z-[100] !bg-[#ffffff] flex justify-center shadow-md fixed top-0">
      <div className=" w-[98%] h-full  flex justify-between items-center px-2">
        {sidePanelStat ? (
          <div className="p-2">
            <img
              src="/login-logo.png"
              className="w-20 m-auto object-center"
              alt="Logo"
            />
          </div>
        ) : (
          <div className="p-2">
            <img
              src="/login-logo.png"
              className="w-20 m-auto object-center"
              alt="Logo"
            />
          </div>
        )}
        <div className="flex items-center justify-end gap-3 w-1/5 ">
          <Link href={"/profile"} className="flex items-center gap-2 group">
            <p className="text-black !mb-0 mobile:hidden ipad:block  font-Satoshi font-[500]">
              {username}
            </p>
            <div className="size-10 bg-slate-300/40 text-black rounded-full overflow-hidden flex justify-center items-center cursor-pointer group-hover:bg-slate-300/70 transition-all duration-300">
              {avatar ? (
                <div className="overflow-hidden">
                  <img
                    src={(process.env.NEXT_PUBLIC_BASE_URL || "") + avatar}
                    className="tablet:w-[35px] mobile:w-[25px]"
                  />
                </div>
              ) : (
                <FaRegUser className="text-2xl" />
              )}
            </div>{" "}
          </Link>
          <div
            onClick={rightsidebar}
            className={`size-10  rounded-full flex justify-center items-center cursor-pointer hover:bg-slate-300/70 transition-all duration-300`}
          >
            {" "}
            <MdOutlineSettings
              className={`text-3xl cursor-pointer transition-all duration-300 ${
                settingRotate ? "rotate-90" : ""
              }`}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
