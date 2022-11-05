import React, { useEffect, useState } from "react"
import { SESSIONSTORAGE_KEY_TOAST_MESSAGE } from "../constants"

const Toast: React.FC<{ toggle?: boolean }> = ({ toggle }) => {
	const [message, setMessage] = useState<null | string>(null)
	useEffect(() => {
		if (toggle) {
			const stored = sessionStorage.getItem(SESSIONSTORAGE_KEY_TOAST_MESSAGE)
			sessionStorage.removeItem(SESSIONSTORAGE_KEY_TOAST_MESSAGE)
			if (stored) setMessage(stored)
		}
	}, [toggle])
	useEffect(() => {
		if (message) setTimeout(() => setMessage(null), 3000)
	}, [message])

	return <>{message && message}</>
}

Toast.defaultProps = { toggle: true }

export default Toast