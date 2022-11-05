export const EN = "en"
export const ZH_TW = "zh-TW"
export const ZH_CN = "zh-CN"
export const DEFAULT_LANGUAGE = EN

export class displayLanguage {
	static availableLanguages = [EN, ZH_TW]
	static fallback(languageCodes: string[]) {
		const intersection = languageCodes.filter((e) => displayLanguage.availableLanguages.includes(e))
		if (intersection.length === 0) return DEFAULT_LANGUAGE
		intersection.sort((a, b) => (a === ZH_TW ? -1 : b === ZH_TW ? 1 : 0)) // Prioritize Traditional Chinese
		intersection.sort((a, b) => (a === EN ? 1 : b === EN ? -1 : 0)) // Push Back English (id:1)
		return intersection[0]
	}
}
