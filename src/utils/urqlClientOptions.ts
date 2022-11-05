import { cacheExchange } from "@urql/exchange-graphcache"
import { dedupExchange, Exchange, fetchExchange } from "urql"
import { pipe, tap } from "wonka"
import { noBrowser } from "./noBrowser"

const errorExchange: Exchange =
	({ forward }) =>
	(ops$) => {
		return pipe(
			forward(ops$),
			tap(({ error }) => {
				if (error && !noBrowser()) {
					alert("Unexpected Error: " + error.message)
					console.log("Error Message: " + error.message)
				}
			})
		)
	}

export const urqlClientOptions = (ssrExchange: any, ctx: any) => {
	let cookie = ""
	if (noBrowser()) cookie = ctx?.req?.headers?.cookie
	return {
		url: "http://localhost:4000/graphql",
		fetchOptions: {
			credentials: "include" as const,
			headers: { cookie: cookie },
		},
		exchanges: [
			dedupExchange,
			cacheExchange({
				keys: {
					Vote: (data) => JSON.stringify(data.optionId),
					PollTopic: (data) => JSON.stringify(data.topicId),
					UserPersonalSettings: (data) => JSON.stringify(data.userId),
					Topic: (data) => JSON.stringify(data.name),
				},
				updates: {
					Mutation: {},
				},
			}),
			errorExchange,
			ssrExchange,
			fetchExchange,
		],
	}
}
