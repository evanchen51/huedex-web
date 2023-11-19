import Head from "next/head"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import Header from "../components/Header"
import LoadingScreen from "../components/LoadingScreen"
import { LoginPrompt } from "../components/LoginPrompt"
import Poll from "../components/Poll"
import Sidebar from "../components/Sidebar"
import { EN, d } from "../displayTexts"
import { useGetCurrentUserQuery, useGetVisitorFeedQuery } from "../generated/graphql"
import { convertBrowserLanguage } from "../utils/convertBrowserLanguage"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClient"
import { useVoteHandler } from "../utils/useVoteHandler"
import { withUrqlClientForComponent } from "../utils/withUrqlClientForComponent"
import { useGetDisplayLanguage } from "../utils/useGetDisplayLanguage"

const Visitor: React.FC<{}> = ({}) => {
	const L = useGetDisplayLanguage()
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
				<title>Huedex | {d(L, "Home")}</title>
			</Head>
			<LoginPrompt message={d(L, "Login/Join with Google")} control={loginPromptControl} />
			<Header home={true} visitor={true} />
			<Sidebar />
			<div className="flex max-w-full flex-col items-center overflow-x-hidden">
				<div className="mb-36 mt-16 w-full max-w-[560px] shrink-0">
					<div className="mx-6 mt-6 text-[64px] font-thin sm:mx-0 sm:text-[80px]">
						{d(L, "See and Share Opinions & Tastes")}
					</div>
					<div
						className="mx-auto mt-12 h-24 w-24 cursor-pointer fill-foreground"
						onClick={(e) => {
							e.currentTarget.scrollIntoView({
								behavior: "smooth",
								block: "start",
								inline: "center",
							})
						}}
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 12 25 12">
							<path d="m18.294 16.793-5.293 5.293V1h-1v21.086l-5.295-5.294-.707.707L12.501 24l6.5-6.5-.707-.707z" />
						</svg>
					</div>
					{feedData?.getVisitorFeed.map(
						(e) =>
							e.item && (
								<div className="" key={e.id}>
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
