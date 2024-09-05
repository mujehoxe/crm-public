// RootLayout.js
"use client";
import { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../page.module.css";
import TokenDecoder from "./Cookies";
import Loader from "./Loader"; // Import the Loader component
import Rightbar from "./Rightbar";
import Jsfile from "./Scripts";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const [sidePanelStat, setSidePanelStat] = useState(false);
  const userData = TokenDecoder();
  const buttonRef = useRef(null);

  useEffect(() => {
    setLoading(false);
  });

  return (
    <>
      {loading && <Loader />} {/* Conditionally render the loader */}
      <div>
        <div>
          <div id="layout-wrapper">
            <div className="relative">
              <div className="fixed top-0 w-full bg-white z-[40]">
                <Topbar
                  sidePanelStat={sidePanelStat}
                  setSidePanelStat={setSidePanelStat}
                  userData={userData}
                  buttonRef={buttonRef}
                />
              </div>
              <div className="fixed no-underline top-0 left-0 z-[40]">
                <Sidebar
                  sidePanelStat={sidePanelStat}
                  setSidePanelStat={setSidePanelStat}
                  buttonRef={buttonRef}
                  userData={userData}
                />
              </div>
            </div>

            <div className={``}>
              <div className={``}>
                <ToastContainer />
                {children}
              </div>
            </div>
            <Rightbar userData={userData} />
          </div>
        </div>
        <Jsfile />
      </div>
    </>
  );
}
