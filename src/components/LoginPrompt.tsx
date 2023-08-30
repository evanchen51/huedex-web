import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { LOCALSTORAGE_KEY_PATH_ORIGIN } from "../constants"

export const LoginPrompt: React.FC<{
	message: string
	state: string | boolean
	toggle: React.Dispatch<React.SetStateAction<boolean | string>>
}> = ({ message, state, toggle }) => {
	const router = useRouter()
	useEffect(() => console.log(state), [state])
	return (
		<div
			className="absolute z-50 h-screen w-screen"
			onClick={() => {
				toggle("exit")
				setTimeout(() => {
					toggle(false)
				}, 500)
			}}
			style={{ visibility: state ? "visible" : "hidden" }}
		>
			<div className="fixed flex h-full w-full items-end justify-center bg-foreground bg-opacity-0">
				<div
					className="mb-8 flex h-48 w-[360px] max-w-[calc(100vw-32px)] flex-col justify-start rounded-xl bg-foreground px-6 py-5 shadow-lg transition ease-in-out"
					onClick={(e) => {
						e.stopPropagation()
					}}
					style={{
						transform: !state || state === "exit" ? "translateY(120%)" : "translateY(0)",
					}}
				>
					<button
						className="mb-2 self-start"
						onClick={() => {
							toggle("exit")
							setTimeout(() => {
								toggle(false)
							}, 500)
						}}
					>
						<svg
							className="h-4 fill-background"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 384 512"
						>
							<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
						</svg>
					</button>
					<div className="mb-6 flex w-full flex-row items-start justify-center self-center">
						{/* <svg
							className="h-7 fill-accent "
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 448 512"
						>
							<path d="M448 296c0 66.3-53.7 120-120 120h-8c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H320c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v32 32 72zm-256 0c0 66.3-53.7 120-120 120H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H64c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v32 32 72z" />
						</svg> */}
						<div className="px-4 font-bold tracking-wider text-background">{message}</div>
						{/* <svg
							className="h-7 fill-accent"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 448 512"
						>
							<path d="M448 296c0 66.3-53.7 120-120 120h-8c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H320c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v32 32 72zm-256 0c0 66.3-53.7 120-120 120H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H64c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v32 32 72z" />
						</svg> */}
					</div>
					<div className="flex flex-col items-center">
						<button
							className="mb-3 flex w-fit flex-row items-center justify-center self-center rounded-full border-[0.5px] border-background px-5 py-3.5"
							onClick={
								() =>
									// toggle((prev) => {
									{
										localStorage.setItem(
											LOCALSTORAGE_KEY_PATH_ORIGIN,
											typeof state === "string" ? `/poll/${state}` : router.pathname
										)
										location.href = "http://localhost:4000/auth/google"
									}
								// return false
							}
						>
							<svg
								className="mr-4 h-3.5 fill-background"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 488 512"
							>
								<path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
							</svg>
							<div className="text-sm font-light text-background">Continue with Google</div>
						</button>
						<div className="mb-2 text-sm font-light text-secondary opacity-30">
							More Options Coming Soon!
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
