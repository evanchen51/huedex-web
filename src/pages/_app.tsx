import { withUrqlClient } from "next-urql"
import { urqlClientOptions } from "../utils/urqlClient"
import { ImageFullViewProvider } from "../utils/useImageFullViewer"
import { usePreserveScroll } from "../utils/usePreserveScroll"
import { VoteContextProvider } from "../utils/useVoteHandler"
import "./../styles/globals.css"
import { useRouter } from "next/router"

function App({ Component, pageProps }: any) {
	usePreserveScroll()
	const router = useRouter()
	return (
		<VoteContextProvider>
			<ImageFullViewProvider>
				<Component {...pageProps} key={router.asPath} />
			</ImageFullViewProvider>
		</VoteContextProvider>
	)
}

// export default App
export default withUrqlClient(urqlClientOptions)(App)
