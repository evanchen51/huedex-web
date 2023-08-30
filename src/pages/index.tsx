import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { useGetCurrentUserQuery } from "../generated/graphql"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClientOptions"
import LoadingScreen from "../components/LoadingScreen"

const Index: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: userData, fetching: userFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})
	useEffect(() => {
		console.log(userData, userFetching, noBrowser())
	}, [userData, userFetching, noBrowser()])
	if (noBrowser() || userFetching) return <LoadingScreen />
	if (userData?.getCurrentUser && !userFetching) router.replace("/home")
	else router.replace("/visitor")
	return <LoadingScreen />
}

export default withUrqlClient(urqlClientOptions)(Index)
