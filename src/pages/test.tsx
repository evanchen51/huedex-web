import { Field, Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { Poll } from "../components/Poll"
import { PATH_ORIGIN as PATH_ORIGIN } from "../constants"
import {
	useGetCurrentUserQuery,
	useGetSinglePollQuery,
	useLogoutMutation,
} from "../generated/graphql"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClientOptions"
import { useFallbackLang } from "../utils/useGetDisplayLanguage"

const Test: React.FC<{}> = ({}) => {
	const router = useRouter()

	// const [{ data: currentUserData, fetching: currentUserFetching }] = useGetCurrentUserQuery({
	// 	pause: notBrowser(),
	// })

	const fallbackLang = useFallbackLang()

	const [getSinglePoll, setGetSinglePoll] = useState(false)

	const [getSinglePollVariables, setGetSinglePollVariables] = useState({
		id: 1,
		langId: 1,
	})

	const [{ data: singlePollData, fetching: singlePollFetching }] = useGetSinglePollQuery({
		pause: !getSinglePoll,
		variables: getSinglePollVariables,
	})

	const [, logout] = useLogoutMutation()

	// let loginInfo =
	// 	null

	// if (!currentUserFetching) {
	// loginInfo = currentUserData?.getCurrentUser?.id ? (
	// 	<>
	// 		<div>{currentUserData.getCurrentUser.displayName || "not set"}</div>
	// 		<div>langPref: {currentUserData.getCurrentUser.langPref || "not set"}</div>
	// 		<button
	// 			onClick={async () => {
	// 				await logout()
	// 				router.reload()
	// 			}}
	// 		>
	// 			Logout
	// 		</button>
	// 	</>
	// ) : (
	let loginInfo = (
		<button
			onClick={() => {
				localStorage.setItem(PATH_ORIGIN, router.pathname)
				location.href = "http://localhost:4000/auth/google"
			}}
		>
			Login with Google
		</button>
	)
	// )
	// }

	useEffect(() => {
		// console.log(singlePollData)
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
			<br />
			<div>
				<Formik
					initialValues={{ id: "" }}
					validate={(values) => {
						let errors = {}
						if (!/^\d+$/.test(values.id)) errors = { id: "" }
						return errors
					}}
					onSubmit={(values, methods) => {
						// setGetSinglePollVariables({
						// 	id: parseInt(values.id),
						// 	langId: currentUserData?.getCurrentUser?.langPref || fallbackLang,
						// })
						// setGetSinglePoll(true)
						// if (singlePollFetching) if (!singlePollFetching) setGetSinglePoll(false)
						// methods.setSubmitting(false)
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
			<br />
			<div>
				{!singlePollData?.getSinglePoll ? null : <Poll data={singlePollData.getSinglePoll} />}
			</div>
		</div>
	)
}

export default withUrqlClient(urqlClientOptions, { ssr: true })(Test)
