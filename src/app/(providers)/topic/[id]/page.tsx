import { withUrqlClient } from "next-urql"
import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react"
import LoadingScreen from "../../../../components/LoadingScreen"
import LoadingSpinner from "../../../../components/LoadingSpinner"
import { LoginPrompt } from "../../../../components/LoginPrompt"
import Poll from "../../../../components/Poll"
import {
	FeedItem,
	useGetCurrentUserQuery,
	useGetTopicNewPollsQuery,
	useGetTopicTopPollsQuery,
} from "../../../../generated/graphql"
import { colors } from "../../../../utils/colors"
import { noBrowser } from "../../../../utils/noBrowser"
import { urqlClientOptions } from "../../../../utils/urqlClientOptions"
import Header from "../../../../components/Header"

const TopicPage: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [loginPromptToggle, setLoginPromptToggle] = useState<boolean | string>(false)
	const [{ data: userData, fetching: userFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})
	const [feed, setFeed] = useState<Record<string, FeedItem[]>>({ top: [], new: [] })
	const [feedDeduper, setFeedDeduper] = useState<Record<string, Record<string, boolean>>>({
		top: {},
		new: {},
	})
	const [tabToggle, setTabToggle] = useState<string>("top")
	const [cursorId, setCursorId] = useState<string | null>(null)
	// const [{ data: feedData, fetching: feedFetching, operation: feedOperation }] =
	const [{ data: topData, fetching: topFetching }] = useGetTopicTopPollsQuery({
		variables: { topicId: (router.query.id as string).replace("%20", " "), cursorId },
	})
	const [{ data: newData, fetching: newFetching }] = useGetTopicNewPollsQuery({
		variables: { topicId: (router.query.id as string).replace("%20", " "), cursorId },
		pause: tabToggle !== "new",
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

	if (noBrowser() || userFetching) return <LoadingScreen />

	return (
		<div className="h-screen">
			{!userData?.getCurrentUser && loginPromptToggle && (
				<LoginPrompt
					message={"login/join to vote"}
					state={loginPromptToggle}
					toggle={setLoginPromptToggle}
				/>
			)}
			<Header />
			<div className="pointer-events-none h-16 w-1" />
			<div className="pointer-events-none sticky top-0 z-[60] flex w-full flex-row items-center justify-center">
				<div className="flex w-full max-w-[640px] flex-row items-center justify-center pt-8 font-normal">
					{/* <div className="tracking-wider text-foreground">topic:</div> */}
					<div className="rounded-full bg-foreground px-3 py-1 text-sm text-background">
						<div className="">{(router.query.id as string).replace("%20", " ")}</div>
					</div>
				</div>
			</div>
			<div className="mx-auto mt-6 flex w-[240px] max-w-[75vw] flex-row items-center justify-center tracking-wider text-foreground">
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
				<div className="mb-36 mt-[-12px] w-full max-w-[640px]">
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
						feed[tabToggle].map((e, i, a) =>
							userData?.getCurrentUser
								? e.item &&
								  (i !== a.length - 3 ? (
										<div className="mt-16">
											<Link
												href="/poll/[id]"
												as={`/poll/${e.id}`}
												// rel="noopener noreferrer"
												// target="_blank"
												// passHref
											>
												<Poll
													key={e.item.id}
													poll={{ ...e.item, options: e.item.topOptions }}
												/>
											</Link>
										</div>
								  ) : (
										<div ref={loadPointRef} className="mt-16">
											<Link
												href="/poll/[id]"
												as={`/poll/${e.id}`}
												// rel="noopener noreferrer"
												// target="_blank"
												// passHref
											>
												<Poll
													key={e.item.id}
													poll={{ ...e.item, options: e.item.topOptions }}
												/>
											</Link>
										</div>
								  ))
								: e.item &&
								  (i !== a.length - 3 ? (
										<div className="mt-16">
											<Link
												href="/poll/[id]"
												as={`/poll/${e.id}`}
												// rel="noopener noreferrer"
												// target="_blank"
												// passHref
											>
												<Poll
													key={e.item.id}
													poll={{ ...e.item, options: e.item.topOptions }}
													visitor={setLoginPromptToggle}
												/>
											</Link>
										</div>
								  ) : (
										<div ref={loadPointRef} className="mt-16">
											<Link
												href="/poll/[id]"
												as={`/poll/${e.id}`}
												// rel="noopener noreferrer"
												// target="_blank"
												// passHref
											>
												<Poll
													key={e.item.id}
													poll={{ ...e.item, options: e.item.topOptions }}
													visitor={setLoginPromptToggle}
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
