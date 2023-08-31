import { createClient, fetchExchange } from "@urql/core"
import { cacheExchange } from "@urql/exchange-graphcache"
import { registerUrql } from "@urql/next/rsc"

// let cookie = ""
// if (noBrowser()) cookie = ctx?.req?.headers?.cookie
const makeClient = () => {
	return createClient({
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
						fetchExchange,]
	})
}

const { getClient } = registerUrql(makeClient)
export default getClient