import Link from "next/link"
import React from "react"
import { Poll as PollType } from "../generated/graphql"
import { styled } from "../stitches.config"
import { Options } from "./Options"
import { OptionsForVisitors } from "./OptionsForVisitors"

export const PollContainer = styled("div", {
	background: "AliceBlue",
})

export const Poll: React.FC<{
	poll: PollType
	visitor?: React.Dispatch<React.SetStateAction<boolean | string>>
}> = ({ poll, visitor }) => {
	return (
		<PollContainer>
			<>
				by
				{poll.posterId ? (
					<>
						<Link href="/account/[id]" as={`/account/${poll.posterId}`} passHref>
							<b>{poll.poster?.displayName}</b>
						</Link>
					</>
				) : (
					<>&lt;anonymous&gt;</>
				)}
				on {poll.createdAt}
			</>
			<>{poll.text}</>
			<>choices:{poll.numOfChoices}</>
			<>
				{visitor ? (
					<OptionsForVisitors poll={poll} toggle={visitor} />
				) : (
					<Options poll={poll} />
				)}
			</>
			<>
				topics:
				{poll.topics?.map((topic) => (
					<div key={topic.topicId}>
						<Link href="/topic/[id]" as={`/topic/${topic.topicId}`} passHref>
							<b>{topic.topic?.name}</b>
						</Link>
					</div>
				))}
			</>
		</PollContainer>
	)
}
