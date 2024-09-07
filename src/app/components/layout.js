// RootLayout.js
"use client";
import {useEffect, useState} from "react";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../page.module.css";
import TokenDecoder from "./Cookies";
import Loader from "./Loader"; // Import the Loader component
import Rightbar from "./Rightbar";
import Jsfile from "./Scripts";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

export default function RootLayout({children}) {
	const [loading, setLoading] = useState(true);
	const [settingsBarOpen, setSettingsBarOpen] = useState(false);
	const userData = TokenDecoder();

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
							<div className="fixed top-0 w-full bg-white z-40">
								<Topbar userData={userData}/>
							</div>
							<div className="fixed no-underline top-0 left-0 z-40">
								<Sidebar setSettingsBarOpen={setSettingsBarOpen}/>
							</div>
						</div>

						<div className={``}>
							<div className={``}>
								<ToastContainer/>
								<div
									className={`ml-auto p-4 mt-[4.5rem] tablet:w-[calc(100%-80px)]`}
								>
									{children}
								</div>
							</div>
						</div>
						{settingsBarOpen && (
							<div className="fixed no-underline top-0 right-0 z-40">
								<Rightbar userData={userData} setSettingsBarOpen={setSettingsBarOpen}/>
							</div>
						)}
					</div>
				</div>
				<Jsfile/>
			</div>
		</>
	);
}
