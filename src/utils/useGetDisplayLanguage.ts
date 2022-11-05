import { useEffect, useState } from "react"
import { LOCALSTORAGE_KEY_FALLBACK_LANGUAGE } from "../constants"
import { useGetCurrentUserPersonalSettingsQuery } from "../generated/graphql"
import { DEFAULT_LANGUAGE, displayLanguage } from "./../displayTexts"
import { convertBrowserLanguage } from "./convertBrowserLanguage"
import { noBrowser } from "./noBrowser"

export const useGetDisplayLanguage = () => {
	const [{ data: settingsData, fetching: settingsFetching }] =
		useGetCurrentUserPersonalSettingsQuery({ pause: noBrowser() })
	const [res, setRes] = useState(DEFAULT_LANGUAGE)
	useEffect(() => {
		if (settingsFetching) return
		if (!settingsFetching && settingsData?.getCurrentUserPersonalSettings) {
			setRes(settingsData?.getCurrentUserPersonalSettings.displayLanguageCode)
			return
		}
		const local = localStorage.getItem(LOCALSTORAGE_KEY_FALLBACK_LANGUAGE)
		if (local) {
			setRes(local)
			return
		}
		let browserLanguages = convertBrowserLanguage(navigator.languages)
		setRes(displayLanguage.fallback(browserLanguages))
		localStorage.setItem(
			LOCALSTORAGE_KEY_FALLBACK_LANGUAGE,
			displayLanguage.fallback(browserLanguages)
		)
		return
	}, [settingsData, settingsFetching])
	return res
}
