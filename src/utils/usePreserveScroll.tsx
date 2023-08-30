import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import { noBrowser } from "./noBrowser"

export const usePreserveScroll = () => {
	const router = useRouter()

	const scrollPositions = useRef<{ [url: string]: number }>({})
	const isBack = useRef(false)

	useEffect(() => {
		router.beforePopState(() => {
			isBack.current = true
			return true
		})

		const onRouteChangeStart = () => {
			const url = router.asPath
			scrollPositions.current[url] = window.scrollY
		}

		const onRouteChangeComplete = (url: any) => {
			if (isBack.current && scrollPositions.current[url]) {
            const scroll = setInterval(() => {
               if (noBrowser()) return
               if (window.scrollY === scrollPositions.current[url]) {
                  clearInterval(scroll)
                  return
               }
               console.log("cum")
					window.scroll({
						top: scrollPositions.current[url],
						behavior: "auto",
					})
					setTimeout(() => {
						clearInterval(scroll)
					}, 300)
				}, 10)
			}

			isBack.current = false
		}

		router.events.on("routeChangeStart", onRouteChangeStart)
		router.events.on("routeChangeComplete", onRouteChangeComplete)

		return () => {
			router.events.off("routeChangeStart", onRouteChangeStart)
			router.events.off("routeChangeComplete", onRouteChangeComplete)
		}
	}, [router])

	return isBack.current
}
