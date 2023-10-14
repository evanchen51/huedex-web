import { withUrqlClient } from "next-urql"
import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react"
import Header from "../../components/Header"
import LoadingSpinner from "../../components/LoadingSpinner"
import { LoginPrompt } from "../../components/LoginPrompt"
import Poll from "../../components/Poll"
import {
	FeedItem,
	useGetTopicNewPollsQuery,
	useGetTopicTopPollsQuery,
} from "../../generated/graphql"
import { colors } from "../../utils/colors"
import { urqlClientOptions } from "../../utils/urqlClient"
import { useVoteHandler } from "../../utils/useVoteHandler"

const TopicPage: React.FC<{}> = ({}) => {
	const router = useRouter()

	const { loginPromptControl } = useVoteHandler()

	const [feed, setFeed] = useState<Record<string, FeedItem[]>>({ top: [], new: [] })
	const [feedDeduper, setFeedDeduper] = useState<Record<string, Record<string, boolean>>>({
		top: {},
		new: {},
	})
	const [cursorId, setCursorId] = useState<string | null>(null)

	const [tabToggle, setTabToggle] = useState<string>("top")

	// const [{ data: feedData, fetching: feedFetching, operation: feedOperation }] =
	const [{ data: topData, fetching: topFetching }] = useGetTopicTopPollsQuery({
		variables: { topicId: (router.query.id as string).replace("-", " "), cursorId },
	})
	const [{ data: newData, fetching: newFetching }] = useGetTopicNewPollsQuery({
		variables: { topicId: (router.query.id as string).replace("-", " "), cursorId },
		// pause: tabToggle !== "new",
	})

	useEffect(() => {
		if (!topData || topData?.getTopicTopPolls.length === 0) return
		// console.log(feedOperation)
		setFeed((prev) => ({
			...prev,
			top: [
				...prev["top"],
				...topData.getTopicTopPolls.filter((e) =>
					feedDeduper["top"][e.id]
						? false
						: (setFeedDeduper((prev) => ({ ...prev, top: { ...prev["top"], [e.id]: true } })),
						  true)
				),
			],
		}))
	}, [topData, topData?.getTopicTopPolls])

	useEffect(() => {
		if (!newData || newData?.getTopicNewPolls.length === 0) return
		// console.log(feedOperation)
		setFeed((prev) => ({
			...prev,
			new: [
				...prev["new"],
				...newData.getTopicNewPolls.filter((e) =>
					feedDeduper["new"][e.id]
						? false
						: (setFeedDeduper((prev) => ({ ...prev, new: { ...prev["new"], [e.id]: true } })),
						  true)
				),
			],
		}))
	}, [newData, newData?.getTopicNewPolls])

	const loadObserver = useRef<IntersectionObserver>()
	const loadPointRef = useCallback(
		(node) => {
			if (topFetching || newFetching) return
			if (
				(tabToggle === "top" && topData?.getTopicTopPolls.length === 0) ||
				(tabToggle === "new" && newData?.getTopicNewPolls.length === 0)
			)
				return
			if (loadObserver.current) loadObserver.current.disconnect()
			loadObserver.current = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					// setSeen(feed.map((e) => e.id))
					setCursorId(feed[tabToggle][feed[tabToggle].length - 1].id)
				}
			})
			if (node) loadObserver.current.observe(node)
		},
		[
			feed,
			topData?.getTopicTopPolls.length,
			topFetching,
			newData?.getTopicNewPolls.length,
			newFetching,
		]
	)

	// if (noBrowser() || userFetching) return <LoadingScreen />

	return (
		<div className="h-screen">
			<LoginPrompt message={"Login/Join to vote"} control={loginPromptControl} />
			<Header />
			<div className="pointer-events-none h-20 w-1" />
			<div className="flex w-full flex-row items-center justify-center">
				<div className="flex w-full max-w-[560px] flex-row items-center justify-center pt-7 font-normal">
					{/* <div className="tracking-wider text-foreground">topic:</div> */}
					<div className="relative flex h-9 items-center rounded-full bg-foreground px-4 py-1.5 text-sm text-background">
						{(router.query.id as string).replace("-", " ")}
					</div>
				</div>
			</div>
			<div className="mx-auto mt-9 flex w-[240px] max-w-[75vw] flex-row items-center justify-center tracking-wider text-foreground">
				<div
					className="mr-32 flex cursor-pointer flex-col items-center"
					style={{ color: tabToggle === "top" ? colors["foreground"] : colors["secondary"] }}
					onClick={() => {
						setTabToggle("top")
					}}
				>
					top
					<div
						className="mt-1 h-1 w-1 rounded-xl bg-foreground"
						style={{
							visibility: tabToggle === "top" ? "visible" : "hidden",
						}}
					/>
				</div>
				<div
					className="flex cursor-pointer flex-col items-center"
					style={{ color: tabToggle === "new" ? colors["foreground"] : colors["secondary"] }}
					onClick={() => {
						setTabToggle("new")
					}}
				>
					new
					<div
						className="mt-1 h-1 w-1 rounded-xl bg-foreground"
						style={{
							visibility: tabToggle === "new" ? "visible" : "hidden",
						}}
					/>
				</div>
			</div>
			<div className="flex h-max max-w-full flex-col items-center overflow-x-hidden">
				<div className="mb-36 mt-[-12px] w-full max-w-[560px]">
					{!feed[tabToggle] || feed[tabToggle].length === 0 ? (
						<div className="mt-20 flex w-full flex-col items-center">
							{(tabToggle === "top" && topFetching) ||
							(tabToggle === "new" && newFetching) ? (
								<LoadingSpinner />
							) : (
								<div className="text-sm tracking-wider text-secondary">
									nothing here at the moment
								</div>
							)}
						</div>
					) : (
						feed[tabToggle].map(
							(e, i, a) =>
								e.item &&
								(i !== a.length - 3 ? (
									<div className="mt-12">
										<Link href="/poll/[id]" as={`/poll/${e.id}`}>
											<Poll
												key={e.item.id}
												poll={{ ...e.item, options: e.item.topOptions }}
											/>
										</Link>
									</div>
								) : (
									<div className="mt-12" ref={loadPointRef}>
										<Link href="/poll/[id]" as={`/poll/${e.id}`}>
											<Poll
												key={e.item.id}
												poll={{ ...e.item, options: e.item.topOptions }}
											/>
										</Link>
									</div>
								))
						)
					)}
				</div>
			</div>
		</div>
	)
}

export default withUrqlClient(urqlClientOptions, { ssr: true })(TopicPage)
