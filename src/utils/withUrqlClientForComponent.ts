import {
	NextUrqlClientConfig,
	NextUrqlContext,
	WithUrqlClientOptions,
	withUrqlClient,
	WithUrqlProps,
} from "next-urql"
import { NextComponentType, NextPage } from "next/types"
import NextApp from "next/app"

export const withUrqlClientForComponent = withUrqlClient as (
	getClientConfig: NextUrqlClientConfig,
	options?: WithUrqlClientOptions
) => <C extends NextPage<any, any> | typeof NextApp>(
	AppOrPage: C
) => NextComponentType<NextUrqlContext, {}, Partial<WithUrqlProps>>