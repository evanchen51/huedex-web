import React from "react"
import { Poll as PollType } from "../generated/graphql"

export const OptionsForVisitors: React.FC<{
	poll: PollType
	toggle: React.Dispatch<React.SetStateAction<boolean | string>>
}> = ({ poll, toggle }) => {
	return (
		<div className="grid grid-cols-2 pt-4 pb-8">
			{[0, 1].map((col) => (
				<div className="flex flex-col pt-2 pb-2" key={poll.id + "col" + col}>
					{poll.options
						?.sort((a, b) => b.numOfVotes - a.numOfVotes)
						.map(
							(option, i) =>
								i % 2 === col && (
									<div className="relative" key={option.id}>
										<div className="relative overflow-hidden rounded-md border-[rgba(0,0,0,0.3)] px-[3px] pb-[4px] pt-[2.5px] shadow-[inset_0px_1px_2.5px_1px_rgba(0,0,0,0.15)] duration-[200ms] ease-in-out">
											<div
												className="duration-[50ms] ease-in-out"
												onMouseEnter={(e) => {
													e.currentTarget.style.transform = "translateY(1.5px)"
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.transform = "translateY(0px)"
												}}
												onMouseDown={(e) => {
													e.currentTarget.style.transform = "translateY(4px)"
												}}
												onMouseUp={(e) => {
													e.currentTarget.style.transform = "translateY(0px)"
												}}
											>
												<div className="overflow-hidden rounded">
													<div
														className={
															"relative z-20 flex cursor-pointer flex-col bg-background py-1 font-normal text-foreground"
														}
														onClick={() => toggle(poll.id)}
													>
														<div className="px-2.5 py-1 text-sm">{option.text}</div>
														<div className="px-2.5 py-1 text-xs">
															<span>{` ${
																(option.numOfVotes / poll.numOfVotes || 0) * 100
															}%`}</span>
															<span>
																{` (${option.numOfVotes} vote${
																	option.numOfVotes === 1 ? "" : "s"
																})`}
															</span>
														</div>
														<div
															className="mx-2.5 my-1 h-3 w-[calc(100%-20px)] origin-left rounded-sm bg-secondary opacity-50 duration-[200ms] ease-in-out"
															style={{
																transform: `scaleX(${
																	option.numOfVotes / poll.numOfVotes || 0
																})`,
															}}
														/>
													</div>
												</div>
												<div className="absolute top-[-0.5px] left-[-0.5px] z-10 h-[calc(100%+4px)] w-[calc(100%+1px)] rounded-[0%_0%_2%_2%_/_0%_0%_10%_10%] rounded-t-[4px] border-[0.3px] border-secondary bg-[#E9E9E9] shadow-[inset_0px_0px_2px_1px_rgba(0,0,0,0.1)]" />
											</div>
										</div>
										<div className="pointer-events-none absolute top-[0px] left-[0px] z-30 h-[calc(100%)] w-[calc(100%)] rounded-md" />
									</div>
								)
						)}
				</div>
			))}
		</div>
	)
}
