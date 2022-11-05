import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import { useCreatePollCheckQuery } from "../generated/graphql"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClientOptions"

const CreatePollCheck: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: data, fetching: fetching }] = useCreatePollCheckQuery({ pause: noBrowser() })
	if (noBrowser() || fetching) return <>loading</>
	if (!data) return <>error</>
	else router.push("/create-poll")
	return <>loading</>
}

export default withUrqlClient(urqlClientOptions)(CreatePollCheck)
