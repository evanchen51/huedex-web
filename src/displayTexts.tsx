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

const D: Record<string, Record<string, any>> = {
	"Login/Join with Google": {
		[EN]: "Login/Join with Google",
		[ZH_TW]: "透過 Google 登入/加入",
	},
	"to": {
		[EN]: "to",
		[ZH_TW]: "即可",
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
	"Making poll": {
		[EN]: "Making poll",
		[ZH_TW]: "發佈新投票",
	},
	Home: {
		[EN]: "Home",
		[ZH_TW]: "首頁",
	},
	"my profile": {
		[EN]: "my profile",
		[ZH_TW]: "個人頁面",
	},
	FEATURED: {
		[EN]: "FEATURED",
		[ZH_TW]: "精選",
	},
	"More Options Coming Soon!": {
		[EN]: "More Options Coming Soon!",
		[ZH_TW]: "更多登入方式即將推出！",
	},
	"See and Share Opinions & Tastes": {
		[EN]: "See and Share Opinions & Tastes",
		[ZH_TW]: (
			<span style={{}}>
				看見、分享
				<br />
				<span className=""></span>觀點和品味！
			</span>
		),
	},
	"posted ": {
		[EN]: "posted ",
		[ZH_TW]: "",
	},
	"by ": {
		[EN]: "by ",
		[ZH_TW]: "",
	},
	anonymously: {
		[EN]: "anonymously",
		[ZH_TW]: "匿名",
	},
	"on ": {
		[EN]: "on ",
		[ZH_TW]: "發佈於 ",
	},
	vote: {
		[EN]: "vote",
		[ZH_TW]: "票",
	},
	s: {
		[EN]: "s",
		[ZH_TW]: "",
	},
	options: {
		[EN]: "options",
		[ZH_TW]: "個選項",
	},
	"See All ": {
		[EN]: "See All ",
		[ZH_TW]: "看所有 ",
	},
	Options: {
		[EN]: "Options",
		[ZH_TW]: "選項",
	},
	"Question too short": {
		[EN]: "Question too short",
		[ZH_TW]: "問題太短囉",
	},
	"Question too long": {
		[EN]: "Question too long",
		[ZH_TW]: "問題太長囉",
	},
	"Please enter your your question": {
		[EN]: "Please enter your your question",
		[ZH_TW]: "請輸入問題",
	},
	"Please don't tag too many topics": {
		[EN]: "Please don't tag too many topics",
		[ZH_TW]: "主題太多囉",
	},
	"Please provide at least 2 options": {
		[EN]: "Please provide at least 2 options",
		[ZH_TW]: "請至少提供兩個選項",
	},
	"Please don't leave any options blank": {
		[EN]: "Please don't leave any options blank",
		[ZH_TW]: "有選項是空白的喔",
	},
	"Please avoid duplicate options": {
		[EN]: "Please don't leave any options blank",
		[ZH_TW]: "有選項重複了喔",
	},
	"Poll Question": {
		[EN]: "Poll Question",
		[ZH_TW]: "問題：",
	},
	Image: {
		[EN]: "Image",
		[ZH_TW]: "圖片",
	},
	"Selecting...": {
		[EN]: "Selecting...",
		[ZH_TW]: "選取中...",
	},
	"ADD QUESTION": {
		[EN]: "ADD QUESTION",
		[ZH_TW]: "(新增問題)",
	},
	"Options ": {
		[EN]: "Options ",
		[ZH_TW]: "選項 ",
	},
	"：": {
		[EN]: "",
		[ZH_TW]: "：",
	},
	"Add Multiple Images": {
		[EN]: "Add Multiple Images",
		[ZH_TW]: "加入多張圖片",
	},
	"ADD OPTION": {
		[EN]: "ADD OPTION",
		[ZH_TW]: "(新增選項)",
	},
	Add: {
		[EN]: "Add",
		[ZH_TW]: "新增",
	},
	Option: {
		[EN]: "Option",
		[ZH_TW]: "選項",
	},
	"Topics ": {
		[EN]: "Topics ",
		[ZH_TW]: "主題 ",
	},
	"Search for Topics...": {
		[EN]: "Search for Topics...",
		[ZH_TW]: "搜尋主題...",
	},
	"Create Topic": {
		[EN]: "Create Topic",
		[ZH_TW]: "創建新主題",
	},
	"Post anonymously ": {
		[EN]: "Post anonymously ",
		[ZH_TW]: "匿名發佈 ",
	},
	Preview: {
		[EN]: "Preview",
		[ZH_TW]: "預覽",
	},
	"There might already be some similar polls:": {
		[EN]: "There might already be some similar polls:",
		[ZH_TW]: "類似投票可能已經存在了！",
	},
	"Back to Edit": {
		[EN]: "Back to Edit",
		[ZH_TW]: "返回編輯",
	},
	"Continue to Preview": {
		[EN]: "Continue to Preview",
		[ZH_TW]: "繼續預覽",
	},
	"Preview:": {
		[EN]: "Preview:",
		[ZH_TW]: "預覽：",
	},
	"Create Poll!": {
		[EN]: "Create Poll!",
		[ZH_TW]: "發佈！",
	},
	Creating: {
		[EN]: "Creating",
		[ZH_TW]: "發佈中",
	},
	"Search . . .": {
		[EN]: "Search . . .",
		[ZH_TW]: "搜尋 . . .",
	},
	"coming soon": {
		[EN]: "coming soon",
		[ZH_TW]: "即將推出",
	},
	"Topics you might be interested in:": {
		[EN]: "Topics you might be interested in:",
		[ZH_TW]: "你可能會感興趣的主題：",
	},
	"These people might have similar opinions or tastes with you:": {
		[EN]: (
			<span>
				These people might have
				<br />
				similar opinions or tastes with you:
			</span>
		),
		[ZH_TW]: "這些人似乎有和你相似的觀點或品味：",
	},
	"Following:": {
		[EN]: "Following:",
		[ZH_TW]: "追蹤中：",
	},
	"Hot Topics:": {
		[EN]: "Hot Topics:",
		[ZH_TW]: "熱門主題：",
	},
	"Select:": {
		[EN]: "Select:",
		[ZH_TW]: "選取：",
	},
	"voted": {
		[EN]: "voted",
		[ZH_TW]: "投過",
	},
	"posted": {
		[EN]: "posted",
		[ZH_TW]: "發佈過",
	},
	"top": {
		[EN]: "top",
		[ZH_TW]: "熱門",
	},
	"new": {
		[EN]: "new",
		[ZH_TW]: "最新",
	},
}
export const d = (L: string, s: string) => (!D[s] ? "" : typeof D[s][L] === "undefined" ? D[s][DEFAULT_LANGUAGE] : D[s][L])
