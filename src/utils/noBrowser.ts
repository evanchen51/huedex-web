// NO browser = Being pre-rendered on Nextjs server (SSR) = no access of browser cookie/session-key
export const noBrowser = () => typeof window === "undefined"
