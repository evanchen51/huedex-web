import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import { IMAGE } from "../constants"
import { d } from "../displayTexts"
import { Poll as PollType, useGetAllOptionsQuery } from "../generated/graphql"
import { HextoHSL, colors } from "../utils/colors"
import { urqlClientOptions } from "../utils/urqlClient"
import { useImageFullViewer } from "../utils/useImageFullViewer"
import { useVoteHandler } from "../utils/useVoteHandler"
import { withUrqlClientForComponent } from "../utils/withUrqlClientForComponent"
import LoadingSpinner from "./LoadingSpinner"
import Options from "./Options"
import { useGetDisplayLanguage } from "../utils/useGetDisplayLanguage"

const Poll: React.FC<{
	poll: PollType
	displayMode?: boolean
	fullViewMode?: boolean
	link?: boolean | string
}> = ({ poll, displayMode, fullViewMode, link }) => {
	const L = useGetDisplayLanguage()
	const router = useRouter()
	const { sessionState, sessionStateUpdater } = useVoteHandler()
	const { onImageFullView } = useImageFullViewer()

	const [pollHovering, setPollHovering] = useState(false)

	const [imageLoader, setImageLoader] = useState<{
		URL: string
		retried: number
		loaded: boolean
	}>({ URL: poll.mediaURL ?? "", retried: 0, loaded: false })
	const imageLoaderTimer = useRef<NodeJS.Timeout | null>(null)

	const [allOptionsToggle, setAllOptionsToggle] = useState(false)
	const [{ data: allOptionsData, fetching: allOptionsFetching }] = useGetAllOptionsQuery({
		pause: !allOptionsToggle || displayMode,
		variables: { id: poll.id },
		requestPolicy: "network-only",
	})

	useEffect(() => {
		// if (displayMode) return
		sessionStateUpdater(poll)
	}, [])

	useEffect(() => {
		if (!allOptionsToggle) return
		if (allOptionsFetching) return
		if (!allOptionsData) return
		sessionStateUpdater({ ...poll, options: allOptionsData.getSinglePoll?.options })
	}, [allOptionsToggle, allOptionsData, allOptionsFetching])

	return (
		<>
			<div
				className="pointer-events-auto relative flex flex-col rounded-[44px] border-[3px] border-white bg-background"
				style={{
					cursor: link ? "pointer" : "auto",
				}}
				onMouseEnter={(e) => {
					e.stopPropagation()
					if (!link) return
					setPollHovering(true)
					const { h, s, l } = HextoHSL(colors["background"])
					e.currentTarget.style.backgroundColor = `hsl(${h},${s}%,${l + 0.5}%)`
					// ; (e.currentTarget.querySelector(".hover-indicator") as HTMLElement).style.opacity = "1"
				}}
				onMouseLeave={(e) => {
					e.stopPropagation()
					setPollHovering(false)
					e.currentTarget.style.backgroundColor = colors["background"]
					// ;(e.currentTarget.querySelector(".hover-indicator") as HTMLElement).style.opacity = "0.5"
				}}
				onClick={() => {
					if (!link) return
					if (link === "new-tab") {
						window.open(`/poll/${poll.id}`, "_blank")
						return
					}
					router.push(`/poll/${poll.id}`)
				}}
			>
				{poll.topics && poll.topics.length > 0 ? (
					<div className="relative mt-9 flex w-full cursor-auto flex-row items-center px-[30px]">
						<div className="flex grow flex-row overflow-x-scroll pr-6">
							{poll.topics?.map((topic) => (
								<div
									key={topic.topicId}
									className="mr-2 flex h-9 flex-row items-center rounded-full bg-foreground px-4 py-1.5 text-sm text-background"
									style={{
										cursor:
											!displayMode || (router.query.id as string) !== topic.topicId
												? "pointer"
												: "auto",
									}}
									onMouseEnter={(e) => {
										if (displayMode || (router.query.id as string) === topic.topicId)
											return
										const { h, s, l } = HextoHSL(colors["foreground"])
										e.currentTarget.style.backgroundColor = `hsl(${h},${s}%,${l + 10}%)`
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.backgroundColor = colors["foreground"]
									}}
									onMouseDown={(e) => {
										if (displayMode || (router.query.id as string) === topic.topicId)
											return
										const { h, s, l } = HextoHSL(colors["foreground"])
										e.currentTarget.style.backgroundColor = `hsl(${h},${s}%,${l - 20}%)`
									}}
									onMouseUp={(e) => {
										e.currentTarget.style.backgroundColor = colors["foreground"]
									}}
									onClick={(e) => {
										e.stopPropagation()
										e.nativeEvent.stopImmediatePropagation()
									}}
								>
									{displayMode ? (
										<div className="">{topic.topicId}</div>
									) : (
										<Link
											href="/topic/[id]"
											as={`/topic/${topic.topicId.replace(" ", "-")}`}
										>
											<div className="">{topic.topicId}</div>
										</Link>
									)}
								</div>
							))}
						</div>
						{poll.featured && (
							<div
								className="flex shrink-0 cursor-auto flex-row items-center pl-1"
								style={{ boxShadow: `2px 0px 12px 24px ${colors["background"]}` }}
							>
								<div className="box-border flex h-9 flex-row items-center rounded-full border border-foreground bg-background px-4 py-1.5 text-sm text-foreground">
									{d(L, "FEATURED")}
								</div>
							</div>
						)}
					</div>
				) : (
					poll.featured && (
						<div className="relative mt-6 mb-2 flex w-full cursor-auto flex-row items-center px-[30px]">
							<div
								className="ml-auto flex shrink-0 cursor-auto flex-row items-center pl-1"
								style={{ boxShadow: `2px 0px 12px 24px ${colors["background"]}` }}
							>
								<div className="box-border flex h-9 flex-row items-center rounded-full border border-foreground bg-background px-4 py-1.5 text-sm text-foreground">
									{d(L, "FEATURED")}
								</div>
							</div>
						</div>
					)
				)}
				<div
					className="h-max w-full px-4 pb-2"
					style={{
						paddingTop:
							poll.topics && poll.topics.length === 0 && !poll.mediaURL ? "36px" : "18px",
					}}
				>
					<div
						className="relative flex h-max w-full flex-col rounded-lg px-4 py-2 duration-300"
						// style={{
						// 	border: voteState ? `1px solid ${colors["accent"]}` : "1px solid transparent",
						// }}
					>
						<div
							className="flex grow flex-col rounded-[24px] pb-6"
							// style={{
							// 	boxShadow:
							// 		"inset -4px -4px 6px 2px rgb(256, 256, 256), inset 4px 4px 6px 2px rgb(216, 216, 216)",
							// }}
						>
							{poll.mediaTypeCode &&
								poll.mediaTypeCode === IMAGE &&
								poll.mediaURL &&
								imageLoader.URL && (
									<div className="item-center mb-6 mt-6 flex w-full justify-center">
										<div
											className="relative h-[200px] w-full overflow-hidden rounded-lg sm:h-[400px] sm:w-full"
											onClick={(e) => {
												e.preventDefault()
												e.stopPropagation()
												e.nativeEvent.stopImmediatePropagation()
												if (imageLoader.URL)
													onImageFullView(imageLoader.URL || "/image-error.png")
											}}
										>
											<Image
												src={imageLoader.URL || "/image-error.png"}
												alt={""}
												fill={true}
												className="object-cover	"
												style={{
													zIndex: 1,
													opacity: imageLoader.loaded ? "1" : "0",
												}}
												onLoad={() => {
													setImageLoader((prev) => ({ ...prev, loaded: true }))
												}}
												onError={() => {
													if (imageLoader.retried >= 5) {
														setImageLoader((prev) => ({
															...prev,
															URL: "/image-error.png",
															loaded: true,
														}))
														return
													}
													if (imageLoaderTimer.current) return
													imageLoaderTimer.current = setTimeout(() => {
														setImageLoader((prev) => ({
															...prev,
															URL: poll.mediaURL + "?" + +new Date(),
															retried: imageLoader.retried + 1,
														}))
														if (imageLoaderTimer.current)
															clearTimeout(imageLoaderTimer.current)
														imageLoaderTimer.current = null
													}, 500)
												}}
												// onClick={(e) => {
												// 	e.preventDefault()
												// 	e.stopPropagation()
												// 	e.nativeEvent.stopImmediatePropagation()
												// 	setImageFullViewImage({
												// 		src: e.currentTarget.src,
												// 		width: e.currentTarget.naturalWidth,
												// 		height: e.currentTarget.naturalHeight,
												// 	})
												// 	setImageFullViewToggle(true)
												// }}
											/>
											{!imageLoader.loaded && (
												<div className="z-0 flex h-full w-full items-center justify-center">
													<LoadingSpinner />
												</div>
											)}
										</div>
									</div>
								)}

							<div
								className="h-full w-max max-w-[100%] grow cursor-text font-medium text-foreground"
								// style={{ fontSize: pollTextFontSize(poll.text) }}
								style={{
									fontSize:
										fullViewMode && poll.text && poll.text.length < 50 ? "48px" : "16px",
									marginTop:
										fullViewMode && poll.text && poll.text.length < 50 ? "36px" : "0px",
									marginBottom:
										fullViewMode && poll.text && poll.text.length < 50 ? "48px" : "0px",
								}}
								onMouseEnter={(e) => {
									e.stopPropagation()
								}}
								onClick={(e) => {
									e.stopPropagation()
								}}
							>
								{poll.text}
							</div>

							<div className="mt-4 flex flex-col justify-between text-xs text-secondary sm:flex-row">
								<div>
									<span className="tracking-wider">{d(L, "posted ")}</span>
									{poll.posterId ? (
										<span>
											<span className="tracking-wider">{d(L, "by ")}</span>
											{displayMode ? (
												<span className="text-foreground">
													{poll.poster?.displayName}
												</span>
											) : (
												<Link href="/user/[id]" as={`/user/${poll.posterId}`}>
													<span
														className="text-foreground"
														onMouseEnter={(e) => {
															e.currentTarget.style.textDecorationLine = "underline"
														}}
														onMouseLeave={(e) => {
															e.currentTarget.style.textDecorationLine = "none"
														}}
														onClick={(e) => {
															e.stopPropagation()
															e.nativeEvent.stopImmediatePropagation()
														}}
													>
														{poll.poster?.displayName}
													</span>
												</Link>
											)}
										</span>
									) : (
										<span className="tracking-wider">{d(L, "anonymously")}</span>
									)}
								</div>
								<div className="mt-0.5 tracking-wider sm:mt-0">
									{d(L, "on ")}
									{((date) =>
										`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`)(
										new Date(parseInt(poll.createdAt))
									)}
								</div>
							</div>

							{console.log(poll)}
						</div>
						<div className="hover-indicator mb-5 h-[1px] w-full bg-secondary opacity-20" />
						<div className="flex w-full flex-row justify-between">
							<div className="ml-1 text-sm tracking-wider text-secondary">
								{typeof sessionState[poll.id]?.numOfVotes === "number"
									? sessionState[poll.id]?.numOfVotes
									: poll.numOfVotes}{" "}
								{d(L, "vote")}
								{typeof sessionState[poll.id]?.numOfVotes === "number" &&
								sessionState[poll.id].numOfVotes === 1
									? ""
									: d(L, "s")}
							</div>
							<div className="mr-1 text-sm tracking-wider text-secondary">
								{poll.numOfOptions} {d(L, "options")}
							</div>
						</div>
						<div className="pointer-events-none h-max w-full shrink-0 overflow-x-scroll pt-0 pb-0 opacity-0">
							<Options
								poll={
									!allOptionsToggle || allOptionsFetching
										? poll
										: { ...poll, options: allOptionsData?.getSinglePoll?.options }
								}
								allOptionsToggle={allOptionsToggle}
								setAllOptionsToggle={setAllOptionsToggle}
							/>
						</div>
						<div
							className="absolute bottom-[8px] left-[calc(-20px-75vw)] flex h-max sm:w-[150vw] w-[200vw] shrink-0 cursor-default flex-row overflow-x-scroll pl-8 pt-0 pb-0 "
							// onMouseDown={(e) => {
							// 	e.stopPropagation()
							// 	// e.preventDefault()
							// 	// e.nativeEvent.stopImmediatePropagation()
							// }}
							// onClick={(e) => {
							// 	e.stopPropagation()
							// 	// e.preventDefault()
							// 	// e.nativeEvent.stopImmediatePropagation()
							// }}
						>
							{/* <div
							className="pointer-events-none w-[50vw] shrink-0 bg-black"
							style={{ height: "24px" }}
						/> */}
							<Options
								poll={
									!allOptionsToggle || allOptionsFetching
										? poll
										: { ...poll, options: allOptionsData?.getSinglePoll?.options }
								}
								allOptionsToggle={allOptionsToggle}
								setAllOptionsToggle={setAllOptionsToggle}
								displayMode={displayMode}
								pollHovering={pollHovering}
								link={link}
							/>
							{/* <div
							className="h-1 w-[10vw] shrink-0 bg-black sm:w-[70vw]"
							style={{ height: "24px" }}
						/> */}
						</div>
					</div>
				</div>
				{/* <div className="mt-10 h-[0.5px] w-[80%] max-w-[80vw] self-center bg-secondary" /> */}
			</div>
			{!fullViewMode && (
				<div
					className="mx-auto mt-3 mb-0 h-[24px] w-[100%] bg-background"
					style={
						{
							// backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23333' stroke-width='2' stroke-dasharray='24%2c56' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
						}
					}
				/>
			)}
		</>
	)
}

// export default Poll
export default withUrqlClientForComponent(urqlClientOptions, { ssr: true })(Poll)
