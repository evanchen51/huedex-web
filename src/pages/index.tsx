import { withUrqlClient } from "next-urql"
import React from "react"
import { useGetCurrentUserQuery, useLogoutMutation } from "../generated/graphql"
// import { mappedError } from "../utils/mappedError"
import { urqlClientOptions } from "../utils/urqlClientOptions"
import { useRouter } from "next/router"
import { isSsr } from "../utils/isSSR"

const Index: React.FC<{}> = ({ }) => {
	const router = useRouter()
	const [{ data: currentUserData, fetching: currentUserFetching }] = useGetCurrentUserQuery({ pause: isSsr() })
	const [, logout] = useLogoutMutation() 

	// const error = data?.hello && mappedError(data?.hello)
	// const errorKeys = error && Object.keys(error)

	let loginInfo = null

	if (!currentUserFetching) {
		loginInfo = currentUserData?.getCurrentUser?.id ? (
			<>{currentUserData.getCurrentUser.id}</>
		) : (
			<a href="http://localhost:4000/auth/google">Login with Google</a>
		)
	}

	return (
		<>
			{/* {error &&
				errorKeys &&
				errorKeys.map((key) => (
					<div key={key}>
						<div>{key}</div>
						<div>{error[key]}</div>
					</div>
				))} */}
			<div>{loginInfo}</div>
			<button
				onClick={async () => {
					await logout()
					router.reload()
				}}
			>
				Logout
			</button>
		</>
	)
}

export default withUrqlClient(urqlClientOptions)(Index)
