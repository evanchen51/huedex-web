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
import { useGetDisplayLanguage } from "../utils/useGetDisplayLanguage"
import { useVoteHandler } from "../utils/useVoteHandler"
import { withUrqlClientForComponent } from "../utils/withUrqlClientForComponent"

const Visitor: React.FC<{}> = ({}) => {
	const L = useGetDisplayLanguage()
	const router = useRouter()

	const { loginPromptControl } = useVoteHandler()

	const [{ data: loginData, fetching: loginFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})

	const [feedVariable, setFeedVariable] = useState([EN])
	const [{ data: feedData, fetching: feedFetching }] = useGetVisitorFeedQuery({
		variables: { languageCodes: feedVariable || [EN] },
		// pause: !feedVariable,
		// pause: noBrowser() || !feedVariable,
	})

	useEffect(() => {
		if (noBrowser()) return
		setFeedVariable(convertBrowserLanguage(navigator.languages))
	}, [noBrowser()])

	if (noBrowser() || loginFetching) return <LoadingScreen />
	if (loginData?.getCurrentUser && !loginFetching) router.replace("/home")

	return (
		<div className="relative">
			<Head>
				<title>Huedex | {d(L, "Home")}</title>
			</Head>
			<LoginPrompt control={loginPromptControl} />
			<Header home={true} visitor={true} />
			<Sidebar />
			<div className="sm:ml-[calc((100vw_-_560px)/4) flex max-w-full flex-col items-center overflow-x-hidden text-foreground sm:ml-[9.6vw]">
				<div className="mb-36 mt-[136px] w-full max-w-[560px] shrink-0 sm:mt-[108px] ">
					<div className="z-[-1] mx-6 text-[40px] font-thin uppercase leading-[46px] tracking-wider sm:mx-0 sm:text-[80px] sm:leading-[84px]">
						{d(L, "See and Share")}
						<br />
						{d(L, "Opinions & Tastes")}
					</div>
					<div
						className="mx-auto mt-16 mb-12 h-12 w-12 cursor-pointer fill-foreground sm:mt-16 sm:mb-9 sm:h-20 sm:w-20"
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
					{feedFetching && (
						<div className="ml-[240px] mt-[25vh]">
							<LoadingScreen />
						</div>
					)}
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
