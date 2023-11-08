import React, { ReactNode, useContext, useEffect, useRef, useState } from "react"
import {
	Poll,
	useGetCurrentUserQuery,
	useGetVoteHistoryQuery,
	useSendVoteReqMutation,
} from "../generated/graphql"
import { noBrowser } from "./noBrowser"

const VoteContext = React.createContext<any>(null)

type sessionOptionStateType = Record<string, { state?: "voted" | "unvoted"; numOfVotes?: number }>
type sessionStateType = Record<
	string,
	{
		numOfVotes?: number
		options: sessionOptionStateType
	}
>

export const VoteContextProvider = ({ children }: { children: ReactNode }) => {
	const [{ data: userData, fetching: userFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})
	const [{ data: historyData, fetching: historyFetching }] = useGetVoteHistoryQuery({
		pause: noBrowser() || userFetching || !userData || !userData?.getCurrentUser,
		// requestPolicy: "cache-and-network",
	})

	const [initState, setInitState] = useState<Record<string, boolean>>({})
	const [sessionState, setSessionState] = useState<sessionStateType>({})
	const [loggedIn, setLoggedIn] = useState(false)
	const [loginPromptToggle, setLoginPromptToggle] = useState<boolean | string>(false)

	useEffect(() => {
		if (noBrowser()) return
		if (userFetching) return
		if (!userData) return
		if (!userData.getCurrentUser) return
		setLoggedIn(true)
	}, [noBrowser(), userFetching, userData, userData?.getCurrentUser])

	useEffect(() => {
		if (historyFetching) return
		if (!historyData?.getVoteHistory) return
		// console.log("historyData", historyData?.getVoteHistory)
		setInitState(historyData.getVoteHistory.reduce((r, e) => ({ ...r, [e.optionId]: true }), {}))
		setSessionState((prev: sessionStateType) => ({
			...prev,
			...historyData.getVoteHistory.reduce(
				(res, e) => ({
					...res,
					[e.pollId]: prev[e.pollId]
						? {
								...prev[e.pollId],
								options: {
									...prev[e.pollId].options,
									[e.optionId]: prev[e.pollId].options[e.optionId]
										? { ...prev[e.pollId].options[e.optionId], state: "voted" }
										: { state: "voted" },
								},
						  }
						: {
								options: {
									[e.optionId]: { state: "voted" },
								},
						  },
				}),
				{}
			),
		}))
	}, [historyData, historyFetching, historyData?.getVoteHistory])

	return (
		<VoteContext.Provider
			value={{
				loggedIn,
				loginPromptControl: { state: loginPromptToggle, toggle: setLoginPromptToggle },
				initState,
				sessionState,
				setSessionState,
			}}
		>
			{children}
		</VoteContext.Provider>
	)
}

export const useVoteHandler = () => {
	const {
		loggedIn,
		loginPromptControl,
		initState,
		sessionState,
		setSessionState,
	}: {
		loggedIn: boolean
		loginPromptControl: {
			state: string | boolean
			toggle: React.Dispatch<React.SetStateAction<string | boolean>>
		}
		initState: Record<string, boolean>
		sessionState: sessionStateType
		setSessionState: React.Dispatch<React.SetStateAction<sessionStateType>>
	} = useContext(VoteContext)
	const [, sendVoteReq] = useSendVoteReqMutation()
	const voteDebouncer: { current: NodeJS.Timeout | null } = useRef(null)

	const sessionStateUpdater = (poll: Poll) =>
		setSessionState((prev) =>
			poll.options
				? {
						...prev,
						[poll.id]: {
							numOfVotes: prev[poll.id]?.numOfVotes?? poll.numOfVotes,
							options: prev[poll.id]
								? {
										...prev[poll.id].options,
										...poll.options.reduce(
											(res, e) => ({
												...res,
												[e.id]: {
													state: prev[poll.id].options[e.id]?.state || "unvoted",
													numOfVotes:
														typeof prev[poll.id].options[e.id]?.numOfVotes ===
														"number"
															? prev[poll.id].options[e.id].numOfVotes
															: e.numOfVotes,
												},
											}),
											{} as sessionOptionStateType
										),
								  }
								: poll.options.reduce(
										(res, e) => ({
											...res,
											[e.id]: {
												state: "unvoted",
												numOfVotes: e.numOfVotes,
											},
										}),
										{} as sessionOptionStateType
								  ),
						},
				  }
				: prev
		)

	const voteHandler = (pollId: string, optionId: string) => {
		if (!loggedIn) {
			loginPromptControl.toggle(pollId)
			return
		}
		let state: sessionStateType
		console.log("sessionState", sessionState)
		if (!sessionState[pollId]?.options) {
			console.log("no request sent", sessionState[pollId]?.options)
			return
		}
		const voted = Object.entries(sessionState[pollId]?.options).find(
			(e) => e[1].state && e[1].state === "voted"
		)
		if (
			// poll.numOfChoices === 1 &&
			(!sessionState[pollId].options[optionId]?.state ||
				sessionState[pollId].options[optionId].state === "unvoted") &&
			voted
		) {
			setSessionState((prev) => {
				state = {
					...prev,
					[pollId]: {
						...prev[pollId],
						options: {
							...prev[pollId].options,
							[optionId]: {
								state: "voted",
								numOfVotes:
									typeof prev[pollId].options[optionId]?.numOfVotes === "number"
										? (prev[pollId].options[optionId].numOfVotes as number) + 1
										: 1,
							},
							[voted[0]]: {
								state: "unvoted",
								numOfVotes:
									typeof prev[pollId].options[voted[0]]?.numOfVotes === "number"
										? (prev[pollId].options[voted[0]].numOfVotes as number) - 1
										: 0,
							},
						},
					},
				}
				console.log(state)
				return state
			})
		} else {
			setSessionState((prev) => {
				state = {
					...prev,
					[pollId]: {
						numOfVotes:
							prev[pollId].options[optionId]?.state &&
							prev[pollId].options[optionId].state === "voted"
								? typeof prev[pollId].numOfVotes === "number"
									? (prev[pollId].numOfVotes as number) - 1
									: 0
								: typeof prev[pollId].numOfVotes === "number"
								? (prev[pollId].numOfVotes as number) + 1
								: 1,
						options: {
							...prev[pollId].options,
							[optionId]: {
								state:
									prev[pollId].options[optionId]?.state &&
									prev[pollId].options[optionId].state === "voted"
										? "unvoted"
										: "voted",
								numOfVotes:
									prev[pollId].options[optionId]?.state &&
									prev[pollId].options[optionId].state === "voted"
										? typeof prev[pollId].options[optionId]?.numOfVotes === "number"
											? (prev[pollId].options[optionId].numOfVotes as number) - 1
											: 0
										: typeof prev[pollId].options[optionId]?.numOfVotes === "number"
										? (prev[pollId].options[optionId].numOfVotes as number) + 1
										: 1,
							},
						},
					},
				}
				return state
			})
		}
		if (voteDebouncer.current) clearTimeout(voteDebouncer.current)
		const req = (state: sessionStateType) => {
			sendVoteReq({
				voteReq: {
					pollId: pollId,
					numOfChoices: 1,
					// numOfChoices: poll.numOfChoices,
					voteState: Object.entries(state[pollId].options).map((e) => ({
						optionId: e[0],
						state: e[1].state || sessionState[pollId].options[optionId].state || "unvoted",
					})),
				},
			})
			voteDebouncer.current = null
		}
		const dispatch = () => {
			if (voteDebouncer.current) req(state)
		}
		voteDebouncer.current = setTimeout(() => {
			req(state)
			window.removeEventListener("beforeunload", dispatch)
		}, 800)
		window.addEventListener("beforeunload", dispatch)
	}

	return {
		voteHandler,
		sessionState,
		sessionStateUpdater,
		loginPromptControl,
		initState,
	}
}
