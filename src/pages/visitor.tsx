import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { LoginPrompt } from "../components/LoginPrompt"
import Poll from "../components/Poll"
import { EN } from "../displayTexts"
import { useGetCurrentUserQuery, useGetVisitorFeedQuery } from "../generated/graphql"
import { convertBrowserLanguage } from "../utils/convertBrowserLanguage"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClientOptions"
import LoadingScreen from "../components/LoadingScreen"

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
	const [loginPromptToggle, setLoginPromptToggle] = useState<boolean | string>(true)
	useEffect(() => {
		if (noBrowser()) return
		setFeedVariable(convertBrowserLanguage(navigator.languages))
	}, [])

	if (noBrowser() || userFetching) return <LoadingScreen />
	if (userData?.getCurrentUser && !userFetching) router.replace("/home")

	return (
		<div className="relative">
			<LoginPrompt
				message={"join/login now to vote!"}
				state={loginPromptToggle}
				toggle={setLoginPromptToggle}
			/>
			<div className="flex flex-col items-center overflow-scroll">
				<div className="flex w-[100%] flex-col items-center pb-36 pt-24">
					{feedData?.getVisitorFeed.map(
						(e) =>
							e.item && (
								<div className="w-[100%] pb-12" key={e.id}>
									<Poll
										key={e.item.id}
										poll={{ ...e.item, options: e.item.topOptions }}
										visitor={setLoginPromptToggle}
									/>
								</div>
							)
					)}
				</div>
			</div>
		</div>
	)
}

export default withUrqlClient(urqlClientOptions)(Visitor)
