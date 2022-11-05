import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Poll } from "../components/Poll"
import { FeedItem, useGetCurrentUserQuery, useGetHomeFeedQuery } from "../generated/graphql"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClientOptions"

const Home: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: userData, fetching: userFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})
	const [feed, setFeed] = useState<FeedItem[]>([])
	const [feedVariables, setFeedVariables] = useState<string[]>([])
	const [{ data: feedData, fetching: feedFetching }] = useGetHomeFeedQuery({
		variables: { seen: feedVariables },
		pause: noBrowser() || !userData?.getCurrentUser,
		requestPolicy: "network-only",
	})
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
					setFeedVariables(feed.map((e) => e.id))
				}
			})
			if (node) loadObserver.current.observe(node)
		},
		[feed, feedData?.getHomeFeed.length, feedFetching]
	)

	if (noBrowser() || userFetching) return <>loading</>
	if (!userData?.getCurrentUser && !userFetching) router.replace("/visitor")

	return (
		<>
			home
			{feed.map(
				(e, i, a) =>
					e.item &&
					(i !== a.length - 3 ? (
						<div>
							<Poll key={e.item.id} poll={{ ...e.item, options: e.item.topOptions }} />
						</div>
					) : (
						<div ref={loadPointRef}>
							<Poll key={e.item.id} poll={{ ...e.item, options: e.item.topOptions }} />
						</div>
					))
			)}
		</>
	)
}

export default withUrqlClient(urqlClientOptions)(Home)
