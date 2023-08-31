"use client"

import { useQuery } from "@urql/next"
import React from "react"
import LoadingScreen from "../../components/LoadingScreen"
import { GetCurrentUserDocument, GetCurrentUserQuery } from "../../generated/graphql"
import Home from "./home/page"
import Visitor from "./visitor/page"

const Index: React.FC<{}> = ({}) => {
	const [{ data: userData, fetching: userFetching }] = useQuery<GetCurrentUserQuery>({
		query: GetCurrentUserDocument,
	})
	if (userData?.getCurrentUser && !userFetching) return <Home />
	else if (!userData?.getCurrentUser && !userFetching) return <Visitor />
	return <LoadingScreen />
}

export default Index
// export default withUrqlClient(urqlClientOptions)(Index)
