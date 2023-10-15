import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import { LOCALSTORAGE_KEY_PATH_ORIGIN } from "../constants"
import { d } from "../displayTexts"
import { useGetCurrentUserQuery } from "../generated/graphql"
import { colors } from "../utils/colors"
import { noBrowser } from "../utils/noBrowser"
import { useGetDisplayLanguage } from "../utils/useGetDisplayLanguage"

const Header: React.FC<{ home?: boolean; visitor?: boolean }> = ({ home }) => {
	const L = useGetDisplayLanguage()
	const router = useRouter()
	const [menuToggle, setMenuToggle] = useState("closed")
	const [{ data: userData, fetching: userFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})

	const scrollRef = useRef<number>()
	const [headerToggle, setHeaderToggle] = useState(true)
	const scrollChecker = setInterval(() => {
		if (noBrowser()) return
		// console.log(window.scrollY, scrollRef.current)
		if (!scrollRef.current) {
			scrollRef.current = window.scrollY
			return
		}
		if (Math.abs(window.scrollY - scrollRef.current) < 50) {
			return
		}
		if (window.scrollY > scrollRef.current && window.scrollY > 100) {
			setHeaderToggle(false)
		} else if (window.scrollY < scrollRef.current || window.scrollY <= 100) {
			setHeaderToggle(true)
		}
		scrollRef.current = window.scrollY
	}, 250)
	useEffect(() => {
		return () => {
			clearInterval(scrollChecker)
		}
	}, [])

	return (
		<div
			className="fixed flex w-full flex-row items-center justify-between bg-background bg-opacity-50 px-9 pb-6 pt-6 font-bold tracking-wider text-foreground backdrop-blur-lg transition"
			style={{
				zIndex: menuToggle === "closed" ? 50 : 70,
				// paddingTop: visitor ? "24px" : "24px",
				transform: headerToggle ? "translateY(0%)" : "translateY(-100%)",
			}}
		>
			<Link href="/" as={`/`}>
				<div
					className="flex w-[36vw] flex-col items-baseline text-lg sm:flex-row"
					onClick={() => {
						if (router.asPath === "/") {
							router.reload()
						}
					}}
				>
					Huedex
					<div className="text-xs font-semibold text-secondary sm:pl-2">
						now in
						<span
							className="pl-1 pt-[1px] text-sm font-semibold text-yellow-400"
							style={{ textShadow: "0px 1px 12px rgb(250 204 21 / 0.33)" }}
						>
							Alpha
						</span>
					</div>
				</div>
			</Link>
			{home && (
				<Link href="/" as={`/`}>
					<svg
						className="h-5 fill-foreground"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 576 512"
						onClick={() => {
							if (router.asPath === "/") {
								router.reload()
							}
						}}
					>
						<path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
					</svg>
				</Link>
			)}
			<div className="hidden w-[36vw] flex-row items-center justify-end font-normal sm:flex">
				{!noBrowser() && !userFetching && userData?.getCurrentUser && (
					<>
						<Link href="/create-poll-check">
							<div className="flex flex-row items-center">
								<div className="flex flex-row items-end">
									<div className="h-2 w-[2.5px] rounded-[1px] bg-foreground" />
									<div className="mx-[2.5px] h-3 w-[2.5px] rounded-[1px] bg-foreground" />
									<div className="h-1.5 w-[2.5px] rounded-[1px] bg-foreground" />
								</div>
								<div className="ml-3 text-foreground">{d(L, "make a poll")}</div>
							</div>
						</Link>
						<Link href="/user/[id]" as={`/user/${userData?.getCurrentUser.id}`}>
							<div className="ml-8 flex flex-row items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-3 fill-foreground"
									viewBox="0 0 448 512"
								>
									<path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
								</svg>
								<div className="ml-3">{d(L, "my profile")}</div>
							</div>
						</Link>
					</>
				)}
				{!noBrowser() && !userFetching && !userData?.getCurrentUser && (
					<>
						<button
							className="mb-1 flex w-fit flex-row items-center justify-center self-center rounded-full border-[0.5px] border-foreground px-5 py-3.5"
							onClick={() => {
								localStorage.setItem(LOCALSTORAGE_KEY_PATH_ORIGIN, router.asPath)
								location.href = "http://localhost:4000/auth/google"
							}}
						>
							<svg
								className="mr-4 h-3.5 fill-foreground"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 488 512"
							>
								<path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
							</svg>
							<div className="text-sm font-light text-foreground">
								{d(L, "Login/Join with Google")}
							</div>
						</button>
					</>
				)}
			</div>
			<div className="relative flex w-[36vw] cursor-pointer items-center justify-end sm:hidden">
				<svg
					className="z-20 w-4 transition"
					style={{
						transform: menuToggle === "open" ? "rotate(135deg)" : "rotate(0deg)",
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
					className="absolute top-[-20px] right-[-20px] z-10 flex h-max w-max flex-col items-end text-background transition"
					style={{
						visibility: menuToggle === "closed" ? "hidden" : "visible",
						opacity: menuToggle === "open" ? "1" : "0",
					}}
				>
					<div className="pointer-events-none absolute top-[-24px] right-[-24px] h-[120vh] w-[120vw] bg-foreground opacity-20" />
					<div className="z-10 flex h-max w-[90vw] flex-col rounded-xl bg-foreground px-7 py-5 text-sm font-normal tracking-wider">
						{!noBrowser() && !userFetching && userData?.getCurrentUser && (
							<>
								<Link href="/user/[id]" as={`/user/${userData?.getCurrentUser.id}`}>
									<div className="mb-6 mt-0 ml-1 flex flex-row items-center">
										<div className="font-light">
											{userData.getCurrentUser.displayName}
										</div>
									</div>
									{/* <div className="mt-4 h-[0.5px] w-full bg-secondary opacity-30" /> */}
								</Link>
								<Link href="/user/[id]" as={`/user/${userData?.getCurrentUser.id}`}>
									<div className="ml-1 flex flex-row items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-3 fill-background"
											viewBox="0 0 448 512"
										>
											<path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
										</svg>
										<div className="ml-4">{d(L, "my profile")}</div>
									</div>
									<div className="mt-5 h-[0.5px] w-full bg-secondary opacity-30" />
								</Link>
								<Link href="/create-poll-check">
									<div className="mt-5 mb-1 ml-1 flex flex-row items-center">
										<div className="flex flex-row items-end">
											<div className="h-2 w-[2.5px] rounded-[1px] bg-background" />
											<div className="mx-[2.5px] h-3 w-[2.5px] rounded-[1px] bg-background" />
											<div className="h-1.5 w-[2.5px] rounded-[1px] bg-background" />
										</div>
										<div className="ml-4 text-background">{d(L, "make a poll")}</div>
									</div>
								</Link>
							</>
						)}
						{!noBrowser() && !userFetching && !userData?.getCurrentUser && (
							<>
								<button
									className="mb-1 mr-auto flex w-fit flex-row items-center justify-center self-center rounded-full border-[0.5px] border-background px-5 py-3.5"
									onClick={() => {
										localStorage.setItem(LOCALSTORAGE_KEY_PATH_ORIGIN, router.asPath)
										location.href = "http://localhost:4000/auth/google"
									}}
								>
									<svg
										className="mr-4 h-3.5 fill-background"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 488 512"
									>
										<path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
									</svg>
									<div className="text-sm font-light text-background">
										{d(L, "Continue with Google")}
									</div>
								</button>
								<div className="mt-4 h-[0.5px] w-full bg-secondary opacity-30" />
								<div className="mt-4 flex w-full flex-row items-center">
									<div className="flex flex-row items-end">
										<div className="h-2 w-[2.5px] rounded-[1px] bg-secondary" />
										<div className="mx-[2.5px] h-3 w-[2.5px] rounded-[1px] bg-secondary" />
										<div className="h-1.5 w-[2.5px] rounded-[1px] bg-secondary" />
									</div>
									<div className="ml-3 text-secondary">{d(L, "make a poll")}</div>
								</div>
							</>
						)}
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
