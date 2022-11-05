import React from "react"
import { Poll as PollType } from "../generated/graphql"
import { Option } from "./Options"

export const OptionsForVisitors: React.FC<{
	poll: PollType
	toggle: React.Dispatch<React.SetStateAction<boolean | string>>
}> = ({ poll, toggle }) => {
	return (
		<>
			<>votes:{poll.numOfVotes}</>
			<>
				{poll.options?.map((option) => (
					<Option
						key={option.id}
						onClick={(e) => {
							e.stopPropagation()
							toggle(poll.id)
						}}
					>
						{option.text}
						{poll.numOfVotes > 0 && (
							<span>{` ${(option.numOfVotes / poll.numOfVotes) * 100}%`}</span>
						)}
					</Option>
				))}
			</>
		</>
	)
}
