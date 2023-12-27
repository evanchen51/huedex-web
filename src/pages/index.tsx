import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import LoadingScreen from "../components/LoadingScreen"
import { useGetCurrentUserQuery } from "../generated/graphql"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClient"
import Visitor from "./visitor"

const Index: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: loginData, fetching: loginFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})
	// useEffect(() => {
	// 	console.log(userData, userFetching, noBrowser())
	// }, [userData, userFetching, noBrowser()])
	return noBrowser() ? (
		<LoadingScreen />
	) : loginFetching ? (
		<LoadingScreen />
	) : loginData?.getCurrentUser ? (
		<>
			<LoadingScreen />
			{void router.replace("/home")}
		</>
	) : (
		<Visitor />
	)

	// if (userData?.getCurrentUser && !userFetching) return <Home />
	// if (!loginFetching && loginData?.getCurrentUser) router.replace("/home")

	// if (!loginFetching && !loginData?.getCurrentUser) return <Visitor />
	// return <LoadingScreen />
	// return <Visitor />
}

export default withUrqlClient(urqlClientOptions, { ssr: true })(Index)
