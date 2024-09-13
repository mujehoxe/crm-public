"use client"
import dynamic from 'next/dynamic';
import RootLayout from "@/app/components/layout";
import React from "react";

const RealtimeMap = dynamic(() => import('./RealtimeMap'), {
	ssr: false
});

export default function Home() {
	return (
		<RootLayout>
			<div className="container p-4 flex flex-col justify-center overflow-y-hidden mx-auto">
				<h1 className="text-2xl font-bold text-gray-900 mb-6">Agent Locations</h1>
				<RealtimeMap/>
			</div>
		</RootLayout>
);
}