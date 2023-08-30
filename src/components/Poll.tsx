import { withUrqlClient } from "next-urql"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { Poll as PollType } from "../generated/graphql"
import { urqlClientOptions } from "../utils/urqlClientOptions"
import Options from "./Options"
import { OptionsForVisitors } from "./OptionsForVisitors"

const Poll: React.FC<{
	poll: PollType
	visitor?: React.Dispatch<React.SetStateAction<boolean | string>>
}> = ({ poll, visitor }) => {
	const [voteState, setVoteState] = useState(false)
	const [numOfVotes, setNumOfVotes] = useState<number>(0)
	useEffect(() => {
		console.log(voteState)
	}, [voteState])
	useEffect(() => {
		setNumOfVotes(poll.numOfVotes)
	}, [poll.numOfVotes])
	return (
		<div className="flex flex-col">
			{poll.topics && poll.topics.length > 0 && (
				<div className="relative mt-6 mb-9 flex w-full flex-row items-center px-[30px]">
					<div className="flex flex-row">
						{poll.topics?.map((topic) => (
							<div
								key={topic.topicId}
								className="mr-2 rounded-xl bg-foreground px-3 py-1 text-xs text-background"
								// onMouseEnter={(e) => {
								// 	e.currentTarget.style.backgroundColor = colors["background"]
								// 	e.currentTarget.style.color = colors["foreground"]
								// }}
								// onMouseLeave={(e) => {
								// 	e.currentTarget.style.backgroundColor = colors["foreground"]
								// 	e.currentTarget.style.color = colors["background"]
								// }}
							>
								<Link
									href="/topic/[id]"
									as={`/topic/${topic.topicId.replace(" ", "%20")}`}
									// rel="noopener noreferrer"
									// target="_blank"
									// passHref
								>
									<div className="">{topic.topicId}</div>
								</Link>
							</div>
						))}
					</div>
					{/* <div
					className="translate-y-2 text-accent ml-auto font-sm"
					style={{
						opacity: voteState ? "1" : "0",
					}}
				>
					Voted
				</div> */}
				</div>
			)}
			<div className="h-max w-full px-4 py-2">
				<div
					className="relative flex h-max w-full flex-col rounded-lg border-foreground px-4 py-2 duration-300"
					// style={{
					// 	border: voteState ? `1px solid ${colors["accent"]}` : "1px solid transparent",
					// }}
				>
					<div className="flex grow flex-col px-6">
						<div
							className="text-md h-full grow font-medium text-foreground"
							// style={{ fontSize: pollTextFontSize(poll.text) }}
						>
							{poll.text}
						</div>
						<div className="mt-4 flex flex-row justify-between text-xs text-secondary">
							<div>
								<span className="tracking-wider">posted&nbsp;</span>
								{poll.posterId ? (
									<span>
										<span className="tracking-wider">by&nbsp;</span>
										<Link
											href="/user/[id]"
											as={`/user/${poll.posterId}`}
											// rel="noopener noreferrer"
											// target="_blank"
											// passHref
										>
											<span
												className="text-foreground"
												// className="px-2 ml-[-4px] py-0.5 rounded-xl"
												// onMouseEnter={(e) => {
												// 	e.currentTarget.style.backgroundColor =
												// 		colors["foreground"]
												// 	e.currentTarget.style.color = colors["background"]
												// }}
												// onMouseLeave={(e) => {
												// 	e.currentTarget.style.backgroundColor = ""
												// 	e.currentTarget.style.color = colors["secondary"]
												// }}
											>
												{poll.poster?.displayName}
											</span>
										</Link>
									</span>
								) : (
									<span className="tracking-wider">anonymously</span>
								)}
							</div>
							<div className="tracking-wider">
								on&nbsp;
								{((date) =>
									`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`)(
									new Date(parseInt(poll.createdAt))
								)}
							</div>
						</div>
					</div>
					<div className="ml-1 mt-12 text-sm tracking-wider text-secondary">
						{numOfVotes} vote{numOfVotes === 1 ? "" : "s"}
					</div>
					<div className="pointer-events-none h-max w-full shrink-0 overflow-x-scroll pt-0 pb-4 opacity-0">
						{visitor ? (
							<OptionsForVisitors poll={poll} toggle={visitor} />
						) : (
							<Options
								poll={poll}
								setParentVoteState={setVoteState}
								setParentNumOfVotes={setNumOfVotes}
							/>
						)}
					</div>
					<div className="absolute bottom-[8px] left-[calc(-16px-50vw)] flex h-max w-[150vw] shrink-0 flex-row overflow-x-scroll px-8 pt-0 pb-4">
						<div className="h-1 w-[50vw] shrink-0" />
						{visitor ? (
							<OptionsForVisitors poll={poll} toggle={visitor} />
						) : (
							<Options
								poll={poll}
								setParentVoteState={setVoteState}
								setParentNumOfVotes={setNumOfVotes}
							/>
						)}
						<div className="h-1 w-[50vw] shrink-0" />
					</div>
				</div>
			</div>
			<div className="mt-9 h-[0.5px] w-[80%] max-w-[80vw] self-center bg-secondary" />
		</div>
	)
}

export default withUrqlClient(urqlClientOptions, { ssr: true })(Poll)
