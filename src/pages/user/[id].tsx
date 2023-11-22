import { withUrqlClient } from "next-urql"
import Head from "next/head"
import { useRouter } from "next/router"
import { useCallback, useEffect, useRef, useState } from "react"
import Header from "../../components/Header"
import LoadingSpinner from "../../components/LoadingSpinner"
import { LoginPrompt } from "../../components/LoginPrompt"
import Poll from "../../components/Poll"
import Sidebar from "../../components/Sidebar"
import { d } from "../../displayTexts"
import {
	FeedItem,
	useGetUserPostedPollsQuery,
	useGetUserQuery,
	useGetUserVotedPollsQuery,
} from "../../generated/graphql"
import { colors } from "../../utils/colors"
import { urqlClientOptions } from "../../utils/urqlClient"
import { useGetDisplayLanguage } from "../../utils/useGetDisplayLanguage"
import { useVoteHandler } from "../../utils/useVoteHandler"

const UserPage: React.FC<{}> = ({}) => {
	const L = useGetDisplayLanguage()
	const router = useRouter()

	// const [{ data: currentUserData, fetching: currentUserFetching }] = useGetCurrentUserQuery({
	// 	pause: noBrowser(),
	// })

	const { loginPromptControl } = useVoteHandler()

	const [feed, setFeed] = useState<Record<string, FeedItem[]>>({ voted: [], posted: [] })
	const [feedDeduper, setFeedDeduper] = useState<Record<string, Record<string, boolean>>>({
		voted: {},
		posted: {},
	})
	const [cursorId, setCursorId] = useState<string | null>(null)

	const [tabToggle, setTabToggle] = useState<string>("voted")

	const [{ data: userData }] = useGetUserQuery({
		variables: { id: router.query.id as string },
	})

	// const [{ data: feedData, fetching: feedFetching, operation: feedOperation }] =
	const [{ data: votedData, fetching: votedFetching }] = useGetUserVotedPollsQuery({
		variables: { userId: router.query.id as string, cursorId },
		// requestPolicy: "network-only",
	})
	const [{ data: postedData, fetching: postedFetching }] = useGetUserPostedPollsQuery({
		variables: { userId: router.query.id as string, cursorId },
		// pause: tabToggle !== "posted",
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

	// if (noBrowser() || currentUserFetching) return <LoadingScreen />

	return (
		<div className="h-screen">
			<Head>
				<title>Huedex | {userData?.getUser?.displayName || "..."}</title>
				{/* TODO <!-- --> flash bug, Hydration bug */}
			</Head>
			<LoginPrompt control={loginPromptControl} />
			<Header />
			<Sidebar />
			<div className="pointer-events-none h-16 w-1" />
			<div className="flex w-full flex-row items-center justify-center ">
				<div className="flex w-full max-w-[560px] flex-row items-center justify-center pt-9 font-normal sm:ml-[calc(8vw+22.5px)]">
					{/* <div className="tracking-wider text-foreground">topic:</div> */}
					<div className="text-md ml-2 text-foreground">
						<div className="">{userData?.getUser?.displayName || "..."}</div>
					</div>
				</div>
			</div>
			<div className="mx-auto mt-9 flex w-[240px] max-w-[75vw] flex-row items-center justify-center whitespace-nowrap tracking-wider text-foreground sm:pl-[calc(8vw+22.5px)]">
				<div
					className="mr-32 flex cursor-pointer flex-col items-center"
					style={{ color: tabToggle === "voted" ? colors["foreground"] : colors["secondary"] }}
					onClick={() => {
						setTabToggle("voted")
					}}
					onMouseEnter={(e) => {
						if (tabToggle === "voted") return
						;(e.currentTarget.lastElementChild as HTMLElement).style.opacity = "0.2"
					}}
					onMouseLeave={(e) => {
						if (tabToggle === "voted") return
						;(e.currentTarget.lastElementChild as HTMLElement).style.opacity = "0"
					}}
				>
					{d(L, "voted")}
					<div
						className="mt-1 h-1 w-1 rounded-xl bg-foreground transition-opacity duration-200"
						style={{
							opacity: tabToggle === "voted" ? "1" : "0",
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
					onMouseEnter={(e) => {
						if (tabToggle === "posted") return
						;(e.currentTarget.lastElementChild as HTMLElement).style.opacity = "0.2"
					}}
					onMouseLeave={(e) => {
						if (tabToggle === "posted") return
						;(e.currentTarget.lastElementChild as HTMLElement).style.opacity = "0"
					}}
				>
					{d(L, "posted")}
					<div
						className="mt-1 h-1 w-1 rounded-xl bg-foreground transition-opacity duration-200"
						style={{
							opacity: tabToggle === "posted" ? "1" : "0",
						}}
					/>
				</div>
			</div>
			<div className="sm:ml-[calc((100vw_-_560px)/4) flex h-max max-w-full flex-col items-center sm:ml-[calc(8vw+22.5px)]">
				<div className="mb-36 mt-9 w-full max-w-[560px]">
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
						feed[tabToggle].map(
							(e, i, a) =>
								e.item &&
								(i !== a.length - 3 ? (
									<div className="">
										<Poll
											key={e.item.id}
											poll={{ ...e.item, options: e.item.topOptions }}
											link={true}
										/>
									</div>
								) : (
									<div className="" ref={loadPointRef}>
										<Poll
											key={e.item.id}
											poll={{ ...e.item, options: e.item.topOptions }}
											link={true}
										/>
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
