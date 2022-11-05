import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { LoginPrompt } from "../components/LoginPrompt"
import { Poll } from "../components/Poll"
import { EN } from "../displayTexts"
import { useGetCurrentUserQuery, useGetVisitorFeedQuery } from "../generated/graphql"
import { convertBrowserLanguage } from "../utils/convertBrowserLanguage"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClientOptions"

const Visitor: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: userData, fetching: userFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})
	const [feedVariable, setFeedVariable] = useState([EN])
	const [{ data: feedData }] = useGetVisitorFeedQuery({
		variables: { languageCodes: feedVariable },
		pause: noBrowser() || !feedVariable,
	})
	const [loginPromptToggle, setLoginPromptToggle] = useState<boolean | string>(false)
	useEffect(() => {
		if (noBrowser()) return
		setFeedVariable(convertBrowserLanguage(navigator.languages))
	}, [])

	if (noBrowser() || userFetching) return <>loading</>
	if (userData?.getCurrentUser && !userFetching) router.replace("/home")

	return (
		<>
			{loginPromptToggle && (
				<LoginPrompt message={"login/join to vote"} toggle={setLoginPromptToggle} />
			)}
			visitor
			{feedData?.getVisitorFeed.map(
				(e) =>
					e.item && (
						<Poll
							key={e.item.id}
							poll={{ ...e.item, options: e.item.topOptions }}
							visitor={setLoginPromptToggle}
						/>
					)
			)}
		</>
	)
}

export default withUrqlClient(urqlClientOptions)(Visitor)
