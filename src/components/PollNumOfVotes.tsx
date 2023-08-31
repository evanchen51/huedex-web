"use client"

import React from "react"
import { Poll as PollType } from "../generated/graphql"

const PollNumOfVotes: React.FC<{ poll: PollType }> = ({ poll }) => {
	return (
		<div className="ml-1 mt-12 text-sm tracking-wider text-secondary">
			{poll.numOfVotes} vote{poll.numOfVotes === 1 ? "" : "s"}
		</div>
	)
}

export default PollNumOfVotes
