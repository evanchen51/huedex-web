import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import LoadingScreen from "../../components/LoadingScreen"
import { LOCALSTORAGE_KEY_PATH_ORIGIN } from "../../constants"
import { useGetCurrentUserQuery } from "../../generated/graphql"
import { noBrowser } from "../../utils/noBrowser"
import { urqlClientOptions } from "../../utils/urqlClient"

const LoginSuccessRedirect: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: userData, fetching: userFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})
	// const [{ data: settingsData, fetching: settingsFetching }] =
	// 	useGetCurrentUserPersonalSettingsQuery({ pause: noBrowser() || userFetching })
	// let req = ""
	// if (noBrowser() || userFetching || settingsFetching) return <Loading />
	if (noBrowser() || userFetching) return <LoadingScreen />
	if (!userData?.getCurrentUser) return <>error</>
	// if (!userData.getCurrentUser.displayName) req += ":displayname"
	// if (settingsData?.getCurrentUserPersonalSettings?.displayLanguageCode === "un")
	// 	req += ":langpref"
	// if (req.length > 0) router.replace(`/login-success-redirect/new-user-settings/${req}`)
	else {
		let url = localStorage.getItem(LOCALSTORAGE_KEY_PATH_ORIGIN)
		if (url) {
			localStorage.removeItem(LOCALSTORAGE_KEY_PATH_ORIGIN)
			router.push(url)
		} else router.push("/")
	}
	return <LoadingScreen />
}

export default withUrqlClient(urqlClientOptions)(LoginSuccessRedirect)
