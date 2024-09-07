import React from 'react';
import {
	Cog6ToothIcon,
	TagIcon,
	UserGroupIcon,
	FlagIcon,
	MegaphoneIcon,
} from '@heroicons/react/24/outline';

const navigation = [
	{name: 'Tags', href: '/Tags', icon: TagIcon, count: '3', current: false},
	{
		name: 'Role Permissions',
		href: '/RolePerms',
		icon: UserGroupIcon,
		current: false
	},
	{
		name: 'Status',
		href: '/Status/list',
		icon: FlagIcon,
		count: '3',
		current: false
	},
	{
		name: 'Source',
		href: '/Source/list',
		icon: MegaphoneIcon,
		count: '3',
		current: false
	},
];

function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

const Rightbar = ({userData, setSettingsBarOpen}) => {
	const userRole = userData ? userData.role : null;

	const filteredNavigation = navigation.filter(item => {
		if (item.name === 'Role Permissions') {
			return userRole === 'superAdmin' || userRole === 'Admin';
		}
		if (item.name === 'Tags') {
			return ['superAdmin', 'Admin', 'Marketing', 'Operations', 'BussinessHead', 'PNL', 'TL', 'FOS', 'ATL'].includes(userRole);
		}
		return true;
	});

	return (
		<div
			className="flex grow h-screen flex-col gap-y-5 overflow-y-auto border-l border-gray-200 bg-white px-6">
			<div className="flex h-16 shrink-0 items-center justify-between">
				<h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
				<button
					onClick={() => setSettingsBarOpen(false)}
					className="rounded-md bg-white p-2 text-gray-400 hover:text-miles-600"
				>
					<span className="sr-only">Close panel</span>
					<Cog6ToothIcon className="h-6 w-6" aria-hidden="true"/>
				</button>
			</div>
			<nav className="flex flex-1 flex-col">
				<ul role="list"
						className="flex flex-col relative space-y-2 p-2 h-full">
					{filteredNavigation.map((item) => (
						<li key={item.name} className="w-full">
							<a
								href={item.href}
								className={`group flex gap-x-3 w-full text-nowrap rounded-md p-2 text-sm font-semibold leading-6 items-center transition-colors duration-200
									text-gray-700 hover:bg-gray-50 hover:text-miles-700
									${item.current && 'bg-gray-50 text-miles-600'}`
								}
							>
								<div className="flex gap-x-4 justify-between">
									<item.icon
										className={classNames(
											item.current ? 'text-miles-600' : 'text-gray-600 group-hover:text-miles-700',
											'h-6 w-6 shrink-0'
										)}
										aria-hidden="true"
									/>
									{item.name}
								</div>
								<div className="flex ml-auto w-9 gap-x-3 justify-between">
									{item.count &&
										<span
											className="min-w-max whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-center text-xs font-medium leading-5 text-gray-600 ring-1 ring-inset ring-gray-200"
											aria-hidden="true"
										>
										 {item.count}
									</span>
									}
								</div>
							</a>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
};

export default Rightbar;