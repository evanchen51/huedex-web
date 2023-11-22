import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import { LOCALSTORAGE_KEY_PATH_ORIGIN } from "../constants"
import { d } from "../displayTexts"
import { useGetCurrentUserQuery } from "../generated/graphql"
import { HextoHSL, colors } from "../utils/colors"
import { noBrowser } from "../utils/noBrowser"
import { useGetDisplayLanguage } from "../utils/useGetDisplayLanguage"

const Header: React.FC<{ home?: boolean; visitor?: boolean }> = ({ home }) => {
	const L = useGetDisplayLanguage()
	const router = useRouter()
	const [menuToggle, setMenuToggle] = useState("closed")
	const [{ data: loginData, fetching: loginFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})

	const scrollRef = useRef<number>()
	const [headerToggle, setHeaderToggle] = useState(true)

	// const [windowWidth, setWindowWidth] = useState(0)

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
		if (
			window.scrollY > scrollRef.current &&
			window.scrollY > 100 &&
			menuToggle === "closed" &&
			window.innerWidth <= 640
		) {
			setHeaderToggle(false)
		} else if (window.scrollY < scrollRef.current || window.scrollY <= 100) {
			setHeaderToggle(true)
		}
		scrollRef.current = window.scrollY
	}, 250)
	useEffect(() => {
		// setWindowWidth(window.innerWidth)
		return () => {
			clearInterval(scrollChecker)
		}
	}, [])

	return (
		<div
			className="fixed flex w-full flex-row items-center justify-between bg-background bg-opacity-50 pl-6 pr-6 pb-3 pt-3.5 font-bold tracking-wider text-foreground backdrop-blur-lg transition sm:pl-9 sm:pr-3 sm:backdrop-blur-sm"
			style={{
				zIndex:
					menuToggle === "closed"
						? typeof window !== "undefined" && window.innerWidth > 640
							? 20
							: 50
						: 70,
				// paddingTop: visitor ? "24px" : "24px",
				transform: headerToggle ? "translateY(0%)" : "translateY(-100%)",
				// boxShadow:"inset 0px -4px 6px 2px rgba(255,255,255,0.5)"
			}}
		>
			<Link href="/" as={`/`}>
				<div
					className="flex w-[36vw] flex-col items-baseline text-lg tracking-wider sm:flex-row"
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
						className="h-5 fill-foreground sm:ml-[8vw]"
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
			<div className="hidden w-[36vw] flex-row items-center justify-end font-normal tracking-wider sm:flex">
				{!noBrowser() && !loginFetching && loginData?.getCurrentUser && (
					<>
						<Link href="/create-poll-check">
							<div
								className="flex flex-row items-center rounded-full py-3 px-6"
								style={{
									cursor: router.asPath === "/create-poll" ? "default" : "pointer",
									backgroundColor:
										router.asPath === "/create-poll"
											? `hsl(${HextoHSL(colors["background"]).h},${
													HextoHSL(colors["background"]).s
											  }%,${HextoHSL(colors["background"]).l - 2}%)`
											: colors["background"],
								}}
								onMouseEnter={(e) => {
									if (router.asPath === "/create-poll") return
									const { h, s, l } = HextoHSL(colors["background"])
									e.currentTarget.style.backgroundColor = `hsl(${h},${s}%,${l - 2}%)`
								}}
								onMouseLeave={(e) => {
									if (router.asPath === "/create-poll") return
									e.currentTarget.style.backgroundColor = colors["background"]
								}}
							>
								<div className="flex flex-row items-end">
									<div className="h-2 w-[2.5px] rounded-[1px] bg-foreground" />
									<div className="mx-[2.5px] h-3 w-[2.5px] rounded-[1px] bg-foreground" />
									<div className="h-1.5 w-[2.5px] rounded-[1px] bg-foreground" />
								</div>
								<div className="ml-3 text-foreground ">{d(L, "make a poll")}</div>
							</div>
						</Link>
						<Link href="/user/[id]" as={`/user/${loginData?.getCurrentUser.id}`}>
							<div
								className="ml-0 flex flex-row items-center rounded-full py-3 px-6"
								onMouseEnter={(e) => {
									const { h, s, l } = HextoHSL(colors["background"])
									e.currentTarget.style.backgroundColor = `hsl(${h},${s}%,${l - 2}%)`
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = colors["background"]
								}}
							>
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
						<Link href="/settings">
							<div
								className="ml-0 mr-3 flex flex-row items-center rounded-full py-4 px-4"
								style={{
									cursor: router.asPath === "/settings" ? "default" : "pointer",
									backgroundColor:
										router.asPath === "/settings"
											? `hsl(${HextoHSL(colors["background"]).h},${
													HextoHSL(colors["background"]).s
											  }%,${HextoHSL(colors["background"]).l - 2}%)`
											: colors["background"],
								}}
								onMouseEnter={(e) => {
									if (router.asPath === "/settings") return
									const { h, s, l } = HextoHSL(colors["background"])
									e.currentTarget.style.backgroundColor = `hsl(${h},${s}%,${l - 2}%)`
								}}
								onMouseLeave={(e) => {
									if (router.asPath === "/settings") return
									e.currentTarget.style.backgroundColor = colors["background"]
								}}
							>
								<svg
									className="h-3.5 fill-foreground"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
								>
									<path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
								</svg>
							</div>
						</Link>
					</>
				)}
				{!noBrowser() && !loginFetching && !loginData?.getCurrentUser && (
					<>
						<button
							className="mb-1 mr-3 flex w-fit cursor-pointer flex-row items-center justify-center self-center rounded-full border-[0.5px] border-foreground bg-background px-5 py-3.5"
							onClick={() => {
								localStorage.setItem(LOCALSTORAGE_KEY_PATH_ORIGIN, router.asPath)
								location.href = process.env.NEXT_PUBLIC_API_URL + "/auth/google"
							}}
							onMouseEnter={(e) => {
								const { h, s, l } = HextoHSL(colors["background"])
								e.currentTarget.style.backgroundColor = `hsl(${h},${s}%,${l - 3}%)`
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = colors["background"]
							}}
						>
							<svg
								className="mr-4 h-3.5 fill-foreground"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 488 512"
							>
								<path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
							</svg>
							<div className="font- text-sm tracking-wider text-foreground">
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
			</div>
			<div
				className="absolute top-[2vw] right-[2vw] z-10 flex h-max w-max flex-col items-end tracking-wider text-background transition"
				style={{
					visibility: menuToggle === "closed" ? "hidden" : "visible",
					opacity: menuToggle === "open" ? "1" : "0",
				}}
			>
				<div className="pointer-events-none absolute top-[-24px] right-[-24px] h-[120vh] w-[120vw] bg-foreground opacity-20" />
				<div className="z-10 flex h-max w-[96vw] flex-col rounded-xl bg-foreground px-7 py-5 text-sm font-normal tracking-wider">
					{!noBrowser() && !loginFetching && loginData?.getCurrentUser && (
						<>
							<Link href="/user/[id]" as={`/user/${loginData?.getCurrentUser.id}`}>
								<div className="mb-6 mt-0 ml-1 flex flex-row items-center">
									<div className="font-light">{loginData.getCurrentUser.displayName}</div>
								</div>
								{/* <div className="mt-4 h-[0.5px] w-full bg-secondary opacity-30" /> */}
							</Link>
							<Link href="/user/[id]" as={`/user/${loginData?.getCurrentUser.id}`}>
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
								<div className="mt-5 h-[0.5px] w-full bg-secondary opacity-30" />
							</Link>
							<Link href="/settings">
								<div className="mt-5 mb-1 ml-1 flex flex-row items-center">
									<svg
										className="h-3.5 fill-background"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 512 512"
									>
										<path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
									</svg>
									<div className="ml-4 text-background">{d(L, "settings")}</div>
								</div>
							</Link>
						</>
					)}
					{!noBrowser() && !loginFetching && !loginData?.getCurrentUser && (
						<>
							<button
								className="mb-1 mr-auto flex w-fit cursor-pointer flex-row items-center justify-center self-center rounded-full border-[0.5px] border-background bg-foreground px-5 py-3.5"
								onClick={() => {
									localStorage.setItem(LOCALSTORAGE_KEY_PATH_ORIGIN, router.asPath)
									location.href = process.env.NEXT_PUBLIC_API_URL + "/auth/google"
								}}
								onMouseEnter={(e) => {
									const { h, s, l } = HextoHSL(colors["foreground"])
									e.currentTarget.style.backgroundColor = `hsl(${h},${s}%,${l + 8}%)`
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = colors["foreground"]
								}}
							>
								<svg
									className="mr-4 h-3.5 fill-background"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 488 512"
								>
									<path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
								</svg>
								<div className="text-sm font-light tracking-wider text-background">
									{d(L, "Continue with Google")}
								</div>
							</button>
							<div className="mt-4 h-[0.5px] w-full bg-secondary opacity-30" />
							<div className="mt-4 flex w-full flex-row items-center opacity-50">
								<div className="flex flex-row items-end">
									<div className="h-2 w-[2.5px] rounded-[1px] bg-secondary" />
									<div className="mx-[2.5px] h-3 w-[2.5px] rounded-[1px] bg-secondary" />
									<div className="h-1.5 w-[2.5px] rounded-[1px] bg-secondary" />
								</div>
								<div className="ml-3 text-secondary ">{d(L, "make a poll")}</div>
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
	)
}

export default Header
