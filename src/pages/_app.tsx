import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import VoteSwitch from "../components/VoteSwitch"
import { urqlClientOptions } from "../utils/urqlClient"
import { ImageFullViewProvider } from "../utils/useImageFullViewer"
import { VoteContextProvider } from "../utils/useVoteHandler"
import "./../styles/globals.css"

function App({ Component, pageProps }: any) {
	// usePreserveScroll()
	const router = useRouter()
	return (
		<VoteContextProvider>
			<ImageFullViewProvider>
				{/* <SidebarScrollerProvider> */}
					<VoteSwitch />
					<Component {...pageProps} key={router.asPath} />
				{/* </SidebarScrollerProvider> */}
			</ImageFullViewProvider>
		</VoteContextProvider>
	)
}

// export default App
export default withUrqlClient(urqlClientOptions)(App)
