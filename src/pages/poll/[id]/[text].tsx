import { withUrqlClient } from "next-urql"
import Head from "next/head"
import { useRouter } from "next/router"
import Header from "../../../components/Header"
import { LoginPrompt } from "../../../components/LoginPrompt"
import Poll from "../../../components/Poll"
import {
	Poll as PollType,
	useGetCurrentUserQuery,
	useGetSinglePollQuery,
} from "../../../generated/graphql"
import { noBrowser } from "../../../utils/noBrowser"
import { urqlClientOptions } from "../../../utils/urqlClient"
import { useVoteHandler } from "../../../utils/useVoteHandler"

const PollPage: React.FC<{}> = ({}) => {
	// const L = useGetDisplayLanguage()
	const router = useRouter()
	const [{ data: loginData, fetching: loginFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})

	const [{ data: pollData, fetching: pollFetching }] = useGetSinglePollQuery({
		variables: { id: router.query.id as string },
		requestPolicy: "network-only",
	})

	const { loginPromptControl } = useVoteHandler()

	// if (noBrowser() || userFetching) return <LoadingScreen />
	if (!pollFetching && !pollData?.getSinglePoll)
		return <div className="mx-auto mt-[40vh]">error</div>

	return (
		<div>
			<Head>
				<title>
					Huedex | {(router.query.text as string).replace("-", " ").substring(0, 24)}
				</title>
			</Head>
			<LoginPrompt control={loginPromptControl} />
			<Header visitor={!loginData?.getCurrentUser && !loginFetching} />
			<div className="flex h-full max-w-full flex-col items-center overflow-y-scroll">
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
