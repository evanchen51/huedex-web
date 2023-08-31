"use client"

import { UrqlProvider } from "@urql/next"
import Toast from "../../components/Toast"
import { VoteContextProvider } from "../../utils/useVoteHandler"
import { cacheExchange } from "@urql/exchange-graphcache"
import { createClient, fetchExchange, ssrExchange } from "urql/core"
import { usePreserveScroll } from "../../utils/usePreserveScroll"

// let cookie = ""
// if (noBrowser()) cookie = ctx?.req?.headers?.cookie
export const ssr = ssrExchange()
export const client = createClient({
	url: "http://localhost:4000/graphql",
	fetchOptions: {
		credentials: "include",
		// credentials: "include" as const,
		// headers: cookie ? { cookie } : undefined,
	},
	exchanges: [
		cacheExchange({
			keys: {
				Vote: (data) => JSON.stringify(data.optionId),
				PollTopic: (data) => JSON.stringify(data.topicId),
				UserPersonalSettings: (data) => JSON.stringify(data.userId),
				Language: (data) => JSON.stringify(data.code),
			},
			updates: {},
		}),
		ssr,
		fetchExchange,
	],
})

export default function Layout({ children }: { children: React.ReactNode }) {
	usePreserveScroll()
	return (
		<UrqlProvider client={client} ssr={ssr}>
			<VoteContextProvider>
				{children}
				<Toast />
			</VoteContextProvider>
		</UrqlProvider>
	)
}
