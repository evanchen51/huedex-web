import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import Header from "../../../components/Header"
import { LoginPrompt } from "../../../components/LoginPrompt"
import Poll from "../../../components/Poll"
import { Poll as PollType, useGetCurrentUserQuery, useGetSinglePollQuery } from "../../../generated/graphql"
import { urqlClientOptions } from "../../../utils/urqlClient"
import { useVoteHandler } from "../../../utils/useVoteHandler"
import { noBrowser } from "../../../utils/noBrowser"

const PollPage: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: userData, fetching: userFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})

	const [{ data: pollData, fetching: pollFetching }] = useGetSinglePollQuery({
		variables: { id: router.query.id as string },
		requestPolicy: "network-only",
	})

	const { loginPromptControl } = useVoteHandler()

	// if (noBrowser() || userFetching) return <LoadingScreen />
	if (!pollFetching && !pollData?.getSinglePoll) return <>error</>

	return (
		<div>
			<LoginPrompt message={"Login/Join to vote"} control={loginPromptControl} />
			<Header visitor={!userData?.getCurrentUser && !userFetching} />
			<div className="flex h-full max-w-full flex-col items-center overflow-x-hidden overflow-y-scroll">
				<div className="mb-36 mt-24 w-full max-w-[560px]">
					{console.log("poll:", pollData?.getSinglePoll)}
					<Poll
						poll={
							{
								...pollData?.getSinglePoll,
								options: pollData?.getSinglePoll?.topOptions,
							} as PollType
						}
						fullViewMode={true}
					/>
				</div>
			</div>
		</div>
	)
}

// export default PollPage
export default withUrqlClient(urqlClientOptions, { ssr: true })(PollPage)
