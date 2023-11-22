import { withUrqlClient } from "next-urql"
import Head from "next/head"
import React, { useEffect, useState } from "react"
import Header from "../components/Header"
import LoadingScreen from "../components/LoadingScreen"
import { d, displayLanguage } from "../displayTexts"
import {
	useGetAllLanguagesQuery,
	useGetCurrentUserQuery,
	useSetUserDisplayLanguageMutation,
} from "../generated/graphql"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClient"
import { useGetDisplayLanguage } from "../utils/useGetDisplayLanguage"

const Settings: React.FC<{}> = ({}) => {
	const L = useGetDisplayLanguage()

	const [{ data: loginData, fetching: loginFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})

	const [{ data: languagesData }] = useGetAllLanguagesQuery({})
	const [, setUserDisplayLanguage] = useSetUserDisplayLanguageMutation()
	const [choice, setChoice] = useState("")

	useEffect(() => {
		if (!L) return
		setChoice(L)
	}, [L])

	if (loginFetching) return <LoadingScreen />
	if (!loginFetching && !loginData?.getCurrentUser)
		return <div className="mx-auto mt-[40vh]">error</div>

	return (
		<div>
			<Head>
				<title>Huedex | Settings</title>
			</Head>
			<Header />
			<div className="mx-auto flex h-full w-full max-w-[400px] flex-col items-center px-9">
				<div className="mt-[25vh] w-full text-[48px] font-thin tracking-wider">
					{d(L, "Settings")}
				</div>
				<div className="mt-9 flex w-full flex-col justify-start rounded-2xl bg-secondary bg-opacity-[0.075] py-6 pl-7 sm:py-7 sm:pl-9 sm:pr-9 ">
					<div className="mb-6 flex w-full flex-row items-center justify-start">
						<div className="text-base font-bold tracking-wider text-foreground">
							{d(L, "Display Language")}
						</div>
						{/* <svg
							className="h-4 fill-foreground pb-[0.5px]"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
						>
							<path d="M57.7 193l9.4 16.4c8.3 14.5 21.9 25.2 38 29.8L163 255.7c17.2 4.9 29 20.6 29 38.5v39.9c0 11 6.2 21 16 25.9s16 14.9 16 25.9v39c0 15.6 14.9 26.9 29.9 22.6c16.1-4.6 28.6-17.5 32.7-33.8l2.8-11.2c4.2-16.9 15.2-31.4 30.3-40l8.1-4.6c15-8.5 24.2-24.5 24.2-41.7v-8.3c0-12.7-5.1-24.9-14.1-33.9l-3.9-3.9c-9-9-21.2-14.1-33.9-14.1H257c-11.1 0-22.1-2.9-31.8-8.4l-34.5-19.7c-4.3-2.5-7.6-6.5-9.2-11.2c-3.2-9.6 1.1-20 10.2-24.5l5.9-3c6.6-3.3 14.3-3.9 21.3-1.5l23.2 7.7c8.2 2.7 17.2-.4 21.9-7.5c4.7-7 4.2-16.3-1.2-22.8l-13.6-16.3c-10-12-9.9-29.5 .3-41.3l15.7-18.3c8.8-10.3 10.2-25 3.5-36.7l-2.4-4.2c-3.5-.2-6.9-.3-10.4-.3C163.1 48 84.4 108.9 57.7 193zM464 256c0-36.8-9.6-71.4-26.4-101.5L412 164.8c-15.7 6.3-23.8 23.8-18.5 39.8l16.9 50.7c3.5 10.4 12 18.3 22.6 20.9l29.1 7.3c1.2-9 1.8-18.2 1.8-27.5zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
						</svg> */}
					</div>
					<div className="flex w-full flex-row items-center overflow-x-scroll">
						{languagesData?.getAllLanguages &&
							languagesData?.getAllLanguages
								.filter((e) => displayLanguage.availableLanguages.includes(e.code))
								.map((e) => (
									<label
										key={e.code}
										className="flex w-max cursor-pointer flex-row items-center whitespace-nowrap break-keep text-foreground"
										onClick={() => {
											setChoice(e.code)
											setUserDisplayLanguage({ displayLanguageCode: e.code })
										}}
									>
										{choice &&
											(choice === e.code ? (
												<svg
													className="mr-3 h-4 fill-foreground"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 512 512"
												>
													<path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
												</svg>
											) : (
												<svg
													className="mr-3 h-4 fill-foreground"
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

export default withUrqlClient(urqlClientOptions)(Settings)
