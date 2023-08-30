import Toast from "../components/Toast"
import { usePreserveScroll } from "../utils/usePreserveScroll"
import { VoteContextProvider } from "../utils/useVoteHandler"
import "./../styles/globals.css"

function MyApp({ Component, pageProps }: any) {
	usePreserveScroll()
	return (
		<>
			<VoteContextProvider>
				<Component {...pageProps} />
				<Toast />
			</VoteContextProvider>
		</>
	)
}

export default MyApp
