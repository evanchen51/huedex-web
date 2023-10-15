// import isEqual from "lodash/isEqual"
import { withUrqlClient } from "next-urql"
import Image from "next/image"
import React from "react"
import { IMAGE } from "../constants"
import { Option as OptionType, Poll as PollType } from "../generated/graphql"
import { HextoHSL, colors } from "../utils/colors"
import { urqlClientOptions } from "../utils/urqlClient"
import { useImageFullViewer } from "../utils/useImageFullViewer"
import { useVoteHandler } from "../utils/useVoteHandler"
import LoadingSpinner from "./LoadingSpinner"

const Options: React.FC<{
	poll: PollType
	allOptionsToggle: boolean
	setAllOptionsToggle: React.Dispatch<React.SetStateAction<boolean>>
	displayMode?: boolean
}> = ({ poll, allOptionsToggle, setAllOptionsToggle, displayMode }) => {
	const { voteHandler, sessionState, initState } = useVoteHandler()
	const { onImageFullView } = useImageFullViewer()
	// const optionHeight = poll.options?.reduce((r:string,e) => {
	// 	if (e.text.length > 60) return ""
	// 	return ""
	// },"72px")

	return (
		<div className="flex flex-col">
			<div
				className="flex w-max cursor-default flex-row pt-5 pb-5 pl-1 pr-3"
			>
				{poll.options
					?.sort((a, b) => b.numOfVotes - a.numOfVotes)
					.reduce((r, e) => {
						const voted = initState[e.id] || false
						return !voted ? [...r, e] : [e, ...r]
					}, [] as OptionType[])
					.map((option) => {
						const voted = sessionState[poll.id]?.options[option.id]?.state === "voted"
						const numOfVotes = sessionState[poll.id]?.options[option.id]?.numOfVotes
						return (
							<div
								key={option.id}
								className="mr-2 flex h-max w-max flex-row items-center"
								// onMouseEnter={(e) => {
								// 	const { h, s, l } = HextoHSL(colors["background"])
								// 	e.currentTarget.style.backgroundColor = `hsl(${h},${s}%,${l - 1}%)`
								// }}
								// onMouseLeave={(e)=>{e.currentTarget.style.backgroundColor = colors["background"]}}
							>
								<div
									className="mr-2 flex w-[176px] flex-col rounded-b-[44px] rounded-t-[44px] border border-secondary border-opacity-[0.24] px-4 pt-5 pb-2"
									style={{
										backgroundColor: `hsl(${HextoHSL(colors["background"]).h},${
											HextoHSL(colors["background"]).s
										}%,${HextoHSL(colors["background"]).l - 1}%)`,
									}}
									onMouseEnter={(e) => {
										e.stopPropagation()
										e.currentTarget.style.borderColor = colors["foreground"] + "30"
									}}
									onMouseLeave={(e) => {
										e.stopPropagation()
										e.currentTarget.style.borderColor = colors["secondary"] + "30"
									}}
									onClick={(e) => {
										e.stopPropagation()
										e.nativeEvent.stopImmediatePropagation()
									}}
								>
									<div
										className={
											"relative z-20 flex w-full cursor-pointer flex-col rounded-full bg-background px-5 py-4 font-normal text-foreground transition"
										}
										style={{
											boxShadow: voted
												? "6px 6px 8px 2px rgb(256, 256, 256), inset -4px -4px 6px 0px rgb(256, 256, 256), 0px -6px 8px 2px rgb(216, 216, 216), inset 2px 2px 6px 0px rgb(216, 216, 216)"
												: "-6px -6px 8px 2px rgb(256, 256, 256), inset 4px 4px 6px 0px rgb(256, 256, 256), 6px 6px 8px 2px rgb(216, 216, 216), inset -2px -2px 6px 0px rgb(216, 216, 216)",
										}}
										onClick={async (e) => {
											if (displayMode) return
											e.preventDefault()
											e.stopPropagation()
											e.nativeEvent.stopImmediatePropagation()
											voteHandler(poll.id, option.id)
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.boxShadow = voted
												? "6px 6px 8px 2px rgb(256, 256, 256), inset -4px -4px 6px 0px rgb(256, 256, 256), 0px -6px 8px 2px rgb(212, 212, 212), inset 2px 2px 8px 2px rgb(212, 212, 212)"
												: "-6px -6px 8px 2px rgb(252, 252, 252), inset 4px 4px 6px 0px rgb(252, 252, 252), 6px 6px 8px 2px rgb(233, 233, 233), inset -2px -2px 6px 0px rgb(233, 233, 233)"
											e.currentTarget.style.transform = "scale(0.98)"
										}}
										onMouseDown={(e) => {
											if (displayMode) return
											e.currentTarget.style.boxShadow =
												"6px 6px 8px 2px rgb(256, 256, 256), inset -4px -4px 6px 0px rgb(256, 256, 256), 0px -6px 8px 2px rgb(200, 200, 200), inset 2px 2px 6px 0px rgb(200, 200, 200)"
											e.currentTarget.style.transform = "scale(0.96)"
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.boxShadow = voted
												? "6px 6px 8px 2px rgb(256, 256, 256), inset -4px -4px 6px 0px rgb(256, 256, 256), 0px -6px 8px 2px rgb(216, 216, 216), inset 2px 2px 6px 0px rgb(216, 216, 216)"
												: "-6px -6px 8px 2px rgb(256, 256, 256), inset 4px 4px 6px 0px rgb(256, 256, 256), 6px 6px 8px 2px rgb(216, 216, 216), inset -2px -2px 6px 0px rgb(216, 216, 216)"
											e.currentTarget.style.transform = "scale(1)"
										}}
										onMouseUp={(e) => {
											if (displayMode) return
											e.currentTarget.style.boxShadow = voted
												? "6px 6px 8px 2px rgb(256, 256, 256), inset -4px -4px 6px 0px rgb(256, 256, 256), 0px -6px 8px 2px rgb(216, 216, 216), inset 2px 2px 6px 0px rgb(216, 216, 216)"
												: "-6px -6px 8px 2px rgb(256, 256, 256), inset 4px 4px 6px 0px rgb(256, 256, 256), 6px 6px 8px 2px rgb(216, 216, 216), inset -2px -2px 6px 0px rgb(216, 216, 216)"
											e.currentTarget.style.transform = "scale(1)"
										}}
									>
										<div className="mx-2">
											<div className="mt-0 flex w-full flex-row items-center justify-between text-xs tracking-wider">
												{console.log(option.text, "numOfVotes", numOfVotes)}
												{typeof numOfVotes === "number" ? (
													<span>{`${((x: number) =>
														Number.isInteger(x) ? x.toFixed(0) : x)(
														parseFloat(
															(
																((typeof numOfVotes === "number"
																	? numOfVotes
																	: option.numOfVotes) === 0
																	? 0
																	: (typeof numOfVotes === "number"
																			? numOfVotes
																			: option.numOfVotes) /
																	  (typeof sessionState[poll.id]?.numOfVotes ===
																	  "number"
																			? sessionState[poll.id]?.numOfVotes || 0
																			: poll?.numOfVotes || 0)) * 100
															).toFixed(1)
														)
													)} %`}</span>
												) : (
													<span>{`0 %`}</span>
												)}
												<span>
													{`(${
														typeof numOfVotes === "number"
															? numOfVotes
															: option.numOfVotes
													} vote${numOfVotes && numOfVotes === 1 ? "" : "s"})`}
												</span>
											</div>
											<div
												className={
													"mb-1 mt-2 h-1 origin-left rounded-full duration-[200ms] ease-in-out"
												}
												style={{
													width: `calc(${
														((typeof numOfVotes === "number"
															? numOfVotes
															: option.numOfVotes) === 0
															? 0
															: (typeof numOfVotes === "number"
																	? numOfVotes
																	: option.numOfVotes) /
															  (typeof sessionState[poll.id]?.numOfVotes ===
															  "number"
																	? sessionState[poll.id]?.numOfVotes || 0
																	: poll?.numOfVotes || 0)) * 100
													}%)`,
													backgroundColor: voted
														? colors["foreground"]
														: colors["secondary"],
												}}
											/>
											{console.log(
												option.text,
												"meter",
												((typeof numOfVotes === "number"
													? numOfVotes
													: option.numOfVotes) === 0
													? 0
													: (typeof numOfVotes === "number"
															? numOfVotes
															: option.numOfVotes) /
													  (typeof sessionState[poll.id]?.numOfVotes === "number"
															? sessionState[poll.id]?.numOfVotes || 0
															: poll?.numOfVotes || 0)) * 100
											)}
										</div>
									</div>
									{option.mediaTypeCode &&
										option.mediaTypeCode === IMAGE &&
										option.mediaURL && (
											<div className="item-center mt-6 flex w-full justify-center">
												<div
													className="relative h-[156px] w-[156px] cursor-pointer overflow-hidden rounded-xl"
													onClick={() => {
														if (option.mediaURL) onImageFullView(option.mediaURL)
													}}
												>
													{/* <div className="relative h-52 w-52 overflow-hidden rounded-xl sm:h-[216px] sm:w-[216px]"> */}
													<Image
														src={option.mediaURL}
														alt={""}
														fill={true}
														className="object-cover	"
													/>
												</div>
											</div>
										)}
									<div
										className="mx-3.5 mt-7 mb-5 flex max-w-full cursor-text items-center justify-center text-sm text-foreground"
										style={
											{
												// height:
												// 	a.find((e) => e.mediaTypeCode && e.mediaTypeCode === IMAGE) &&
												// 	!option.mediaURL
												// 		? "156px"
												// 		: "100%",
											}
										}
									>
										{option.text}
									</div>
								</div>
								{/* {(i === a.length - 1 ||
									(poll.numOfOptions &&
										poll.options?.length &&
										poll.numOfOptions > poll.options?.length)) && (
									<div className="h-24 w-[0.5px] bg-secondary" />
									)} */}
							</div>
						)
					})}
				{poll.numOfOptions && poll.options && poll.numOfOptions > poll.options?.length && (
					<div
						className="mt-2 flex w-[168px] cursor-pointer flex-row pl-3 text-sm tracking-wider text-foreground"
						onClick={() => {
							setAllOptionsToggle(true)
							// e.currentTarget.style.visibility = "hidden"
						}}
					>
						{allOptionsToggle ? (
							<LoadingSpinner />
						) : (
							<div className="ml-1 flex flex-row pr-9">
								<div className="">
									See All ({poll.numOfOptions})
									<p className="mt-1 flex flex-row border-b-[0.5px] border-secondary pb-2.5">
										Options
										<svg
											className="ml-1.5 mt-[5px] h-3 fill-foreground"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 448 512"
										>
											<path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
										</svg>
									</p>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

// export default Options
export default withUrqlClient(urqlClientOptions, { ssr: true })(Options)
