// import isEqual from "lodash/isEqual"
import React, { useEffect, useRef, useState } from "react"
import {
	Poll as PollType,
	useGetVoteHistoryQuery,
	useSendVoteReqMutation
} from "../generated/graphql"
import { styled } from "../stitches.config"
import { noBrowser } from "../utils/noBrowser"

export const Option = styled("div", {
	background: "Beige",
	variants: {
		state: {
			voted: {
				border: "1px solid black",
			},
			unvoted: {
				border: "0px",
			},
		},
	},
})

export const Options: React.FC<{ poll: PollType }> = ({ poll }) => {
	const [optionNumOfVotes, setOptionNumOfVotes] = useState<Record<string, number>>()
	const [pollNumOfVotes, setPollNumOfVotes] = useState<number>()
	const [{ data: historyData, fetching: historyFetching }] = useGetVoteHistoryQuery({
		pause: noBrowser(),
	})
	const [optionState, setOptionState] = useState<Record<string, "voted" | "unvoted">>(
		poll.options
			? poll.options.reduce((res, e) => (e ? { ...res, [e.id]: "unvoted" } : res), {})
			: {}
	)
	// const voteReq: { current: Record<string, "voted" | "unvoted"> } = useRef(
	// 	poll.options
	// 		? poll.options.reduce((res, e) => (e ? { ...res, [e.id]: "unvoted" } : res), {})
	// 		: {}
	// )
	const [, sendVoteReq] = useSendVoteReqMutation()
	const [startedVoting, setStartedVoting] = useState<boolean>(false)
	const voteDebouncer: { current: NodeJS.Timeout | null } = useRef(null)
	useEffect(() => {
		setOptionNumOfVotes(poll.options?.reduce((res, e) => ({ ...res, [e.id]: e.numOfVotes }), {}))
		setPollNumOfVotes(poll.numOfVotes)
	}, [poll.numOfVotes, poll.options])
	useEffect(() => {
		if (historyFetching) return
		if (!historyData) return
		const thisPoll = historyData.getVoteHistory.filter((e) => e.pollId === poll.id)
		if (thisPoll.length > 0 && !startedVoting)
			setOptionState((prev) => ({
				...prev,
				...thisPoll.reduce(
					(res, e) => ({
						...res,
						[e.optionId]: "voted",
					}),
					{}
				),
			}))
	}, [historyFetching, historyData, poll.id, startedVoting])
	// useEffect(() => {
	// 	if (voteDebouncer.current) return
	// 	sendVoteReq({
	// 		voteReq: {
	// 			pollId: poll.id,
	// 			numOfChoices: poll.numOfChoices,
	// 			voteState: Object.entries(voteReq.current).map(e => ({ optionId: e[0], state: e[1] }))
	// 		}
	// 	})
	// 	const prev = voteReq.current
	// 	voteDebouncer.current = setTimeout(() => {
	// 		if(!isEqual(prev, voteReq.current))sendVoteReq({
	// 			voteReq: {
	// 				pollId: poll.id,
	// 				numOfChoices: poll.numOfChoices,
	// 				voteState: Object.entries(voteReq.current).map((e) => ({
	// 					optionId: e[0],
	// 					state: e[1],
	// 				})),
	// 			},
	// 		})
	// 		voteDebouncer.current = null
	// 	}, 2000)
	// }, [...Object.keys(voteReq.current).map((e) => voteReq.current[e])])
	return (
		<>
			<>votes:{pollNumOfVotes}</>
			<>
				{poll.options?.map((option) => (
					<Option
						id={`${option.id}`}
						key={option.id}
						state={optionState && optionState[option.id] ? optionState[option.id] : "unvoted"}
						onClick={async (e) => {
							e.stopPropagation()
							if (!startedVoting) setStartedVoting(true)
							let state: Record<string, "voted" | "unvoted">
							if (
								poll.numOfChoices === 1 &&
								optionState &&
								(!optionState[option.id] || optionState[option.id] === "unvoted") &&
								Object.entries(optionState).find((e) => e[1] === "voted")
							) {
								setOptionState((prev) => {
									setOptionNumOfVotes((prev) =>
										prev
											? { ...prev, [option.id]: prev[option.id] + 1 }
											: { [option.id]: 1 }
									)
									if (!prev) return { [option.id]: "voted" }
									const voted = Object.entries(prev).find((e) => e[1] === "voted")
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
												? { ...prev, [option.id]: prev[option.id] - 1 }
												: { [option.id]: 0 }
										)
										setPollNumOfVotes((prev) => (prev ? prev - 1 : 0))
									} else {
										setOptionNumOfVotes((prev) =>
											prev
												? { ...prev, [option.id]: prev[option.id] + 1 }
												: { [option.id]: 1 }
										)
										setPollNumOfVotes((prev) => (prev ? prev + 1 : 1))
									}
									state = {
										...prev,
										[option.id]:
											prev && prev[option.id] === "voted" ? "unvoted" : "voted",
									}
									return state
								})
							}
							if (voteDebouncer.current) clearTimeout(voteDebouncer.current)
							voteDebouncer.current = setTimeout(() => {
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
							}, 1000)
						}}
					>
						{option.text}
						{/* {option.id} */}
						{pollNumOfVotes && pollNumOfVotes > 0 ? (
							optionNumOfVotes && optionNumOfVotes[option.id] ? (
								<span>{` ${(optionNumOfVotes[option.id] / pollNumOfVotes) * 100}%`}</span>
							) : (
								<span>{` 0%`}</span>
							)
						) : (
							<></>
						)}
					</Option>
				))}
			</>
		</>
	)
}
