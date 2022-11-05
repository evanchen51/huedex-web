import { ZH_CN, ZH_TW } from "../displayTexts"

export const convertBrowserLanguage = (list: readonly string[]) => {
	return [
		...new Set(
			list
				.map((e) => {
					let e_ = e.toLowerCase()
					if (/zh-(tw|hk|mo)/.test(e_)) e_ = ZH_TW
					else if (/zh/.test(e_)) e_ = ZH_CN
					else if (/-/.test(e_)) e_ = "skip"
					return e_
				})
				.filter((e) => e !== "skip")
		),
	]
}
