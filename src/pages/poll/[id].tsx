import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import { useState } from "react"
import { LoginPrompt } from "../../components/LoginPrompt"
import { Poll } from "../../components/Poll"
import Toast from "../../components/Toast"
import {
   Poll as PollType,
   useGetCurrentUserQuery,
   useGetSinglePollQuery
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

	if (noBrowser() || userFetching) return <>loading</>
	if (!pollFetching && !pollData?.getSinglePoll) return <>error</>

	return (
		<>
			{!userData?.getCurrentUser && loginPromptToggle && (
				<LoginPrompt message={"login/join to vote"} toggle={setLoginPromptToggle} />
			)}
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
         <Toast />
		</>
	)
}

export default withUrqlClient(urqlClientOptions, { ssr: true })(PollPage)
