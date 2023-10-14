// import { dedupExchange, Exchange, fetchExchange } from "urql"
import { fetchExchange } from "urql"
// import { pipe, tap } from "wonka"
import { devtoolsExchange } from "@urql/devtools"
import { Cache, QueryInput, cacheExchange } from "@urql/exchange-graphcache"
import { noBrowser } from "./noBrowser"

// const errorExchange: Exchange =
// 	({ forward }) =>
// 	(ops$) => {
// 		return pipe(
// 			forward(ops$),
// 			tap(({ error }) => {
// 				// if (error && !noBrowser()) {
// 				// 	alert("Unexpected Error: " + error.message)
// 				// 	console.log("Error Message: " + error.message)
// 				// }
// 				if (error) {
// 					alert("Unexpected Error: " + error.message)
// 					console.log("Error Message: " + error.message)
// 				}
// 			})
// 		)
// 	}

export function urqlQueryCacheUpdateFunction<Result, Query>(
	cache: Cache,
	queryInput: QueryInput,
	result: any,
	updateFunction: (r: Result, q: Query) => Query
) {
	return cache.updateQuery(queryInput, (data) => updateFunction(result, data as any) as any)
}

export const urqlClientOptions = (ssrExchange: any, ctx: any) => {
	let cookie = ""
	if (noBrowser()) cookie = ctx?.req?.headers?.cookie
	return {
		url: "http://localhost:4000/graphql",
		fetchOptions: {
			credentials: "include" as const,
			headers: cookie ? { cookie } : undefined,
		},
		exchanges: [
			cacheExchange({
				keys: {
					Vote: (data) => JSON.stringify(data.optionId),
					PollTopic: (data) => JSON.stringify(data.topicId),
					UserPersonalSettings: (data) => JSON.stringify(data.userId),
					Language: (data) => JSON.stringify(data.code),
					// Topic: (data) => JSON.stringify(data.id),
				},
				updates: {
					// Mutation: {
					// 	sendVoteReq: (_result, _args, cache, _info) => {
					// 	}
					// }
				},
			}),
			// cacheExchange({
			// 	updates: {
			// 		Mutation: {
			// 			sendVoteReq: (_result, args, cache, _info) => {
			// 				const { voteReq } = args as SendVoteReqMutationVariables
			// 				cache.invalidate({
			// 					__typename: "Vote",
			// 					pollId: voteReq.pollId,
			// 				})
			// 			},
			// 			sendVoteReq: (_result, args, cache, _info) => {
			// 				const { voteReq } = args as SendVoteReqMutationVariables
			// 				voteReq.voteState.forEach((e) => {
			// 					const inCache = cache.readFragment(
			// 						gql`
			// 							fragment _ on Vote {
			// 								optionId
			// 							}
			// 						`,
			// 						{ optionId: e.optionId } as any
			// 					)
			// 					if (e.state === "voted" && !inCache) {
			// 						cache.writeFragment(
			// 							gql`
			// 								fragment __ on Vote {
			// 									optionId
			// 									pollId
			// 								}
			// 							`,
			// 							{
			// 								optionId: e.optionId,
			// 								pollId: voteReq.pollId,
			// 							}
			// 						)
			// 					} else if ((!e.state || e.state === "unvoted" )&& inCache) {
			// 						cache.invalidate({
			// 							__typename: "Vote",
			// 							optionId: e.optionId,
			// 						})
			// 					}
			// 				})
			// 			}
			// 		},
			// 	},
			// }),
			// errorExchange,
			ssrExchange,
			fetchExchange,
			devtoolsExchange,
		],
	}
}


