import { Field, Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { LOCALSTORAGE_KEY_PATH_ORIGIN } from "../../../constants"
import { displayLanguage } from "../../../displayTexts"
import {
	useGetAllLanguagesQuery,
	useSetUserDisplayLanguageMutation,
	useSetUserDisplayNameMutation
} from "../../../generated/graphql"
import { urqlClientOptions } from "../../../utils/urqlClientOptions"

const NewUserSettings: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: languagesData }] = useGetAllLanguagesQuery({})
	const [, setUserDisplayLanguage] = useSetUserDisplayLanguageMutation()
	const [, setUserDisplayName] = useSetUserDisplayNameMutation()
	const [reqDisplayName, setReqDisplayName] = useState(false)
	const [reqDisplayLanguage, setReqDisplayLanguage] = useState(false)

	useEffect(() => {
		if (/displayname/.test(router.asPath)) setReqDisplayName(true)
		if (/langpref/.test(router.asPath)) setReqDisplayLanguage(true)
	}, [router])

	return (
		<>
			<Formik
				initialValues={{
					displayName: "",
					displayLanguage: "",
				}}
				validate={(values) => {
					values.displayName = values.displayName.trim()
					let errors = {}
					if (reqDisplayName && values.displayName === "")
						errors = { ...errors, displayName: "please enter your display name" }
					if (reqDisplayName && values.displayName.length < 3)
						errors = { ...errors, displayName: "display name too short" }
					if (reqDisplayName && values.displayName.length > 20)
						errors = { ...errors, displayName: "display name too long" }
					if (reqDisplayLanguage && values.displayLanguage.length < 1)
						errors = { ...errors, displayLanguage: "please select a language" }
					return errors
				}}
				onSubmit={async (values) => {
					reqDisplayName && (await setUserDisplayName({ displayName: values.displayName }))
					reqDisplayLanguage &&
						(await setUserDisplayLanguage({ displayLanguageCode: values.displayLanguage }))
					let url = localStorage.getItem(LOCALSTORAGE_KEY_PATH_ORIGIN)
					if (url) {
						localStorage.removeItem(LOCALSTORAGE_KEY_PATH_ORIGIN)
						router.push(url)
					} else router.push("/")
				}}
			>
				{({ isSubmitting, errors, values, validateField }) => (
					<Form>
						{reqDisplayName && (
							<>
								<div>
									display name&nbsp;
									<Field name="displayName" />
								</div>
								{errors.displayName && errors.displayName}
							</>
						)}
						{reqDisplayLanguage && (
							<>
								<div role="group">
									display language&nbsp;
									{languagesData?.getAllLanguages &&
										languagesData?.getAllLanguages
											.filter((e) => displayLanguage.availableLanguages.includes(e.code))
											.map((e) => (
												<label key={e.code}>
													<Field
														type="radio"
														name="displayLanguage"
														value={e.code}
														checked={values.displayLanguage === e.code}
													/>
													{e.nativeName}
												</label>
											))}
								</div>
								{errors.displayLanguage && errors.displayLanguage}
								{/* TODO other language ___ */}
							</>
						)}
						<button
							type="submit"
							disabled={isSubmitting}
							onClick={() => validateField("displayLanguage")}
						>
							Submit
						</button>
					</Form>
				)}
			</Formik>
		</>
	)
}

export default withUrqlClient(urqlClientOptions)(NewUserSettings)
