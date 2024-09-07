import React from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {CheckCircleIcon} from '@heroicons/react/20/solid';
import InlineLoader from "@/app/components/InlineLoader";

export default function UpdateDescriptionInput({
	isUpdateDescriptionInput,
	loading,
	setUpdateBody,
	handleUpdateSubmit
}) {
	return (
		<AnimatePresence>
			{isUpdateDescriptionInput && (
				<motion.div className="p-3">

					<motion.div
						initial={{opacity: 0, height: 0}}
						animate={{opacity: 1, height: 'auto'}}
						exit={{opacity: 0, height: 0}}
						transition={{duration: 0.3}}
						className="space-y-2 overflow-hidden"
					>
						<motion.label
							initial={{opacity: 0, y: -10}}
							animate={{opacity: 1, y: 0}}
							transition={{delay: 0.1}}
							htmlFor="update-description"
							className="block text-sm font-medium text-gray-500"
						>
							Describe your changes
						</motion.label>
						<motion.div
							initial={{opacity: 0, y: 10}}
							animate={{opacity: 1, y: 0}}
							transition={{delay: 0.2}}
							className="relative flex rounded-md shadow-sm space-x-2"
						>
							<input
								type="text"
								name="update-description"
								id="update-description"
								className="block w-full rounded-lg text-gray-900 bg-slate-100 focus:border border-gray-300 px-2 py-1 shadow-sm sm:text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition-colors duration-200 placeholder-gray-400"
								placeholder="Enter your update description"
								autoFocus={true}
								disabled={loading}
								onClick={(e) => e.stopPropagation()}
								onBlur={(e) =>
									setUpdateBody((prevBody) => ({
										...prevBody,
										updateDescription: e.target.value,
									}))
								}
							/>
							<div
								className="inset-y-0 right-0 flex items-center">
								{loading ? (
									<InlineLoader disableText={true} />
								) : (
									<motion.div
										whileHover={{scale: 1.1}}
										whileTap={{scale: 0.9}}
									>
										<CheckCircleIcon
											className="h-5 w-5 text-green-400 cursor-pointer"
											aria-hidden="true"
											onClick={handleUpdateSubmit}
										/>
									</motion.div>
								)}
							</div>
						</motion.div>
					</motion.div>
				</motion.div>

			)}
		</AnimatePresence>
	);
}