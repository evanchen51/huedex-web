// is it being pre-rendered on Nextjs server (SSR) (no access of browser cookie)?
export const isSsr = () => typeof window === "undefined"