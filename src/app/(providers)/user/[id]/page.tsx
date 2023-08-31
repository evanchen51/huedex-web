import { withUrqlClient } from "next-urql"
import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react"
import LoadingScreen from "../../../../components/LoadingScreen"
import { LoginPrompt } from "../../../../components/LoginPrompt"
import Poll from "../../../../components/Poll"
import {
	FeedItem,
	useGetCurrentUserQuery,
	useGetUserPostedPollsQuery,
	useGetUserQuery,
	useGetUserVotedPollsQuery,
} from "../../../../generated/graphql"
import { colors } from "../../../../utils/colors"
import { noBrowser } from "../../../../utils/noBrowser"
import { urqlClientOptions } from "../../../../utils/urqlClientOptions"
import LoadingSpinner from "../../../../components/LoadingSpinner"
import Header from "../../../../components/Header"

const UserPage: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [loginPromptToggle, setLoginPromptToggle] = useState<boolean | string>(false)
	const [{ data: currentUserData, fetching: currentUserFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})
	const [{ data: userData }] = useGetUserQuery({
		variables: { id: router.query.id as string },
	})
	const [feed, setFeed] = useState<Record<string, FeedItem[]>>({ voted: [], posted: [] })
	const [feedDeduper, setFeedDeduper] = useState<Record<string, Record<string, boolean>>>({
		voted: {},
		posted: {},
	})
	const [tabToggle, setTabToggle] = useState<string>("voted")
	const [cursorId, setCursorId] = useState<string | null>(null)
	// const [{ data: feedData, fetching: feedFetching, operation: feedOperation }] =
	const [{ data: votedData, fetching: votedFetching }] = useGetUserVotedPollsQuery({
		variables: { userId: router.query.id as string, cursorId },
	})
	const [{ data: postedData, fetching: postedFetching }] = useGetUserPostedPollsQuery({
		variables: { userId: router.query.id as string, cursorId },
		pause: tabToggle !== "posted",
	})

	useEffect(() => {
		if (!votedData || votedData?.getUserVotedPolls.length === 0) return
		// console.log(feedOperation)
		setFeed((prev) => ({
			...prev,
			voted: [
				...prev["voted"],
				...votedData.getUserVotedPolls.filter((e) =>
					feedDeduper["voted"][e.id]
						? false
						: (setFeedDeduper((prev) => ({
								...prev,
								voted: { ...prev["voted"], [e.id]: true },
						  })),
						  true)
				),
			],
		}))
	}, [votedData, votedData?.getUserVotedPolls])
	useEffect(() => {
		if (!postedData || postedData?.getUserPostedPolls.length === 0) return
		// console.log(feedOperation)
		setFeed((prev) => ({
			...prev,
			posted: [
				...prev["posted"],
				...postedData.getUserPostedPolls.filter((e) =>
					feedDeduper["posted"][e.id]
						? false
						: (setFeedDeduper((prev) => ({
								...prev,
								posted: { ...prev["posted"], [e.id]: true },
						  })),
						  true)
				),
			],
		}))
	}, [postedData, postedData?.getUserPostedPolls])
	const loadObserver = useRef<IntersectionObserver>()
	const loadPointRef = useCallback(
		(node) => {
			if (votedFetching || postedFetching) return
			if (
				(tabToggle === "voted" && votedData?.getUserVotedPolls.length === 0) ||
				(tabToggle === "posted" && postedData?.getUserPostedPolls.length === 0)
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
			votedData?.getUserVotedPolls.length,
			votedFetching,
			postedData?.getUserPostedPolls.length,
			postedFetching,
		]
	)

	if (noBrowser() || currentUserFetching) return <LoadingScreen />

	return (
		<div className="h-screen">
			{!currentUserData?.getCurrentUser && loginPromptToggle && (
				<LoginPrompt
					message={"login/join to vote"}
					state={loginPromptToggle}
					toggle={setLoginPromptToggle}
				/>
			)}
			<Header />
			<div className="pointer-events-none h-16 w-full" />
			<div className="pointer-events-none sticky top-0 z-[60] flex w-full flex-row items-center justify-center">
				<div className="flex w-full max-w-[640px] flex-row items-center justify-center pt-8 font-normal">
					{/* <div className="tracking-wider text-foreground">topic:</div> */}
					<div className="text-md ml-2 text-foreground">
						<div className="">{userData?.getUser?.displayName || "..."}</div>
					</div>
				</div>
			</div>
			<div className="mx-auto mt-6 flex w-[240px] max-w-[75vw] flex-row items-center justify-center tracking-wider text-foreground">
				<div
					className="mr-32 flex cursor-pointer flex-col items-center"
					style={{ color: tabToggle === "voted" ? colors["foreground"] : colors["secondary"] }}
					onClick={() => {
						setTabToggle("voted")
					}}
				>
					voted
					<div
						className="mt-1 h-1 w-1 rounded-xl bg-foreground"
						style={{
							visibility: tabToggle === "voted" ? "visible" : "hidden",
						}}
					/>
				</div>
				<div
					className="flex cursor-pointer flex-col items-center"
					style={{
						color: tabToggle === "posted" ? colors["foreground"] : colors["secondary"],
					}}
					onClick={() => {
						setTabToggle("posted")
					}}
				>
					posted
					<div
						className="mt-1 h-1 w-1 rounded-xl bg-foreground"
						style={{
							visibility: tabToggle === "posted" ? "visible" : "hidden",
						}}
					/>
				</div>
			</div>
			<div className="flex h-max max-w-full flex-col items-center overflow-x-hidden">
				<div className="mb-36 mt-[-12px] w-full max-w-[640px]">
					{!feed[tabToggle] || feed[tabToggle].length === 0 ? (
						<div className="mt-20 flex w-full flex-col items-center">
							{(tabToggle === "voted" && votedFetching) ||
							(tabToggle === "posted" && postedFetching) ? (
								<LoadingSpinner />
							) : (
								<div className="text-sm tracking-wider text-secondary">
									nothing here at the moment
								</div>
							)}
						</div>
					) : (
						feed[tabToggle].map((e, i, a) =>
							currentUserData?.getCurrentUser
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

export default withUrqlClient(urqlClientOptions, { ssr: true })(UserPage)
