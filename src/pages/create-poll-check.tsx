import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import { useCreatePollCheckQuery } from "../generated/graphql"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClient"
import LoadingScreen from "../components/LoadingScreen"

const CreatePollCheck: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: data, fetching: fetching }] = useCreatePollCheckQuery({ pause: noBrowser() })
	if (noBrowser() || fetching) return <LoadingScreen />
	if (!data) return <div className="mt-[40vh] mx-auto">error</div>
	else router.replace("/create-poll")
	return <LoadingScreen />
}

export default withUrqlClient(urqlClientOptions)(CreatePollCheck)
