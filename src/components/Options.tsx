// import isEqual from "lodash/isEqual"
import { withUrqlClient } from "next-urql"
import React, { useEffect, useRef, useState } from "react"
import {
	Poll as PollType,
	useGetAllOptionsQuery,
	useGetVoteHistoryQuery,
	useSendVoteReqMutation,
} from "../generated/graphql"
import { colors } from "../utils/colors"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClientOptions"
import LoadingSpinner from "./LoadingSpinner"
import { useVoteHandler } from "../utils/useVoteHandler"

const Options: React.FC<{
	poll: PollType
	setParentVoteState: React.Dispatch<React.SetStateAction<boolean>>
	setParentNumOfVotes: React.Dispatch<React.SetStateAction<number>>
}> = ({ poll: pollInit, setParentVoteState, setParentNumOfVotes }) => {
	// const router = useRouter()
	// const [path, setPath] = useState(router.asPath)
	const vote = useVoteHandler()
	console.log(vote)
	const [poll, setPoll] = useState(pollInit)
	const [optionNumOfVotes, setOptionNumOfVotes] = useState<Record<string, number>>()
	const [pollNumOfVotes, setPollNumOfVotes] = useState<number>()
	const [{ data: historyData, fetching: historyFetching }] = useGetVoteHistoryQuery({
		pause: noBrowser(),
		requestPolicy: "network-only",
	})
	const [optionState, setOptionState] = useState<Record<string, "voted" | "unvoted">>(
		poll.options
			? poll.options.reduce((res, e) => (e ? { ...res, [e.id]: "unvoted" } : res), {})
			: {}
	)
	const [allOptionsToggle, setAllOptionsToggle] = useState(false)
	const [{ data: allOptions, fetching: allOptionsFetching }] = useGetAllOptionsQuery({
		pause: !allOptionsToggle,
		variables: { id: poll.id },
	})
	const [, sendVoteReq] = useSendVoteReqMutation()
	const [startedVoting, setStartedVoting] = useState<boolean>(false)
	const voteDebouncer: { current: NodeJS.Timeout | null } = useRef(null)
	// useEffect(() => {
	// 	setPath(router.asPath)
	// }, [router, noBrowser()])
	useEffect(() => {
		setPoll(pollInit)
	}, [pollInit, noBrowser()])
	useEffect(() => {
		setOptionNumOfVotes(poll.options?.reduce((res, e) => ({ ...res, [e.id]: e.numOfVotes }), {}))
		setPollNumOfVotes(poll.numOfVotes)
		setParentNumOfVotes(poll.numOfVotes)
	}, [poll.numOfVotes, poll.options])
	useEffect(() => {
		// console.log([historyFetching, historyData, poll.id, startedVoting, path])
		if (historyFetching) return
		if (!historyData || !poll || !poll.options) return
		const thisPoll = historyData.getVoteHistory.filter((e) => e.pollId === poll.id)
		if (!startedVoting) {
			setParentVoteState(true)
			setOptionState(() => ({
				...poll?.options?.reduce((res, e) => (e ? { ...res, [e.id]: "unvoted" } : res), {}),
				...thisPoll.reduce(
					(res, e) => ({
						...res,
						[e.optionId]: "voted",
					}),
					{}
				),
			}))
		}
	}, [
		historyFetching,
		historyData,
		historyData?.getVoteHistory,
		poll.id,
		startedVoting,
		// path,
		noBrowser(),
	])
	useEffect(() => {
		if (!allOptionsToggle || allOptionsFetching || !allOptions) return
		setPoll((prev) => ({ ...prev, options: allOptions.getSinglePoll?.options }))
		console.log(allOptions)
	}, [allOptionsToggle, allOptions, allOptionsFetching])
	return (
		<div className="flex flex-col">
			<div
				className="flex w-max cursor-default flex-row bg-background pt-5 pb-5 pr-8"
				onClick={(e) => {
					e.preventDefault()
					e.stopPropagation()
					e.nativeEvent.stopImmediatePropagation()
				}}
			>
				{/* {[0, 1].map((col) => (
				<div className="flex flex-col px-0 pt-0 pb-0" key={poll.id + "col" + col}> */}
				{poll.options
					?.sort((a, b) => b.numOfVotes - a.numOfVotes)
					.map((option, i, a) => (
						// i % 2 === col &&
						<div
							key={option.id}
							className="mr-5 h-max w-52 border-r border-[#EEEEEE] pr-5"
							style={{
								borderRightWidth:
									i === a.length - 1 &&
									poll.numOfOptions &&
									poll.options?.length &&
									poll.numOfOptions <= poll.options?.length
										? "0px"
										: "1px",
							}}
						>
							<div className="mx-2.5 text-sm text-foreground">{option.text}</div>
							<div className="relative mt-5">
								<div
									className="relative overflow-hidden rounded-md border-[rgba(0,0,0,0.3)] px-[3px] pb-[3.5px] pt-[2.5px] duration-[200ms] ease-in-out"
									style={{
										backgroundColor:
											optionState?.[option.id] === "voted" ? colors["accent"] : "",
										boxShadow:
											optionState?.[option.id] === "voted"
												? `0px 0px 8px ${colors["accent"]}80, 0px 0px 3px 1px ${colors["accent"]}B0`
												: "inset 0px 1px 2.5px 1px rgba(0,0,0,0.15)",
										// borderWidth:
										// 	optionState?.[option.id] === "voted" ? "" : "0.5px",
									}}
								>
									<div
										className="duration-[50ms] ease-in-out"
										style={{
											transform:
												optionState?.[option.id] === "voted"
													? "translateY(1px)"
													: "translateY(0px)",
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.transform =
												optionState?.[option.id] === "voted"
													? "translateY(2px)"
													: "translateY(1px)"
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.transform =
												optionState?.[option.id] === "voted"
													? "translateY(1px)"
													: "translateY(0px)"
										}}
										onMouseDown={(e) => {
											e.currentTarget.style.transform = "translateY(4px)"
										}}
										onMouseUp={(e) => {
											e.currentTarget.style.transform =
												optionState?.[option.id] === "voted"
													? "translateY(0px)"
													: "translateY(1px)"
											setParentVoteState(
												optionState?.[option.id] === "voted" ? false : true
											)
										}}
									>
										<div className="overflow-hidden rounded">
											<div
												className={
													"relative z-20 flex cursor-pointer flex-col bg-background py-1 font-normal text-foreground"
												}
												onClick={async (e) => {
													e.preventDefault()
													e.stopPropagation()
													e.nativeEvent.stopImmediatePropagation()
													if (!startedVoting) setStartedVoting(true)
													let state: Record<string, "voted" | "unvoted">
													if (
														poll.numOfChoices === 1 &&
														optionState &&
														(!optionState[option.id] ||
															optionState[option.id] === "unvoted") &&
														Object.entries(optionState).find((e) => e[1] === "voted")
													) {
														setOptionState((prev) => {
															setOptionNumOfVotes((prev) =>
																prev
																	? {
																			...prev,
																			[option.id]: prev[option.id] + 1,
																	  }
																	: { [option.id]: 1 }
															)
															if (!prev) return { [option.id]: "voted" }
															const voted = Object.entries(prev).find(
																(e) => e[1] === "voted"
															)
															if (!voted) return { [option.id]: "voted" }
															setOptionNumOfVotes((prev) => ({
																...prev,
																[voted[0]]: prev![voted[0]] - 1,
															}))
															state = {
																...prev,
																[option.id]: "voted",
																[voted[0]]: "unvoted",
															}
															return state
														})
													} else {
														setOptionState((prev) => {
															if (prev && prev[option.id] === "voted") {
																setOptionNumOfVotes((prev) =>
																	prev
																		? {
																				...prev,
																				[option.id]: prev[option.id] - 1,
																		  }
																		: { [option.id]: 0 }
																)
																setPollNumOfVotes((prev) => (prev ? prev - 1 : 0))
																setParentNumOfVotes((prev) => (prev ? prev - 1 : 0))
															} else {
																setOptionNumOfVotes((prev) =>
																	prev
																		? {
																				...prev,
																				[option.id]: prev[option.id] + 1,
																		  }
																		: { [option.id]: 1 }
																)
																setPollNumOfVotes((prev) => (prev ? prev + 1 : 1))
																setParentNumOfVotes((prev) => (prev ? prev + 1 : 1))
															}
															state = {
																...prev,
																[option.id]:
																	prev && prev[option.id] === "voted"
																		? "unvoted"
																		: "voted",
															}
															return state
														})
													}
													if (voteDebouncer.current)
														clearTimeout(voteDebouncer.current)
													const req = (state: Record<string, "voted" | "unvoted">) => {
														sendVoteReq({
															voteReq: {
																pollId: poll.id,
																numOfChoices: poll.numOfChoices,
																voteState: Object.entries(state).map((e) => ({
																	optionId: e[0],
																	state: e[1],
																})),
															},
														})
														voteDebouncer.current = null
													}
													const unloadReq = () => {
														if (voteDebouncer.current) req(state)
													}
													voteDebouncer.current = setTimeout(() => {
														req(state)
														window.removeEventListener("beforeunload", unloadReq)
													}, 1000)
													window.addEventListener("beforeunload", unloadReq)
												}}
											>
												<div className="mx-2.5 mt-0.5 flex flex-row items-center justify-between text-xs tracking-wider">
													{optionNumOfVotes && optionNumOfVotes[option.id] ? (
														<span>{`${((x: number) =>
															Number.isInteger(x) ? x.toFixed(0) : x)(
															parseFloat(
																(
																	(optionNumOfVotes[option.id] /
																		(pollNumOfVotes || 0)) *
																	100
																).toFixed(1)
															)
														)} %`}</span>
													) : (
														<span>{`0 %`}</span>
													)}
													<span>
														{`(${
															optionNumOfVotes && optionNumOfVotes[option.id]
														} vote${
															optionNumOfVotes && optionNumOfVotes[option.id] === 1
																? ""
																: "s"
														})`}
													</span>
												</div>
												<div
													className={
														"mx-2.5 mb-1 mt-1.5 h-1 w-[calc(100%-20px)] origin-left rounded-sm duration-[200ms] ease-in-out"
													}
													style={{
														transform: `scaleX(${
															optionNumOfVotes && optionNumOfVotes[option.id]
																? optionNumOfVotes[option.id] /
																  (pollNumOfVotes || 0)
																: 0
														})`,
														backgroundColor:
															optionState?.[option.id] === "voted"
																? colors["accent"]
																: colors["secondary"],
													}}
												/>
											</div>
										</div>
										<div
											className={
												"absolute top-[-0.5px] left-[-0.5px] z-10 h-[calc(100%+4px)] w-[calc(100%+1px)] rounded-[0%_0%_2%_2%_/_0%_0%_10%_10%] rounded-t-[4px] border-[0.3px] bg-[#E9E9E9]"
											}
											style={{
												boxShadow:
													optionState?.[option.id] === "voted"
														? "inset 0px 0px 3px 2px rgba(180,30,80,1)"
														: "inset 0px 0px 2px 1px rgba(0,0,0,0.1)",
												borderColor:
													optionState?.[option.id] === "voted"
														? "rgba(200,40,80,1)"
														: colors["secondary"],
											}}
										/>
									</div>
								</div>
								<div
									className="pointer-events-none absolute top-[0px] left-[0px] z-30 h-[calc(100%)] w-[calc(100%)] rounded-md"
									style={{
										boxShadow:
											optionState?.[option.id] === "voted"
												? `inset 0px 2px 10px 1px ${colors["accent"]}80`
												: "",
									}}
								/>
							</div>
						</div>
					))}
				{/* </div>
			))} */}
				{poll.numOfOptions &&
					poll.options?.length &&
					poll.numOfOptions > poll.options?.length && (
						<div
							className="flex cursor-pointer flex-row items-center self-center text-xs tracking-wider text-secondary"
							onClick={() => {
								setAllOptionsToggle(true)
								// e.currentTarget.style.visibility = "hidden"
							}}
						>
							{allOptionsToggle ? (
								<LoadingSpinner />
							) : (
								<div className="flex flex-row items-center">
									<div>
										See All<p>Options</p>
									</div>
									<svg
										className="ml-2 h-4 fill-secondary"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 448 512"
									>
										<path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
									</svg>
								</div>
							)}
						</div>
					)}
			</div>
		</div>
	)
}

export default withUrqlClient(urqlClientOptions, { ssr: true })(Options)
