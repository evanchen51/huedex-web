import { useEffect, useState } from "react"
import { useGetLangTableQuery } from "../generated/graphql"

export const useFallbackLang = () => {
	const [{ data }] = useGetLangTableQuery()
	const [res, setRes] = useState(1)
	useEffect(() => {
		if (data?.getLangTable) {
			let langId = data?.getLangTable?.filter((e) =>
				navigator.language.toLowerCase().includes(e.code.toLowerCase())
			)
			if (langId.length < 1) {
				setRes(1)
			} else {
				setRes(langId[0].id)
         }
         return 
		}
	}, [data])
	return res
}
