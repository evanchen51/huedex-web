import Head from "next/head"
import { useRouter } from "next/router"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { DisplayLanguagePrompt } from "../components/DisplayLanguagePrompt"
import Header from "../components/Header"
import LoadingScreen from "../components/LoadingScreen"
import Poll from "../components/Poll"
import Sidebar from "../components/Sidebar"
import { d } from "../displayTexts"
import { FeedItem, useGetCurrentUserQuery, useGetHomeFeedQuery } from "../generated/graphql"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClient"
import { useGetDisplayLanguage } from "../utils/useGetDisplayLanguage"
import { usePreserveScroll } from "../utils/usePreserveScroll"
import { withUrqlClientForComponent } from "../utils/withUrqlClientForComponent"

const Home: React.FC<{}> = ({}) => {
	const L = useGetDisplayLanguage()
	// const { sidebarScroller } = useSidebarScroller()
	const router = useRouter()
	const [{ data: loginData, fetching: loginFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})
	const [feed, setFeed] = useState<FeedItem[]>([])
	const [seen, setSeen] = useState<string[]>([])
	const [feedDeduper, setFeedDeduper] = useState<Record<string, boolean>>({})
	const isBack = usePreserveScroll()
	const [{ data: feedData, fetching: feedFetching }] = useGetHomeFeedQuery({
		variables: { seen },
		pause: noBrowser() || !loginData?.getCurrentUser || isBack,
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

	if (noBrowser() || loginFetching) return <LoadingScreen />
	if (!loginData?.getCurrentUser && !loginFetching) router.replace("/visitor")

	return (
		<div
		// className="relative h-screen w-screen "
		// className="h-screen overflow-y-scroll w-screen"
		// onScroll={(e) => {
		// 	sidebarScroller(e)
		// }}
		>
			<Head>
				<title>Huedex | {d(L, "Home")}</title>
			</Head>
			<DisplayLanguagePrompt
				state={displayLanguagePrompt}
				toggle={setDisplayLanguagePromptToggle}
			/>
			<Header home={true} />
			{/* <ImageFullView control={imageFullViewControl} /> */}
			<Sidebar />
			<div className="sm:ml-[calc((100vw_-_560px)/4) flex max-w-full flex-col items-center sm:ml-[9.6vw]">
				<div className="mb-36 mt-20 w-full max-w-[560px] sm:mt-24">
					{feedFetching && (
						<div className="ml-[240px] mt-[25vh]">
							<LoadingScreen />
						</div>
					)}
					{feed.map(
						(e, i, a) =>
							e.item &&
							(i !== a.length - 2 ? (
								<div className="" key={e.id}>
									{/* <Link href="/poll/[id]" as={`/poll/${e.id}`}> */}
									<Poll poll={{ ...e.item, options: e.item.topOptions }} link={true} />
									{/* </Link> */}
								</div>
							) : (
								<div className="" key={e.id} ref={loadPointRef}>
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
