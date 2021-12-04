import { Field, Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import { useGetCurrentUserQuery, useLogoutMutation } from "../generated/graphql"
import { isSsr } from "../utils/isSsr"
import { urqlClientOptions } from "../utils/urqlClientOptions"

const Index: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: currentUserData, fetching: currentUserFetching }] =
		useGetCurrentUserQuery({ pause: isSsr() })
	const [, logout] = useLogoutMutation()

	let loginInfo = null

	if (!currentUserFetching) {
		loginInfo = currentUserData?.getCurrentUser?.id ? (
			<>{currentUserData.getCurrentUser.id}</>
		) : (
			<a href="http://localhost:4000/auth/google">Login with Google</a>
		)
	}

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
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
			<Formik
				initialValues={{ id: "" }}
				validate={(values) => {
					let errors = {}
					if (!/^\d+$/.test(values.id)) errors = { id: "" }
					return errors
				}}
				onSubmit={(values, { setSubmitting }) => {
					setTimeout(() => {
						alert(JSON.stringify(values, null, 2))
						setSubmitting(false)
					}, 400)
				}}
			>
				{({ isSubmitting, errors }) => (
					<Form>
						<Field name="id" placeholder="id" />
						<button type="submit" disabled={isSubmitting}>
							Submit
						</button>
						<div>{errors.id && errors.id}</div>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default withUrqlClient(urqlClientOptions)(Index)
