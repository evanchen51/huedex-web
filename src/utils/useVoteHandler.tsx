import React, { ReactNode, useContext, useState } from "react"

const VoteContext = React.createContext<any>(null)

export const VoteContextProvider = ({ children }: { children: ReactNode }) => {
	const [vote, setVote] = useState("1")
	return <VoteContext.Provider value={{ vote, update: setVote }}>{children}</VoteContext.Provider>
}

export const useVoteHandler = () => {
	const { vote, update } = useContext(VoteContext)
	return { vote, update }
}
