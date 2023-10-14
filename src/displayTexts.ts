export const EN = "en"
export const ZH_TW = "zh-TW"
export const ZH_CN = "zh-CN"
export const DEFAULT_LANGUAGE = EN

export class displayLanguage {
	static availableLanguages = [EN, ZH_TW]
	static fallback(languageCodes: string[]) {
		const intersection = languageCodes.filter((e) =>
			displayLanguage.availableLanguages.includes(e)
		)
		if (intersection.length === 0) return DEFAULT_LANGUAGE
		intersection.sort((a, b) => (a === ZH_TW ? -1 : b === ZH_TW ? 1 : 0)) // Prioritize Traditional Chinese
		intersection.sort((a, b) => (a === EN ? 1 : b === EN ? -1 : 0)) // Push Back English (id:1)
		return intersection[0]
	}
}

const D: Record<string, Record<string, string>> = {
	"Login/Join with Google": {
		[EN]: "Login/Join with Google",
		[ZH_TW]: "透過 Google 登入/加入",
	},
	"Continue with Google": {
		[EN]: "Continue with Google",
		[ZH_TW]: "透過 Google 繼續",
	},
	"Change Display Language?": {
		[EN]: "Change Display Language?",
		[ZH_TW]: "要更換界面語言嗎？",
	},
	"make a poll": {
		[EN]: "make a poll",
		[ZH_TW]: "發佈新投票",
	},
	"my profile": {
		[EN]: "my profile",
		[ZH_TW]: "個人頁面",
	},
	"FEATURED": {
		[EN]: "FEATURED",
		[ZH_TW]: "精選",
	},
}
export const d = (L: string, s: string) => (!D[s] ? "" : !D[s][L] ? D[s][DEFAULT_LANGUAGE] : D[s][L])
