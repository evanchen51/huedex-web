import { Field, Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { AUTH_GOOGLE_PATH_ORIGIN } from "../constants"
import {
	useGetCurrentUserAllLangPrefsQuery,
	useGetCurrentUserQuery,
	useGetSinglePollQuery,
	useLogoutMutation
} from "../generated/graphql"
import { notBrowser } from "../utils/notBrowser"
import { urqlClientOptions } from "../utils/urqlClientOptions"
import { useFallbackLang } from "../utils/useFallbackLang"

const Index: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: currentUserData, fetching: currentUserFetching }] =
		useGetCurrentUserQuery({ pause: notBrowser() })
	const [{ data: currentUserAllLangPrefs, fetching: currentUserAllLangPrefsFetching }] =
		useGetCurrentUserAllLangPrefsQuery({
			pause: notBrowser() || !currentUserData?.getCurrentUser?.id,
		})
	const fallbackLang = useFallbackLang()
	const [getSinglePoll, setGetSinglePoll] = useState(false)
	const [getSinglePollVariables, setGetSinglePollVariables] = useState({
		id: 1,
		langId: 1,
	})
	const [{ data: singlePollData, fetching: singlePollFetching }] = useGetSinglePollQuery(
		{ pause: !getSinglePoll, variables: getSinglePollVariables }
	)
	const [, logout] = useLogoutMutation()

	let loginInfo = null

	if (!currentUserFetching) {
		loginInfo = currentUserData?.getCurrentUser?.id ? (
			<>
				<>{currentUserData.getCurrentUser.displayName}</>
				<>
					{!currentUserAllLangPrefsFetching &&
						currentUserAllLangPrefs?.getCurrentUserAllLangPrefs.langId.map((e) => {
							return <div key={e}>{e}</div>
						})}
				</>
			</>
		) : (
			<button
				onClick={() => {
					localStorage.setItem(AUTH_GOOGLE_PATH_ORIGIN, router.pathname)
					location.href = "http://localhost:4000/auth/google"
				}}
			>
				Login with Google
			</button>
		)
	}

	useEffect(() => {
		console.log(singlePollData)
	}, [singlePollData])

	return (
		<div
			style={{
				marginLeft: "40vw",
				marginTop: "30vh",
				display: "flex",
				flexDirection: "column",
				justifyContent: "start",
				alignItems: "start",
				minHeight: "100vh",
			}}
		>
			<div>{loginInfo}</div>
			<button
				onClick={async () => {
					await logout()
					router.reload()
				}}
			>
				Logout
			</button>
			<div>
				<Formik
					initialValues={{ id: "" }}
					validate={(values) => {
						let errors = {}
						if (!/^\d+$/.test(values.id)) errors = { id: "" }
						return errors
					}}
					onSubmit={(values, methods) => {
						setGetSinglePollVariables({
							...getSinglePollVariables,
							id: parseInt(values.id),
							langId: currentUserData?.getCurrentUser?.primaryLangPref
								? currentUserData.getCurrentUser.primaryLangPref
								: fallbackLang,
						})
						setGetSinglePoll(true)
						if (singlePollFetching) if (!singlePollFetching) setGetSinglePoll(false)
						methods.setSubmitting(false)
					}}
				>
					{({ isSubmitting, errors, handleSubmit }) => (
						<Form
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSubmit()
								}
							}}
						>
							<Field name="id" placeholder="id" />
							<button type="submit" disabled={isSubmitting}>
								Submit
							</button>
							<div>{errors.id && errors.id}</div>
						</Form>
					)}
				</Formik>
			</div>
			<div>
				{!singlePollData?.getSinglePoll ? null : (
					<div>
						<div>
							first posted by
							{!singlePollData.getSinglePoll.posterId ? (
								<div>&lt;anonymous&gt;</div>
							) : (
								<div>
									<Link
										href="/account/[id]"
										as={`/account/${singlePollData.getSinglePoll.posterId}`}
										passHref
									>
										<b>{singlePollData.getSinglePoll.posterDisplayName}</b>
									</Link>
								</div>
							)}
							on {singlePollData.getSinglePoll.createdAt}
						</div>
						{/* TODO what lang pref to use */}
						<div></div>
					</div>
				)}
			</div>
		</div>
	)
}

export default withUrqlClient(urqlClientOptions, { ssr: true })(Index)
