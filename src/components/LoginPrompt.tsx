import { useRouter } from "next/router"
import React from "react"
import { LOCALSTORAGE_KEY_PATH_ORIGIN } from "../constants"

export const LoginPrompt: React.FC<{
	message: string
	toggle: React.Dispatch<React.SetStateAction<boolean | string>>
}> = ({ message, toggle }) => {
	const router = useRouter()
	return (
		<>
			<>{message}</>
			<button onClick={() => toggle(false)}>x</button>
			<button
				onClick={() =>
					toggle((prev) => {
						localStorage.setItem(
							LOCALSTORAGE_KEY_PATH_ORIGIN,
							typeof prev === "string" ? `/poll/${prev}` : router.pathname
						)
						location.href = "http://localhost:4000/auth/google"
						return false
					})
				}
			>
				Login with Google
			</button>
		</>
	)
}
