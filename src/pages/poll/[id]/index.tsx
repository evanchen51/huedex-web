import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import LoadingScreen from "../../../components/LoadingScreen"
import { useGetSinglePollQuery } from "../../../generated/graphql"
import { noBrowser } from "../../../utils/noBrowser"
import { urqlClientOptions } from "../../../utils/urqlClient"

const PollPage: React.FC<{}> = ({}) => {
	const router = useRouter()

	const [{ data: pollData, fetching: pollFetching }] = useGetSinglePollQuery({
		variables: { id: router.query.id as string },
		// requestPolicy: "network-only",
	})

	if (!noBrowser() && pollData?.getSinglePoll)
		router.replace(`/poll/${router.query.id}/${pollData.getSinglePoll.text.replace(" ", "-")}`)
	if (!pollFetching && !pollData?.getSinglePoll) return <>error</>

	return <LoadingScreen />
}

// export default PollPage
export default withUrqlClient(urqlClientOptions, { ssr: true })(PollPage)
