// import isEqual from "lodash/isEqual"
import Image from "next/image"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import { IMAGE } from "../constants"
import { d } from "../displayTexts"
import { Option as OptionType, Poll as PollType } from "../generated/graphql"
import { colors } from "../utils/colors"
import { urqlClientOptions } from "../utils/urqlClient"
import { useGetDisplayLanguage } from "../utils/useGetDisplayLanguage"
import { useImageFullViewer } from "../utils/useImageFullViewer"
import { useVoteHandler } from "../utils/useVoteHandler"
import { withUrqlClientForComponent } from "../utils/withUrqlClientForComponent"
import LoadingSpinner from "./LoadingSpinner"

const Options: React.FC<{
	poll: PollType
	allOptionsToggle: boolean
	setAllOptionsToggle: React.Dispatch<React.SetStateAction<boolean>>
	displayMode?: boolean
	scroller?: HTMLDivElement | null
	pollHovering?: boolean
	link?: boolean | string
}> = ({ poll, allOptionsToggle, setAllOptionsToggle, displayMode, scroller, link }) => {
	const L = useGetDisplayLanguage()
	const router = useRouter()

	const { voteHandler, sessionState, initState } = useVoteHandler()
	const { onImageFullView } = useImageFullViewer()

	// const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({})
	// const [imageURLs, setImageURLs] = useState<Record<number, string>>(
	// 	poll.options ? poll.options?.reduce((r, e, i) => ({ ...r, [i]: e.mediaURL ?? "" }), {}) : {}
	// )
	const [imageLoader, setImageLoader] = useState<
		Record<string, { URL: string; retried: number; loaded: boolean }>
	>(
		poll.options
			? poll.options?.reduce(
					(r, e) => ({
						...r,
						[e.id]: { URL: e.mediaURL ?? "", retried: 0, loaded: false },
					}),
					{}
			  )
			: {}
	)
	const [startedVoting, setStartedVoting] = useState(false)
	useEffect(() => {
		setImageLoader((prev) =>
			poll.options
				? poll.options?.reduce(
						(r, e) => ({
							...r,
							[e.id]: {
								URL: e.mediaURL ?? (prev[e.id] && prev[e.id].URL ? prev[e.id].URL : ""),
								retried: prev[e.id] && prev[e.id].retried ? prev[e.id].retried : 0,
								loaded: prev[e.id] && prev[e.id].loaded ? prev[e.id].loaded : false,
							},
						}),
						{}
				  )
				: {}
		)
	}, [poll])
	const imageLoaderTimer = useRef<Record<string, NodeJS.Timeout | null>>({})

	// const optionHeight = poll.options?.reduce((r:string,e) => {
	// 	if (e.text.length > 60) return ""
	// 	return ""
	// },"72px")

	return (
		<div
			className="pointer-events-none flex flex-col"
			style={{
				cursor: link ? "pointer" : "default",
				// opacity: scroller ? "0" : "1",
				paddingRight: poll.options?.length === 2 ? "108px" : "48px",
			}}
			onClick={(e) => {
				// if (scroller) return
				e.stopPropagation()
				if (!link) return
				if (link === "new-tab") {
					window.open(`/poll/${poll.id}`, "_blank")
					return
				}
				router.push(`/poll/${poll.id}`)
			}}
		>
			<div
				className="pointer-events-auto flex w-max flex-row pt-5 pb-5 pl-1"
				// style={{ paddingRight: poll.options?.length === 2 ? "108px" : "48px" }}
			>
				{poll.options
					?.sort((a, b) => {
						return (
							(typeof a.index === "number" ? a.index : 0) -
							(typeof b.index === "number" ? b.index : 0)
						)
					})
					.sort((a, b) => {
						// const aNumOfVotes =
						// 	sessionState[poll.id]?.options[a.id]?.numOfVotes ?? a.numOfVotes
						// const bNumOfVotes =
						// 	sessionState[poll.id]?.options[b.id]?.numOfVotes ?? b.numOfVotes
						// return bNumOfVotes - aNumOfVotes
						return b.numOfVotes - a.numOfVotes
					})
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
									id={`${option.id}`}
									className="z-20 mr-2 flex w-[196px] cursor-pointer flex-col rounded-b-[44px] rounded-t-[44px] border-2 border-[rgb(252,252,252)] px-4 pt-5 pb-2 backdrop-blur-lg transition"
									style={{
										// backgroundColor: pollHovering
										// 	? `hsl(${HextoHSL(colors["background"]).h},${
										// 			HextoHSL(colors["background"]).s
										// 	  }%,${HextoHSL(colors["background"]).l - 2}%)`
										// 	: colors["background"],
										backdropFilter: scroller ? "blur(0px)" : "blur(16px)",
										borderColor: scroller ? "transparent" : "rgb(252,252,252)",
										// backgroundColor: scroller ? colors["background"] : "transparent",
										boxShadow: scroller
											? ""
											: "0px 2px 12px -4px rgb(0 0 0 / 0.1), 0px 0px 6px -4px rgb(0 0 0 / 0.1), inset 0px 0px 8px 2px rgb(250 250 250 / 0.75)",
									}}
									onMouseEnter={(e) => {
										e.stopPropagation()
										let e_1 = scroller
											? (scroller.querySelector(`#${option.id}`) as HTMLDivElement)
											: e.currentTarget
										// e.currentTarget.style.borderColor = colors["secondary"] + "60"
										e_1.style.boxShadow =
											"0px 8px 16px -8px rgb(0 0 0 / 0.1), 0px 6px 8px -6px rgb(0 0 0 / 0.1), inset 0px 0px 8px 2px rgb(250 250 250 / 0.75)"
										const button = e_1.querySelector("#vote-button") as HTMLElement
										button.style.boxShadow = voted
											? "6px 6px 8px 2px rgb(256, 256, 256), inset -4px -4px 6px 0px rgb(256, 256, 256), 0px -6px 8px 2px rgb(212, 212, 212), inset 2px 2px 8px 2px rgb(212, 212, 212)"
											: "-6px -6px 8px 2px rgb(252, 252, 252), inset 4px 4px 6px 0px rgb(252, 252, 252), 6px 6px 8px 2px rgb(233, 233, 233), inset -2px -2px 6px 0px rgb(233, 233, 233)"
										button.style.transform = "scale(0.98)"
									}}
									onMouseDown={(e) => {
										if (displayMode) return
										let e_1 = scroller
											? (scroller.querySelector(`#${option.id}`) as HTMLDivElement)
											: e.currentTarget
										e_1.style.boxShadow =
											"0px 0px 12px -6px rgb(0 0 0 / 0.1), 0px 0px 6px -6px rgb(0 0 0 / 0.1), inset 0px 0px 8px 2px rgb(250 250 250 / 0.75)"
										const button = e_1.querySelector("#vote-button") as HTMLElement
										button.style.boxShadow =
											"6px 6px 8px 2px rgb(256, 256, 256), inset -4px -4px 6px 0px rgb(256, 256, 256), 0px -6px 8px 2px rgb(200, 200, 200), inset 2px 2px 6px 0px rgb(200, 200, 200)"
										button.style.transform = "scale(0.96)"
									}}
									onMouseLeave={(e) => {
										e.stopPropagation()
										let e_1 = scroller
											? (scroller.querySelector(`#${option.id}`) as HTMLDivElement)
											: e.currentTarget
										// e.currentTarget.style.borderColor = colors["secondary"] + "80"
										e_1.style.boxShadow =
											"0px 2px 12px -4px rgb(0 0 0 / 0.1), 0px 0px 6px -4px rgb(0 0 0 / 0.1), inset 0px 0px 8px 2px rgb(250 250 250 / 0.75)"
										const button = e_1.querySelector("#vote-button") as HTMLElement
										button.style.boxShadow = voted
											? "6px 6px 8px 2px rgb(256, 256, 256), inset -4px -4px 6px 0px rgb(256, 256, 256), 0px -6px 8px 2px rgb(216, 216, 216), inset 2px 2px 6px 0px rgb(216, 216, 216)"
											: "-6px -6px 8px 2px rgb(256, 256, 256), inset 4px 4px 6px 0px rgb(256, 256, 256), 6px 6px 8px 2px rgb(216, 216, 216), inset -2px -2px 6px 0px rgb(216, 216, 216)"
										button.style.transform = "scale(1)"
									}}
									onMouseUp={(e) => {
										// if (scroller) return
										if (displayMode) return
										let e_1 = scroller
											? (scroller.querySelector(`#${option.id}`) as HTMLDivElement)
											: e.currentTarget
										e_1.style.boxShadow =
											"0px 2px 12px -4px rgb(0 0 0 / 0.1), 0px 0px 6px -4px rgb(0 0 0 / 0.1), inset 0px 0px 8px 2px rgb(250 250 250 / 0.75)"
										const button = e_1.querySelector("#vote-button") as HTMLElement
										button.style.boxShadow = voted
											? "6px 6px 8px 2px rgb(256, 256, 256), inset -4px -4px 6px 0px rgb(256, 256, 256), 0px -6px 8px 2px rgb(216, 216, 216), inset 2px 2px 6px 0px rgb(216, 216, 216)"
											: "-6px -6px 8px 2px rgb(256, 256, 256), inset 4px 4px 6px 0px rgb(256, 256, 256), 6px 6px 8px 2px rgb(216, 216, 216), inset -2px -2px 6px 0px rgb(216, 216, 216)"
										button.style.transform = "scale(1)"
									}}
									onClick={async (e) => {
										// if (scroller) return
										e.stopPropagation()
										e.nativeEvent.stopImmediatePropagation()
										// const button = e.currentTarget.querySelector(
										// 	"#vote-button"
										// ) as HTMLElement
										// button.click()
										if (displayMode) return
										e.preventDefault()
										e.stopPropagation()
										e.nativeEvent.stopImmediatePropagation()
										voteHandler(poll.id, option.id)
										if (!startedVoting) setStartedVoting(true)
									}}
								>
									<div
										id={"vote-button"}
										className={
											"relative z-20 flex w-full cursor-pointer flex-col rounded-full bg-background px-5 py-4 font-normal text-foreground transition"
										}
										style={{
											opacity: scroller ? "0" : "1",
											boxShadow: voted
												? "6px 6px 8px 2px rgb(256, 256, 256), inset -4px -4px 6px 0px rgb(256, 256, 256), 0px -6px 8px 2px rgb(216, 216, 216), inset 2px 2px 6px 0px rgb(216, 216, 216)"
												: "-6px -6px 8px 2px rgb(256, 256, 256), inset 4px 4px 6px 0px rgb(256, 256, 256), 6px 6px 8px 2px rgb(216, 216, 216), inset -2px -2px 6px 0px rgb(216, 216, 216)",
										}}
										// onClick={async (e) => {
										// 	if (scroller) return
										// 	if (displayMode) return
										// 	e.preventDefault()
										// 	e.stopPropagation()
										// 	e.nativeEvent.stopImmediatePropagation()
										// 	voteHandler(poll.id, option.id)
										// 	if (!startedVoting) setStartedVoting(true)
										// }}
										// onMouseEnter={() => {
										// if (scroller) return
										// e.currentTarget.style.boxShadow = voted
										// 	? "6px 6px 8px 2px rgb(256, 256, 256), inset -4px -4px 6px 0px rgb(256, 256, 256), 0px -6px 8px 2px rgb(212, 212, 212), inset 2px 2px 8px 2px rgb(212, 212, 212)"
										// 	: "-6px -6px 8px 2px rgb(252, 252, 252), inset 4px 4px 6px 0px rgb(252, 252, 252), 6px 6px 8px 2px rgb(233, 233, 233), inset -2px -2px 6px 0px rgb(233, 233, 233)"
										// e.currentTarget.style.transform = "scale(0.98)"
										// }}
										// onMouseDown={(e) => {
										// if (scroller) return
										// 	if (displayMode) return
										// 	e.currentTarget.style.boxShadow =
										// 		"6px 6px 8px 2px rgb(256, 256, 256), inset -4px -4px 6px 0px rgb(256, 256, 256), 0px -6px 8px 2px rgb(200, 200, 200), inset 2px 2px 6px 0px rgb(200, 200, 200)"
										// 	e.currentTarget.style.transform = "scale(0.96)"
										// }}
										// onMouseLeave={() => {
										// 	if (scroller) return
										// e.currentTarget.style.boxShadow = voted
										// 	? "6px 6px 8px 2px rgb(256, 256, 256), inset -4px -4px 6px 0px rgb(256, 256, 256), 0px -6px 8px 2px rgb(216, 216, 216), inset 2px 2px 6px 0px rgb(216, 216, 216)"
										// 	: "-6px -6px 8px 2px rgb(256, 256, 256), inset 4px 4px 6px 0px rgb(256, 256, 256), 6px 6px 8px 2px rgb(216, 216, 216), inset -2px -2px 6px 0px rgb(216, 216, 216)"
										// e.currentTarget.style.transform = "scale(1)"
										// }}
										// onMouseUp={(e) => {
										// 	if (scroller) return
										// 	if (displayMode) return
										// 	e.currentTarget.style.boxShadow = voted
										// 		? "6px 6px 8px 2px rgb(256, 256, 256), inset -4px -4px 6px 0px rgb(256, 256, 256), 0px -6px 8px 2px rgb(216, 216, 216), inset 2px 2px 6px 0px rgb(216, 216, 216)"
										// 		: "-6px -6px 8px 2px rgb(256, 256, 256), inset 4px 4px 6px 0px rgb(256, 256, 256), 6px 6px 8px 2px rgb(216, 216, 216), inset -2px -2px 6px 0px rgb(216, 216, 216)"
										// 	e.currentTarget.style.transform = "scale(1)"
										// }}
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
													} ${d(L, "vote")}${
														numOfVotes && numOfVotes === 1 ? "" : d(L, "s")
													})`}
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
										option.mediaURL &&
										imageLoader[option.id] &&
										imageLoader[option.id].URL && (
											<div className="item-center mt-6 flex w-full justify-center">
												<div
													className="relative h-[156px] w-[156px] cursor-pointer overflow-hidden rounded-lg"
													onClick={(e) => {
														// if (scroller) return
														e.stopPropagation()
														if (imageLoader[option.id].URL)
															onImageFullView(
																imageLoader[option.id].URL || "/image-error.png"
															)
													}}
													onMouseDown={(e) => {
														// if (scroller) return
														e.stopPropagation()
														// e.preventDefault()
														// e.nativeEvent.stopImmediatePropagation()
													}}
												>
													{/* <div className="relative h-52 w-52 overflow-hidden rounded-xl sm:h-[216px] sm:w-[216px]"> */}
													<Image
														src={imageLoader[option.id].URL || "/image-error.png"}
														alt={""}
														fill={true}
														className="object-cover	"
														style={{
															zIndex: 1,
															opacity: imageLoader[option.id].loaded ? "1" : "0",
														}}
														onLoad={() => {
															setImageLoader((prev) => ({
																...prev,
																[option.id]: { ...prev[option.id], loaded: true },
															}))
														}}
														onError={() => {
															if (imageLoader[option.id].retried >= 5) {
																setImageLoader((prev) => ({
																	...prev,
																	[option.id]: {
																		...prev[option.id],
																		URL: "/image-error.png",
																		loaded: true,
																	},
																}))
																return
															}
															if (imageLoaderTimer.current[option.id]) return
															imageLoaderTimer.current[option.id] = setTimeout(
																() => {
																	setImageLoader((prev) => ({
																		...prev,
																		[option.id]: {
																			...prev[option.id],
																			URL: option.mediaURL + "?" + +new Date(),
																			retried: prev[option.id].retried + 1,
																		},
																	}))
																	if (imageLoaderTimer.current[option.id])
																		clearTimeout(
																			imageLoaderTimer.current[
																				option.id
																			] as NodeJS.Timeout
																		)
																	imageLoaderTimer.current[option.id] = null
																},
																500
															)
														}}
													/>
													{!imageLoader[option.id].loaded && (
														<div className="z-0 flex h-full w-full items-center justify-center">
															<LoadingSpinner />
														</div>
													)}
												</div>
											</div>
										)}
									<div
										className="mx-3.5 mt-7 mb-5 flex w-max max-w-[90%] cursor-text items-center justify-center self-center text-sm text-foreground"
										style={{
											// height:
											// 	a.find((e) => e.mediaTypeCode && e.mediaTypeCode === IMAGE) &&
											// 	!option.mediaURL
											// 		? "156px"
											// 		: "100%",
											backgroundColor: scroller ? colors["background"] : "transparent",
										}}
										onMouseDown={(e) => {
											// if (scroller) return
											e.stopPropagation()
											// e.preventDefault()
											// e.nativeEvent.stopImmediatePropagation()
										}}
										onMouseUp={(e) => {
											// if (scroller) return
											e.stopPropagation()
											// e.preventDefault()
											// e.nativeEvent.stopImmediatePropagation()
										}}
										onClick={(e) => {
											// if (scroller) return
											e.stopPropagation()
											// e.preventDefault()
											// e.nativeEvent.stopImmediatePropagation()
										}}
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
						className="mt-0 ml-0 flex w-[168px] cursor-pointer flex-row text-sm tracking-wider text-foreground"
						onClick={(e) => {
							// if (scroller) return
							e.preventDefault()
							e.stopPropagation()
							e.nativeEvent.stopImmediatePropagation()
							setAllOptionsToggle(true)
							// e.currentTarget.style.visibility = "hidden"
						}}
					>
						{allOptionsToggle ? (
							<LoadingSpinner />
						) : (
							<div className="ml-0 flex flex-row pr-0">
								<div
									className="h-max rounded-[44px] border-2 border-white bg-transparent px-6 pt-4 pb-4 backdrop-blur-lg transition"
									style={{
										backdropFilter: scroller ? "blur(0px)" : "blur(16px)",
										// backgroundColor: scroller ? colors["background"] : "transparent",
										borderColor: scroller ? "transparent" : "rgb(252,252,252)",
										color: scroller ? "transparent" : colors["foreground"],
										boxShadow: scroller
											? ""
											: "0px 4px 12px -4px rgb(0 0 0 / 0.1), 0px 0px 6px -3px rgb(0 0 0 / 0.1), inset 0px 0px 8px 2px rgb(252 252 252 / 0.75)",
									}}
									id={poll.id + "-see-all"}
									onMouseEnter={(e) => {
										e.stopPropagation()
										let e_1 = scroller
											? (scroller.querySelector(`#${poll.id}-see-all`) as HTMLDivElement)
											: e.currentTarget
										e_1.style.boxShadow =
											"0px 4px 12px -8px rgb(0 0 0 / 0.1), 0px 0px 6px -4px rgb(0 0 0 / 0.1), inset 0px 0px 8px 2px rgb(252 252 252 / 0.75)"
									}}
									onMouseDown={(e) => {
										let e_1 = scroller
											? (scroller.querySelector(`#${poll.id}-see-all`) as HTMLDivElement)
											: e.currentTarget
										e_1.style.boxShadow =
											"0px 2px 12px -12px rgb(0 0 0 / 0.1), 0px 0px 6px -6px rgb(0 0 0 / 0.1), inset 0px 0px 8px 2px rgb(252 252 252 / 0.75)"
									}}
									onMouseLeave={(e) => {
										e.stopPropagation()
										let e_1 = scroller
											? (scroller.querySelector(`#${poll.id}-see-all`) as HTMLDivElement)
											: e.currentTarget
										e_1.style.boxShadow =
											"0px 4px 12px -4px rgb(0 0 0 / 0.1), 0px 0px 6px -3px rgb(0 0 0 / 0.1), inset 0px 0px 8px 2px rgb(252 252 252 / 0.75)"
									}}
								>
									{d(L, "See All ")}({poll.numOfOptions})
									<p className="mt-1 flex flex-row">
										{d(L, "Options")}
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
export default withUrqlClientForComponent(urqlClientOptions, { ssr: true })(Options)
