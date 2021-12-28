import { notBrowser } from "./notBrowser"
import { cacheExchange } from "@urql/exchange-graphcache"
import { dedupExchange, Exchange, fetchExchange } from "urql"
import { pipe, tap } from "wonka"

const errorExchange: Exchange =
	({ forward }) =>
	(ops$) => {
		return pipe(
			forward(ops$),
			tap(({ error }) => {
				if (error) {
					alert("Unexpected Error")
					console.log("Error Message: " + error.message)
				}
			})
		)
	}

export const urqlClientOptions = (ssrExchange: any, ctx: any) => {
	let cookie = ""
	if (notBrowser()) cookie = ctx?.req?.headers?.cookie
	return {
		url: "http://localhost:4000/graphql",
		fetchOptions: {
			credentials: "include" as const,
			headers: { cookie: cookie },
		},
		exchanges: [
			dedupExchange,
			cacheExchange({
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
