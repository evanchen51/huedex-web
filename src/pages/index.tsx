import { withUrqlClient } from "next-urql"
import React, { useEffect } from "react"
import { useGetCurrentUserQuery } from "../generated/graphql"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClient"
import Home from "./home"
import Visitor from "./visitor"

const Index: React.FC<{}> = ({}) => {
	const [{ data: userData, fetching: userFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})
	useEffect(() => {
		console.log(userData, userFetching, noBrowser())
	}, [userData, userFetching, noBrowser()])
	// if (noBrowser() || userFetching) return <LoadingScreen />
	if (userData?.getCurrentUser && !userFetching) return <Home />
	// else if (!userData?.getCurrentUser && !userFetching) return <Visitor />
	// return <LoadingScreen />
	return <Visitor />
}

export default withUrqlClient(urqlClientOptions, { ssr: true })(Index)
