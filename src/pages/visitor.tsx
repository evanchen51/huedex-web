import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import Header from "../components/Header"
import LoadingScreen from "../components/LoadingScreen"
import { LoginPrompt } from "../components/LoginPrompt"
import Poll from "../components/Poll"
import { EN } from "../displayTexts"
import { useGetCurrentUserQuery, useGetVisitorFeedQuery } from "../generated/graphql"
import { convertBrowserLanguage } from "../utils/convertBrowserLanguage"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClient"
import { useVoteHandler } from "../utils/useVoteHandler"
import { withUrqlClientForComponent } from "../utils/withUrqlClientForComponent"
import Head from "next/head"

const Visitor: React.FC<{}> = ({}) => {
	const router = useRouter()

	const { loginPromptControl } = useVoteHandler()

	const [{ data: userData, fetching: userFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})

	const [feedVariable, setFeedVariable] = useState([EN])
	const [{ data: feedData }] = useGetVisitorFeedQuery({
		variables: { languageCodes: feedVariable || [EN] },
		// pause: !feedVariable,
		// pause: noBrowser() || !feedVariable,
	})

	useEffect(() => {
		if (noBrowser()) return
		setFeedVariable(convertBrowserLanguage(navigator.languages))
	}, [noBrowser()])

	if (noBrowser() || userFetching) return <LoadingScreen />
	if (userData?.getCurrentUser && !userFetching) router.replace("/home")

	return (
		<div className="relative">
			<Head>
				<title>Huedex | Home</title>
			</Head>
			<LoginPrompt message={"Login/Join to vote"} control={loginPromptControl} />
			<Header home={true} visitor={true} />
			<div className="flex max-w-full flex-col items-center overflow-x-hidden">
				<div className="mb-36 mt-16 w-full max-w-[560px]">
					{feedData?.getVisitorFeed.map(
						(e) =>
							e.item && (
								<div className="mt-12" key={e.id}>
									<Poll
										key={e.item.id}
										poll={{ ...e.item, options: e.item.topOptions }}
										link={true}
									/>
								</div>
							)
					)}
				</div>
			</div>
		</div>
	)
}

export default withUrqlClientForComponent(urqlClientOptions, { ssr: true })(Visitor)
