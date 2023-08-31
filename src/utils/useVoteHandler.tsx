"use client"

import { useQuery } from "@urql/next"
import React, { ReactNode, useContext, useEffect, useState } from "react"
import { LoginPrompt } from "../components/LoginPrompt"
import { GetCurrentUserDocument, GetCurrentUserQuery, GetVoteHistoryDocument, GetVoteHistoryQuery } from "../generated/graphql"
import { noBrowser } from "./noBrowser"

const VoteContext = React.createContext<any>(null)

export const VoteContextProvider = ({ children }: { children: ReactNode }) => {
	const [{ data: historyData, fetching: historyFetching }] = useQuery<GetVoteHistoryQuery>({
		query: GetVoteHistoryDocument,
		// pause: noBrowser(),
		requestPolicy: "network-only",
	})
	const [startedVoting, setStartedVoting] = useState<boolean>(false)
	const [sessionState, setSessionState] =
		useState<Record<string, Record<string, { state: "voted" | "unvoted"; num: number }>>>()

	useEffect(() => {
		if (historyFetching) return
		if (!historyData) return
		if (!startedVoting) {
			setSessionState((prev) => ({
				...prev,
				...historyData.getVoteHistory.reduce(
					(res, e) => ({
						...res,
						[e.pollId]: { ...res[e.pollId], [e.optionId]: { state: "voted", num: 0 } },
					}),
					{} as Record<string, Record<string, { state: "voted" | "unvoted"; num: number }>>
				),
			}))
		}
	}, [historyFetching, historyData, historyData?.getVoteHistory, startedVoting, noBrowser()])

	return <VoteContext.Provider value={{}}>{children}</VoteContext.Provider>
}

export const LoginToVote:React.FC = () => {
	const [loginPromptToggle, setLoginPromptToggle] = useState<boolean | string>(false)
	const [{ data: userData }] = useQuery<GetCurrentUserQuery>({
		query: GetCurrentUserDocument,
		// pause: noBrowser(),
	})
	return (
		<>
			{!userData?.getCurrentUser && loginPromptToggle && (
				<LoginPrompt
					message={"login/join to vote"}
					state={loginPromptToggle}
					toggle={setLoginPromptToggle}
				/>
			)}
		</>
	)
}

export const useVoteHandler = () => {
	const [loginPromptToggle, setLoginPromptToggle] = useState<boolean | string>(false)
	const [{ data: userData }] = useQuery<GetCurrentUserQuery>({
		query: GetCurrentUserDocument,
		// pause: noBrowser(),
	})
	const {} = useContext(VoteContext)
	return (
		<>
			{!userData?.getCurrentUser && loginPromptToggle && (
				<LoginPrompt
					message={"login/join to vote"}
					state={loginPromptToggle}
					toggle={setLoginPromptToggle}
				/>
			)}
		</>
	)
}
