import resolveConfig from "tailwindcss/resolveConfig"
import tailwindConfig from "../../tailwind.config.js"

const tw = resolveConfig(tailwindConfig).theme
export const colors = tw?.colors as { [key: string]: string }
