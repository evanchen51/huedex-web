"use client"

import { useQuery } from "@urql/next"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { DisplayLanguagePrompt } from "../../../components/DisplayLanguagePrompt"
import Header from "../../../components/Header"
import LoadingScreen from "../../../components/LoadingScreen"
import Poll from "../../../components/Poll"
import {
	FeedItem,
	GetCurrentUserDocument,
	GetCurrentUserQuery,
	GetHomeFeedDocument,
	GetHomeFeedQuery,
} from "../../../generated/graphql"
import { noBrowser } from "../../../utils/noBrowser"
import { useGetDisplayLanguage } from "../../../utils/useGetDisplayLanguage"

const Home: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: userData, fetching: userFetching }] = useQuery<GetCurrentUserQuery>({
		query: GetCurrentUserDocument,
	})
	const [feed, setFeed] = useState<FeedItem[]>([])
	const [seen, setSeen] = useState<string[]>([])
	const [{ data: feedData, fetching: feedFetching }] = useQuery<GetHomeFeedQuery>({
		query: GetHomeFeedDocument,
		variables: { seen },
		pause: !userData?.getCurrentUser,
	})

	const LANGUAGE = useGetDisplayLanguage()
	const [displayLanguagePrompt, setDisplayLanguagePromptToggle] = useState<boolean | string>(false)
	useEffect(() => {
		if (!LANGUAGE || LANGUAGE === "un") setDisplayLanguagePromptToggle(true)
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
		<Suspense fallback={<LoadingScreen />}>
			<DisplayLanguagePrompt
				state={displayLanguagePrompt}
				toggle={setDisplayLanguagePromptToggle}
			/>
			<Header page={"Home"} />
			<Suspense fallback={<LoadingScreen />}>
				<div className="flex max-w-full flex-col items-center overflow-x-hidden">
					<div className="mb-36 mt-12 w-full max-w-[640px]">
						{feed.map(
							(e, i, a) =>
								e.item &&
								(i !== a.length - 3 ? (
									<div className="mt-16" key={e.id} id={`poll:${e.id}`}>
										<Link href="/poll/[id]" as={`/poll/${e.id}`}>
											<Poll poll={e.item} />
										</Link>
									</div>
								) : (
									<div className="mt-16" key={e.id} id={`poll:${e.id}`} ref={loadPointRef}>
										<Link href="/poll/[id]" as={`/poll/${e.id}`}>
											<Poll poll={e.item} />
										</Link>
									</div>
								))
						)}
					</div>
				</div>
			</Suspense>
		</Suspense>
	)
}

export default Home
// export default withUrqlClient(urqlClientOptions)(Home)
