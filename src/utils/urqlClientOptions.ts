import { cacheExchange } from "@urql/exchange-graphcache"
import { dedupExchange, fetchExchange } from "urql"

export const urqlClientOptions = (ssrExchange: any) => {
	return {
		url: "http://localhost:4000/graphql",
		fetchOptions: {
			credentials: "include" as const,
		},
		exchanges: [
			dedupExchange,
			cacheExchange({
				updates: {
					Mutation: {},
				},
			}),
			ssrExchange,
			fetchExchange,
		],
	}
}
