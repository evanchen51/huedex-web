import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import { AUTH_GOOGLE_PATH_ORIGIN } from "../../constants"
import { useGetCurrentUserQuery } from "../../generated/graphql"
import { notBrowser } from "../../utils/notBrowser"
import { urqlClientOptions } from "../../utils/urqlClientOptions"

const LoginSuccessRedirect: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: currentUserData, fetching: currentUserFetching }] =
		useGetCurrentUserQuery({ pause: notBrowser() })
	if (!notBrowser() && !currentUserFetching) {
		if (currentUserData?.getCurrentUser) {
			if (!currentUserData.getCurrentUser.displayName)
				router.replace("/login-success-redirect/new-user-settings")
			else {
				let url = localStorage.getItem(AUTH_GOOGLE_PATH_ORIGIN)
				if (url) {
					localStorage.removeItem(AUTH_GOOGLE_PATH_ORIGIN)
					router.push(url)
				} else router.push("/")
			}
		}
	}

	return <></>
}

export default withUrqlClient(urqlClientOptions)(LoginSuccessRedirect)
