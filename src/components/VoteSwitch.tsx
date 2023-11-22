import React, { useState } from "react"
import { d } from "../displayTexts"
import { useGetCurrentUserQuery } from "../generated/graphql"
import { colors } from "../utils/colors"
import { noBrowser } from "../utils/noBrowser"
import { useGetDisplayLanguage } from "../utils/useGetDisplayLanguage"
import { useVoteHandler } from "../utils/useVoteHandler"
import { LoginPrompt } from "./LoginPrompt"

const VoteSwitch: React.FC<{}> = ({}) => {
	const L = useGetDisplayLanguage()
	const [mode, setMode] = useState(true)

	const { loginPromptControl } = useVoteHandler()

	const [{ data: loginData, fetching: loginFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})

	return (
		<>
			<LoginPrompt control={loginPromptControl} />
			<div
				className="fixed left-4 bottom-4 z-[100] flex cursor-pointer flex-col rounded-b-[24px] rounded-tr-[24px] rounded-tl-[14px] border-2 border-white bg-background px-1.5 pt-1.5 pb-[5px] tracking-wider backdrop-blur-lg transition sm:bottom-9 sm:left-9 sm:rounded-t-[44px] sm:rounded-b-[44px] sm:px-6 sm:pb-5 sm:pt-[18px]"
				style={{
					boxShadow:
						"0px 2px 12px -4px rgb(0 0 0 / 0.15), 0px 0px 6px -4px rgb(0 0 0 / 0.15), inset 0px 0px 8px 4px rgb(252 252 252 / 0.75)",
					backgroundColor: mode ? colors["background"] + "F0" : colors["foreground"] + "F0",
					borderColor: mode ? "white" : colors["foreground"] + "D0",
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.boxShadow = `0px 4px 18px -8px rgb(0 0 0 / 0.3), 0px 2px 8px -6px rgb(0 0 0 / 0.3), inset 0px 0px 8px 4px rgb(${
						mode ? "252 252 252" : "40 40 40"
					} / 0.75)`
					const knob = e.currentTarget.querySelector("#knob") as HTMLElement
					knob.style.transform = "translateX(5%)"
				}}
				onMouseDown={(e) => {
					if (!loginFetching && !loginData?.getCurrentUser) {
						loginPromptControl.toggle({ state: true, message: d(L, "Login/Join to Vote") })
					}
					e.currentTarget.style.boxShadow =
						"0px 2px 16px -6px rgb(0 0 0 / 0.15), 0px 0px 8px -4px rgb(0 0 0 / 0.15), inset 0px 0px 8px 4px rgb(0 0 0 / 0.75)"
					const knob = e.currentTarget.querySelector("#knob") as HTMLElement
					knob.style.transform = "translateX(150%)"
					setMode(false)
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.boxShadow = `0px 2px 12px -4px rgb(0 0 0 / 0.15), 0px 0px 6px -4px rgb(0 0 0 / 0.15), inset 0px 0px 8px 4px rgb(${
						mode ? "252 252 252" : "40 40 40"
					} / 0.75)`
					if (!mode) return
					const knob = e.currentTarget.querySelector("#knob") as HTMLElement
					knob.style.transform = "translateX(0%)"
				}}
				onMouseUp={(e) => {
					e.currentTarget.style.boxShadow =
						"0px 4px 18px -8px rgb(0 0 0 / 0.3), 0px 2px 8px -6px rgb(0 0 0 / 0.3), inset 0px 0px 8px 4px rgb(40 40 40 / 0.75)"
					const e_1 = e.currentTarget
					setTimeout(() => {
						setMode(true)
						e_1.style.boxShadow =
							"0px 4px 18px -8px rgb(0 0 0 / 0.3), 0px 2px 8px -6px rgb(0 0 0 / 0.3), inset 0px 0px 8px 4px rgb(252 252 252 / 0.75)"
						const knob = e_1.querySelector("#knob") as HTMLElement
						knob.style.transform = "translateX(0%)"
					}, 1200)
				}}
				onClick={() => {}}
			>
				<div
					className="ml-0.5 text-[11px] font-bold leading-[15px] text-foreground opacity-100 sm:text-sm sm:leading-[20px]"
					style={{
						// textShadow: "0px 2px 6px rgba(0,0,0,0.1)"
						color: mode ? colors["foreground"] : colors["background"],
					}}
				>
					{d(L, mode ? "voting publicly" : "voting anonymously")}
				</div>
				{!mode && loginData?.getCurrentUser && (
					<div className="font- my-1.5 ml-0.5 text-[11px] leading-[15px] text-secondary opacity-100 sm:text-sm sm:leading-[20px]">
						{d(L, "coming soon")}
					</div>
				)}
				<div
					className="shadow-l mt-1.5 h-9 w-[78px] rounded-full bg-foreground bg-opacity-100 backdrop-blur-lg transition-colors sm:mt-2 sm:h-12 sm:w-[108px]"
					style={{ backgroundColor: mode ? colors["foreground"] : colors["background"] }}
				>
					<div
						id={"knob"}
						className="mt-1 ml-1 h-7 w-7 rounded-full bg-background transition sm:h-10 sm:w-10"
						style={{ backgroundColor: mode ? colors["background"] : colors["foreground"] }}
					/>
				</div>
			</div>
		</>
	)
}

export default VoteSwitch
