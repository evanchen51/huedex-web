import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import { useGetCurrentUserQuery } from "../generated/graphql"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClient"
import Visitor from "./visitor"
import LoadingScreen from "../components/LoadingScreen"

const Index: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: loginData, fetching: loginFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})
	// useEffect(() => {
	// 	console.log(userData, userFetching, noBrowser())
	// }, [userData, userFetching, noBrowser()])
	if (noBrowser() || loginFetching) return <LoadingScreen />

	// if (userData?.getCurrentUser && !userFetching) return <Home />
	if (!loginFetching && loginData?.getCurrentUser) router.replace("/home")
	
	// else if (!userData?.getCurrentUser && !userFetching) return <Visitor />
	// return <LoadingScreen />
	return <Visitor />
}

export default withUrqlClient(urqlClientOptions, { ssr: true })(Index)
