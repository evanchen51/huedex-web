"use client"

import Link from "next/link"
import React, { useState } from "react"
import { GetCurrentUserDocument, GetCurrentUserQuery } from "../generated/graphql"
import { colors } from "../utils/colors"
import { noBrowser } from "../utils/noBrowser"
import { useQuery } from "@urql/next"

const Header: React.FC<{ page?: string }> = ({ page }) => {
	const [menuToggle, setMenuToggle] = useState("closed")
	const [{ data: userData, fetching: userFetching }] = useQuery<GetCurrentUserQuery>({
		query: GetCurrentUserDocument,
		// pause: noBrowser(),
	})
	return (
		<div
			className="fixed flex w-full flex-row items-center justify-between bg-background bg-opacity-50 px-8 pt-8 pb-8 font-bold tracking-wider text-foreground backdrop-blur-lg"
			style={{ zIndex: menuToggle === "closed" ? 50 : 70 }}
		>
			<Link href="/" as={`/`}>
				<div className="w-9">piniondex.</div>
			</Link>
			{page && page === "Home" && (
				<Link href="/" as={`/`}>
					<svg
						className="h-6 fill-foreground pt-1"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 576 512"
					>
						<path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
					</svg>
				</Link>
			)}
			<div className="relative flex w-9 cursor-pointer items-center justify-center">
				<svg
					className="z-20 w-4 transition"
					style={{
						transform: menuToggle === "open" ? "rotate(90deg)" : "rotate(0deg)",
						fill: menuToggle === "open" ? colors["background"] : colors["foreground"],
					}}
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 448 512"
					onClick={() => {
						if (menuToggle === "closed") {
							setMenuToggle("open")
							return
						}
						if (menuToggle === "open") {
							setMenuToggle("exit")
							setTimeout(() => {
								setMenuToggle("closed")
							}, 300)
						}
					}}
				>
					<path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
				</svg>
				<div
					className="absolute top-[-12px] right-[-4px] z-10 flex h-max w-max flex-col items-end transition"
					style={{
						visibility: menuToggle === "closed" ? "hidden" : "visible",
						opacity: menuToggle === "open" ? "1" : "0",
					}}
				>
					<div className="z-10 flex w-full flex-row items-end justify-end">
						<div className="relative mb-[-0.5px] mr-[-0.5px] h-2 w-2 bg-foreground">
							<div className="absolute bottom-[0.5px] right-[0.5px] h-2 w-2 rounded-br-xl bg-background" />
						</div>
						<div className="mb-[-0.5px] h-10 w-11 shrink-0 rounded-t-lg bg-foreground" />
					</div>
					<div className="z-10 flex h-max w-max flex-col rounded-b-lg rounded-tl-lg bg-foreground px-6 py-5 text-sm font-normal tracking-wider text-background">
						{!noBrowser() && !userFetching && userData?.getCurrentUser && (
							<Link href="/user/[id]" as={`/user/${userData?.getCurrentUser.id}`}>
								<div className="flex flex-row items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-3 fill-background"
										viewBox="0 0 448 512"
									>
										<path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
									</svg>
									<div className="ml-4">my profile</div>
								</div>
								<div className="mt-4 h-[0.5px] w-full bg-secondary opacity-30" />
							</Link>
						)}
						<div className="mt-4 flex flex-row items-center">
							<div className="flex flex-row items-end">
								<div className="h-2 w-[2.5px] rounded-[1px] bg-background" />
								<div className="mx-[2.5px] h-3 w-[2.5px] rounded-[1px] bg-background" />
								<div className="h-1.5 w-[2.5px] rounded-[1px] bg-background" />
							</div>
							<div className="ml-4">make a poll</div>
						</div>
					</div>
					<div
						className="absolute top-[-96px] right-[-96px] z-0 h-[120vh] w-[120vw] cursor-default"
						onClick={() => {
							if (menuToggle === "open") {
								setMenuToggle("exit")
								setTimeout(() => {
									setMenuToggle("closed")
								}, 300)
							}
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export default Header
