"use client"

import React, { useEffect, useState } from "react"
import { useMutation, useQuery } from "urql"
import { LOCALSTORAGE_KEY_FALLBACK_LANGUAGE } from "../constants"
import { displayLanguage } from "../displayTexts"
import {
	GetAllLanguagesDocument,
	GetAllLanguagesQuery,
	SetUserDisplayLanguageDocument,
} from "../generated/graphql"

export const DisplayLanguagePrompt: React.FC<{
	state: string | boolean
	toggle: React.Dispatch<React.SetStateAction<boolean | string>>
}> = ({ state, toggle }) => {
	const [{ data: languagesData }] = useQuery<GetAllLanguagesQuery>({
		query: GetAllLanguagesDocument,
	})
	const [, setUserDisplayLanguage] = useMutation(SetUserDisplayLanguageDocument)
	const fbl = localStorage.getItem(LOCALSTORAGE_KEY_FALLBACK_LANGUAGE)
	const [choice, setChoice] = useState("")
	useEffect(() => {
		if (fbl) setChoice(fbl)
	}, [fbl])

	return (
		<div
			className="absolute z-50 h-screen w-screen"
			onClick={() => {
				toggle("exit")
				setUserDisplayLanguage({ displayLanguageCode: choice })
				setTimeout(() => {
					if (choice !== fbl) window.location.reload()
					toggle(false)
				}, 500)
			}}
			style={{ visibility: state ? "visible" : "hidden" }}
		>
			<div className="fixed flex h-full w-full items-end justify-center bg-foreground bg-opacity-0">
				<div
					className="mb-8 flex h-24 w-[360px] max-w-[calc(100vw-32px)] flex-col justify-start rounded-xl bg-foreground px-6 py-4 shadow-lg transition ease-in-out"
					onClick={(e) => {
						e.stopPropagation()
					}}
					style={{
						transform: !state || state === "exit" ? "translateY(160%)" : "translateY(0)",
					}}
				>
					<div className="mb-2 flex w-full flex-row items-center justify-start self-center">
						<button
							className=""
							onClick={() => {
								toggle("exit")
								setUserDisplayLanguage({ displayLanguageCode: choice })
								setTimeout(() => {
									if (choice !== fbl) window.location.reload()
									toggle(false)
								}, 500)
							}}
						>
							<svg
								className="mr-8 h-4 fill-secondary "
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 384 512"
							>
								<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
							</svg>
						</button>
						<div className="mr-2 tracking-wider text-secondary opacity-60">
							Change Display Language?
						</div>
						<svg
							className="h-4 fill-secondary opacity-60"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
						>
							<path d="M57.7 193l9.4 16.4c8.3 14.5 21.9 25.2 38 29.8L163 255.7c17.2 4.9 29 20.6 29 38.5v39.9c0 11 6.2 21 16 25.9s16 14.9 16 25.9v39c0 15.6 14.9 26.9 29.9 22.6c16.1-4.6 28.6-17.5 32.7-33.8l2.8-11.2c4.2-16.9 15.2-31.4 30.3-40l8.1-4.6c15-8.5 24.2-24.5 24.2-41.7v-8.3c0-12.7-5.1-24.9-14.1-33.9l-3.9-3.9c-9-9-21.2-14.1-33.9-14.1H257c-11.1 0-22.1-2.9-31.8-8.4l-34.5-19.7c-4.3-2.5-7.6-6.5-9.2-11.2c-3.2-9.6 1.1-20 10.2-24.5l5.9-3c6.6-3.3 14.3-3.9 21.3-1.5l23.2 7.7c8.2 2.7 17.2-.4 21.9-7.5c4.7-7 4.2-16.3-1.2-22.8l-13.6-16.3c-10-12-9.9-29.5 .3-41.3l15.7-18.3c8.8-10.3 10.2-25 3.5-36.7l-2.4-4.2c-3.5-.2-6.9-.3-10.4-.3C163.1 48 84.4 108.9 57.7 193zM464 256c0-36.8-9.6-71.4-26.4-101.5L412 164.8c-15.7 6.3-23.8 23.8-18.5 39.8l16.9 50.7c3.5 10.4 12 18.3 22.6 20.9l29.1 7.3c1.2-9 1.8-18.2 1.8-27.5zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
						</svg>
					</div>
					<div className="ml-[-1px] flex flex-row items-center">
						{languagesData?.getAllLanguages &&
							languagesData?.getAllLanguages
								.filter((e) => displayLanguage.availableLanguages.includes(e.code))
								.map((e) => (
									<label
										key={e.code}
										className="flex flex-row items-center text-background"
										onClick={() => {
											setChoice(e.code)
										}}
									>
										{choice &&
											(choice === e.code ? (
												<svg
													className="mr-3 h-4 fill-background"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 512 512"
												>
													<path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
												</svg>
											) : (
												<svg
													className="mr-3 h-4 fill-background"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 512 512"
												>
													<path d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
												</svg>
											))}
										<div className="mr-6">{e.nativeName}</div>
									</label>
								))}
					</div>
				</div>
			</div>
		</div>
	)
}
