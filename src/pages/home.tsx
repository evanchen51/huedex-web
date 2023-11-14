import { useRouter } from "next/router"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { DisplayLanguagePrompt } from "../components/DisplayLanguagePrompt"
import Header from "../components/Header"
import LoadingScreen from "../components/LoadingScreen"
import Poll from "../components/Poll"
import { FeedItem, useGetCurrentUserQuery, useGetHomeFeedQuery } from "../generated/graphql"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClient"
import { useGetDisplayLanguage } from "../utils/useGetDisplayLanguage"
import { usePreserveScroll } from "../utils/usePreserveScroll"
import { withUrqlClientForComponent } from "../utils/withUrqlClientForComponent"
import Head from "next/head"

const Home: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: userData, fetching: userFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})
	const [feed, setFeed] = useState<FeedItem[]>([])
	const [seen, setSeen] = useState<string[]>([])
	const [feedDeduper, setFeedDeduper] = useState<Record<string, boolean>>({})
	const isBack = usePreserveScroll()
	const [{ data: feedData, fetching: feedFetching }] = useGetHomeFeedQuery({
		variables: { seen },
		pause: noBrowser() || !userData?.getCurrentUser || isBack,
		requestPolicy: "network-only",
	})

	// const { imageFullViewControl } = useImageFullViewer()

	const [displayLanguagePrompt, setDisplayLanguagePromptToggle] = useState<boolean | string>(false)
	useGetDisplayLanguage(setDisplayLanguagePromptToggle)

	useEffect(() => {
		if (!feedData || feedData?.getHomeFeed.length === 0) return
		setFeed((prev) => [
			...prev,
			...feedData.getHomeFeed.filter((e) =>
				feedDeduper[e.id]
					? false
					: (setFeedDeduper((prev) => ({ ...prev, [e.id]: true })), true)
			),
		])
	}, [feedFetching, feedData, feedData?.getHomeFeed])

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
			<Head>
				<title>Huedex | Home</title>
			</Head>
			<DisplayLanguagePrompt
				state={displayLanguagePrompt}
				toggle={setDisplayLanguagePromptToggle}
			/>
			<Header home={true} />
			{/* <ImageFullView control={imageFullViewControl} /> */}
			<div className="flex max-w-full flex-col items-center overflow-x-hidden">
				<div className="mb-36 mt-16 w-full max-w-[560px]">
					{feed.map(
						(e, i, a) =>
							e.item &&
							(i !== a.length - 2 ? (
								<div className="mt-12" key={e.id}>
									{/* <Link href="/poll/[id]" as={`/poll/${e.id}`}> */}
									<Poll poll={{ ...e.item, options: e.item.topOptions }} link={true} />
									{/* </Link> */}
								</div>
							) : (
								<div className="mt-12" key={e.id} ref={loadPointRef}>
									<Poll poll={{ ...e.item, options: e.item.topOptions }} link={true} />
								</div>
							))
					)}
				</div>
			</div>
		</div>
	)
}

export default withUrqlClientForComponent(urqlClientOptions)(Home)
