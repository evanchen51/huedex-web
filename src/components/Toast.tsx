import React from "react"

const Toast: React.FC<{ toggle?: boolean }> = ({ children }) => {
	// const [message, setMessage] = useState<null | string>(null)
	// useEffect(() => {
	// 	if (toggle) {
	// 		const stored = sessionStorage.getItem(SESSIONSTORAGE_KEY_TOAST_MESSAGE)
	// 		sessionStorage.removeItem(SESSIONSTORAGE_KEY_TOAST_MESSAGE)
	// 		if (stored) setMessage(stored)
	// 	}
	// }, [toggle])
	// useEffect(() => {
	// 	if (message) setTimeout(() => setMessage(null), 3000)
	// }, [message])

	return (
		<>
			{children}
			{/* {message && message} */}
		</>
	)
}

Toast.defaultProps = { toggle: true }

export default Toast
