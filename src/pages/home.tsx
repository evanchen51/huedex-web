import { withUrqlClient } from "next-urql"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { DisplayLanguagePrompt } from "../components/DisplayLanguagePrompt"
import LoadingScreen from "../components/LoadingScreen"
import Poll from "../components/Poll"
import { FeedItem, useGetCurrentUserQuery, useGetHomeFeedQuery } from "../generated/graphql"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClientOptions"
import { useGetDisplayLanguage } from "../utils/useGetDisplayLanguage"
import { usePreserveScroll } from "../utils/usePreserveScroll"
import Header from "../components/Header"

const Home: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: userData, fetching: userFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})
	const [feed, setFeed] = useState<FeedItem[]>([])
	const [seen, setSeen] = useState<string[]>([])
	const isBack = usePreserveScroll()
	const [{ data: feedData, fetching: feedFetching }] = useGetHomeFeedQuery({
		variables: { seen },
		pause: noBrowser() || !userData?.getCurrentUser || isBack,
		requestPolicy: "network-only",
	})

	const LANGUAGE = useGetDisplayLanguage()
	const [displayLanguagePrompt, setDisplayLanguagePromptToggle] = useState<boolean | string>(false)
	useEffect(() => {
		if (!LANGUAGE || LANGUAGE === "un") setDisplayLanguagePromptToggle(true)
		// console.log(LANGUAGE)
	}, [LANGUAGE])

	useEffect(() => {
		if (!feedData || feedData?.getHomeFeed.length === 0) return
		setFeed((prev) => [...prev, ...feedData.getHomeFeed])
	}, [feedData, feedData?.getHomeFeed])
	const loadObserver = useRef<IntersectionObserver>()
	const loadPointRef = useCallback(
		(node) => {
			if (feedFetching) return
			if (feedData?.getHomeFeed.length === 0) return
			if (loadObserver.current) loadObserver.current.disconnect()
			loadObserver.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					setSeen(feed.map((e) => e.id))
				}
			})
			if (node) loadObserver.current.observe(node)
		},
		[feed, feedData?.getHomeFeed.length, feedFetching]
	)

	if (noBrowser() || userFetching) return <LoadingScreen />
	if (!userData?.getCurrentUser && !userFetching) router.replace("/visitor")

	return (
		<div>
			<DisplayLanguagePrompt
				state={displayLanguagePrompt}
				toggle={setDisplayLanguagePromptToggle}
			/>
			<Header page={"Home"}/>
			<div className="flex max-w-full flex-col items-center overflow-x-hidden">
				<div className="mb-36 mt-12 w-full max-w-[640px]">
					{feed.map(
						(e, i, a) =>
							e.item &&
							(i !== a.length - 3 ? (
								<div className="mt-16" key={e.id}>
									<Link
										href="/poll/[id]"
										as={`/poll/${e.id}`}
										// rel="noopener noreferrer"
										// target="_blank"
										// passHref
									>
										<Poll poll={{ ...e.item, options: e.item.topOptions }} />
									</Link>
								</div>
							) : (
								<div className="mt-16" key={e.id} ref={loadPointRef}>
									<Link
										href="/poll/[id]"
										as={`/poll/${e.id}`}
										// rel="noopener noreferrer"
										// target="_blank"
										// passHref
									>
										<Poll poll={{ ...e.item, options: e.item.topOptions }} />
									</Link>
								</div>
							))
					)}
				</div>
			</div>
		</div>
	)
}

export default withUrqlClient(urqlClientOptions)(Home)
