import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import { useState } from "react"
import Header from "../../components/Header"
import LoadingScreen from "../../components/LoadingScreen"
import { LoginPrompt } from "../../components/LoginPrompt"
import Poll from "../../components/Poll"
import {
	Poll as PollType,
	useGetCurrentUserQuery,
	useGetSinglePollQuery,
} from "../../generated/graphql"
import { noBrowser } from "../../utils/noBrowser"
import { urqlClientOptions } from "../../utils/urqlClientOptions"

const PollPage: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [loginPromptToggle, setLoginPromptToggle] = useState<boolean | string>(false)
	const [{ data: userData, fetching: userFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})
	const [{ data: pollData, fetching: pollFetching }] = useGetSinglePollQuery({
		variables: { id: router.query.id as string },
	})

	if (noBrowser() || userFetching) return <LoadingScreen />
	if (!pollFetching && !pollData?.getSinglePoll) return <>error</>

	return (
		<div>
			{!userData?.getCurrentUser && loginPromptToggle && (
				<LoginPrompt
					message={"login/join to vote"}
					state={loginPromptToggle}
					toggle={setLoginPromptToggle}
				/>
			)}
			<Header />
			<div className="flex h-full max-w-full flex-col items-center overflow-x-hidden overflow-y-scroll">
				<div className="mb-36 mt-32 w-full max-w-[640px]">
					{userData?.getCurrentUser ? (
						<Poll
							poll={
								{
									...pollData?.getSinglePoll,
									options: pollData?.getSinglePoll?.topOptions,
								} as PollType
							}
						/>
					) : (
						<Poll
							poll={
								{
									...pollData?.getSinglePoll,
									options: pollData?.getSinglePoll?.topOptions,
								} as PollType
							}
							visitor={setLoginPromptToggle}
						/>
					)}
				</div>
			</div>
		</div>
	)
}

export default withUrqlClient(urqlClientOptions, { ssr: true })(PollPage)
