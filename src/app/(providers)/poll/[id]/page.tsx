import { Suspense } from "react"
import Header from "../../../../components/Header"
import LoadingScreen from "../../../../components/LoadingScreen"
import Poll from "../../../../components/Poll"
import { GetSinglePollDocument, GetSinglePollQuery } from "../../../../generated/graphql"
import { graphqlClient } from "../../../../utils/graphqlClient"

const PollPage = async ({ params }: { params: { id: string } }) => {
	const { getSinglePoll: pollData } = await graphqlClient.request<GetSinglePollQuery>(
		GetSinglePollDocument,
		{ id: params.id }
	)

	if (!pollData) return <>error</>

	return (
		<div>
			<Header />
			<Suspense fallback={<LoadingScreen />}>
				<div className="flex h-full max-w-full flex-col items-center overflow-x-hidden overflow-y-scroll">
					<div className="mb-36 mt-32 w-full max-w-[640px]">
						<Poll poll={pollData} />
					</div>
				</div>
			</Suspense>
		</div>
	)
}

export default PollPage
// export default withUrqlClient(urqlClientOptions, { ssr: true })(PollPage)
