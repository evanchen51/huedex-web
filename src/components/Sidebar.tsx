import { useRouter } from "next/router"
import React from "react"
import { LOCALSTORAGE_KEY_PATH_ORIGIN } from "../constants"
import { d } from "../displayTexts"
import { useGetCurrentUserQuery } from "../generated/graphql"
import { HextoHSL, colors } from "../utils/colors"
import { noBrowser } from "../utils/noBrowser"
import { useGetDisplayLanguage } from "../utils/useGetDisplayLanguage"
import LoadingSpinner from "./LoadingSpinner"

const Sidebar: React.FC<{}> = ({}) => {
	const L = useGetDisplayLanguage()
	// const {sidebarRef}=useSidebarScroller()
	const router = useRouter()
	const [{ data: loginData, fetching: loginFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})

	return (
		<div
			className="fixed top-0 z-10 hidden h-screen flex-col overflow-y-scroll bg-background px-9 tracking-wider lg:flex"
			style={{ width: "calc(( 100vw - 560px ) / 2)" }}
			// ref={sidebarRef}
		>
			<div className="mt-32 mb-[40vh] h-max">
				<div className="flex flex-col">
					<div className="flex flex-row items-center">
						<div className="mr-3 h-4 w-4">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
								<path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
							</svg>
						</div>
						<div className="relative w-full text-base font-medium">
							<div
								className="absolute top-[0.5px] left-0 w-full cursor-text bg-transparent transition-[left]"
								onClick={(e) => {
									const input = e.currentTarget.nextElementSibling as HTMLElement
									e.currentTarget.innerText = d(L, "coming soon")
									e.currentTarget.style.left = "6px"
									e.currentTarget.style.opacity = "0.3"
									e.currentTarget.style.fontWeight = "400"
									input.focus()
								}}
							>
								{d(L, "Search . . .")}
							</div>
							<input
								className="bg-transparent outline-none"
								onBlur={(e) => {
									const placeholder = e.currentTarget.previousElementSibling as HTMLElement
									placeholder.innerText = d(L, "Search . . .")
									placeholder.style.left = "0px"
									placeholder.style.opacity = "1"
									placeholder.style.fontWeight = "500"
								}}
								onChange={(e) => {
									e.currentTarget.value = ""
								}}
							></input>
						</div>
					</div>
				</div>
				<div className="mt-3 mb-20 h-[1px] w-[88%] shrink-0 bg-secondary opacity-50" />
				{loginFetching && <LoadingSpinner />}
				{loginData?.getCurrentUser && (
					<div className="">
						<div className="text-sm font-medium">
							<div>{d(L, "Topics you might be interested in:")}</div>
							<div className="mt-2 font-normal opacity-30">{d(L, "coming soon")}</div>
						</div>
						<div className="mt-12 text-sm font-medium">
							<div>
								{d(L, "These people might have similar opinions or tastes with you:")}
							</div>
							<div className="mt-2 font-normal opacity-30">{d(L, "coming soon")}</div>
						</div>
						<div className="mt-12 text-sm font-medium">
							<div>{d(L, "Following:")}</div>
							<div className="mt-2 font-normal opacity-30">{d(L, "coming soon")}</div>
						</div>
					</div>
				)}
				<div className="mt-12 text-sm font-medium">
					<div>{d(L, "Hot Topics:")}</div>
					<div className="mt-2 font-normal opacity-30">{d(L, "coming soon")}</div>
				</div>
				{loginFetching && <LoadingSpinner />}
				{!loginFetching && !loginData?.getCurrentUser && (
					<div
						className="mt-14 hidden w-[84%] cursor-pointer flex-col items-center rounded-[44px] border-[1.5px] border-white pt-9 pb-8 transition-shadow xl:flex"
						style={{
							boxShadow:
								"0px 2px 12px -4px rgb(0 0 0 / 0.1), 0px 0px 6px -4px rgb(0 0 0 / 0.1), inset 0px 0px 8px 2px rgb(252 252 252 / 0.75)",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.boxShadow =
								"0px 4px 18px -8px rgb(0 0 0 / 0.2), 0px 2px 8px -6px rgb(0 0 0 / 0.15), inset 0px 0px 8px 2px rgb(252 252 252 / 0.75)"
						}}
						onMouseDown={(e) => {
							e.currentTarget.style.boxShadow =
								"0px 2px 16px -8px rgb(0 0 0 / 0.1), 0px 0px 8px -8px rgb(0 0 0 / 0.1), inset 0px 0px 8px 2px rgb(252 252 252 / 0.75)"
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.boxShadow =
								"0px 2px 12px -4px rgb(0 0 0 / 0.1), 0px 0px 6px -4px rgb(0 0 0 / 0.1), inset 0px 0px 8px 2px rgb(252 252 252 / 0.75)"
						}}
						onClick={() => {
							localStorage.setItem(LOCALSTORAGE_KEY_PATH_ORIGIN, router.asPath)
							location.href = process.env.NEXT_PUBLIC_API_URL + "/auth/google"
						}}
					>
						<div className="font- mt-0 flex flex-col items-start text-sm">
							<button
								className="flex w-fit cursor-pointer flex-row items-center justify-center rounded-full border-[0.5px] border-foreground bg-transparent fill-foreground px-5 py-3.5 tracking-wider text-foreground"
								onMouseEnter={(e) => {
									const { h, s, l } = HextoHSL(colors["background"])
									e.currentTarget.style.backgroundColor = `hsl(${h},${s}%,${l - 2}%)`
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = "transparent"
								}}
							>
								<svg
									className="mr-4 h-3.5"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 488 512"
								>
									<path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
								</svg>
								<div className="font- text-sm">{d(L, "Login/Join with Google")}</div>
							</button>
							{/* <div className="ml-3 mr-2 text-sm font-light">{d(L, "to")}</div> */}
							<div className="mt-4 flex flex-row items-center">
								<div className="">{d(L, "to")}</div>
								<div className="ml-2 mr-1 flex h-5 w-5 items-center justify-center pb-[1px]">
									<svg
										className="h-4 fill-foreground"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 576 512"
									>
										<path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
									</svg>
								</div>
								<div className="font-bold">{d(L, "vote_Sidebar")}</div>
								<div className="">{d(L, ", ")}</div>
								<div className="ml-2">{d(L, "make")}</div>
								<div className="mr-[5px] ml-2 flex h-5 w-5 items-center justify-center">
									<div className="flex h-4 flex-row items-end pb-[1px]">
										<div className="h-2.5 w-[4px] rounded-[1.5px] bg-foreground" />
										<div className="mx-[2px] h-3.5 w-[4px] rounded-[1.5px] bg-foreground" />
										<div className="h-2 w-[4px] rounded-[1.5px] bg-foreground" />
									</div>
								</div>
								<div className="font-bold">{d(L, "polls_Sidebar")}</div>
								<div className="">{d(L, ", ")}</div>
							</div>
							<div className="mt-3.5 flex flex-row items-center">
								<div className="whitespace-nowrap">{d(L, "and discover")}</div>
								<div className="ml-2 mr-[7px] flex h-5 w-5 items-center justify-center">
									<svg
										className="h-[20px] fill-foreground"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 512 512"
									>
										<path d="M208 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V256.9l-28.6 47.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6h29.7c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L328 256.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H248zM7 7C16.4-2.3 31.6-2.3 41 7l80 80c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L7 41C-2.3 31.6-2.3 16.4 7 7zM471 7c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-80 80c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9L471 7zM7 505c-9.4-9.4-9.4-24.6 0-33.9l80-80c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9L41 505c-9.4 9.4-24.6 9.4-33.9 0zm464 0l-80-80c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l80 80c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0z" />
									</svg>
								</div>
								<div className="mr-2 font-bold">{d(L, "people")}</div>
								<div className="">{d(L, "with")}</div>
							</div>
							<div className="mt-3.5 font-bold">{d(L, "similar opinions & tastes!")}</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default Sidebar
