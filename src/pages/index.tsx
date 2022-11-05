import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import { useGetCurrentUserQuery } from "../generated/graphql"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClientOptions"

const Index: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: userData, fetching: userFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})
	if (noBrowser() || userFetching) return <>loading</>
	if (userData?.getCurrentUser && !userFetching) router.replace("/home")
	else router.replace("/visitor")
	return <>loading</>
}

export default withUrqlClient(urqlClientOptions)(Index)
