import { Field, Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { AUTH_GOOGLE_PATH_ORIGIN } from "../../constants"
import {
	useGetLangTableQuery,
	useSetUserDisplayNameMutation,
	useSetUserLangPrefMutation
} from "../../generated/graphql"
import { urqlClientOptions } from "../../utils/urqlClientOptions"

const NewUserSettings: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: langTable }] = useGetLangTableQuery()
	const [, setUserDisplayName] = useSetUserDisplayNameMutation()
	const [, setUserLangPref] = useSetUserLangPrefMutation()
	const [primaryLangPrefModalToggle, setPrimaryLangPrefModalToggle] = useState(false)
	const [primaryLangPrefModalPayload, setPrimaryLangPrefModalPayload] = useState<{
		displayName: string
		langPref: string[]
	}>()
	// TODO other language ___
	return (
		<>
			{primaryLangPrefModalToggle && primaryLangPrefModalPayload?.langPref && (
				<>
					<Formik
						initialValues={{
							primaryLangPref: "",
						}}
						validate={(values) => {
							let errors = {}
							if (values.primaryLangPref === "")
								errors = { ...errors, primaryLangPref: "please select one" }
							return errors
						}}
						onSubmit={async (values) => {
							await setUserDisplayName({
								displayName: primaryLangPrefModalPayload.displayName,
							})
							await setUserLangPref({
								newLangPref: [parseInt(values.primaryLangPref)].concat(
									primaryLangPrefModalPayload.langPref
										.filter((e) => e !== values.primaryLangPref)
										.map((e) => parseInt(e))
								),
							})
							let url = localStorage.getItem(AUTH_GOOGLE_PATH_ORIGIN)
							if (url) {
								localStorage.removeItem(AUTH_GOOGLE_PATH_ORIGIN)
								router.push(url)
							} else router.push("/")
						}}
					>
						{({ isSubmitting, errors, values }) => (
							<Form>
								<div role="group">
									choose a priamry&nbsp;
									{primaryLangPrefModalPayload.langPref.map((e) => {
										return (
											<label key={e}>
												<Field
													type="radio"
													name="primaryLangPref"
													value={e}
													checked={values.primaryLangPref === e}
												/>
												{
													langTable?.getLangTable?.find(
														(E) => E.id.toString() === e
													)?.nativeName
												}
											</label>
										)
									})}
								</div>
								<button type="submit" disabled={isSubmitting}>
									Submit
								</button>
								{errors.primaryLangPref && errors.primaryLangPref}
							</Form>
						)}
					</Formik>
				</>
			)}
			<Formik
				initialValues={{
					displayName: "",
					langPref: [] as string[],
				}}
				validate={(values) => {
					values.displayName = values.displayName.trim()
					let errors = {}
					if (values.displayName === "")
						errors = { ...errors, displayName: "please enter your display name" }
					if (values.displayName.length > 20)
						errors = { ...errors, displayName: "display name too long" }
					if (values.langPref.length < 1)
						errors = { ...errors, langPref: "please select a language" }
					return errors
				}}
				onSubmit={async (values) => {
					if (values.langPref.length > 1) {
						setPrimaryLangPrefModalPayload(values)
						setPrimaryLangPrefModalToggle(true)
					} else {
						await setUserDisplayName({ displayName: values.displayName })
						await setUserLangPref({ newLangPref: [parseInt(values.langPref[0])] })
						let url = localStorage.getItem(AUTH_GOOGLE_PATH_ORIGIN)
						if (url) {
							localStorage.removeItem(AUTH_GOOGLE_PATH_ORIGIN)
							router.push(url)
						} else router.push("/")
					}
				}}
			>
				{({ isSubmitting, errors, values, validateField }) => (
					<Form>
						<label>
							display name&nbsp;
							<Field name="displayName" />
						</label>
						{errors.displayName && errors.displayName}
						<div role="group">
							what you speak&nbsp;
							{langTable?.getLangTable &&
								langTable?.getLangTable.map((e) => {
									return (
										<label key={e.id}>
											<Field
												type="checkbox"
												name="langPref"
												value={e.id}
												checked={values.langPref.includes(
													(e.id as any).toString()
												)}
											/>
											{e.nativeName}
										</label>
									)
								})}
						</div>
						<button
							type="submit"
							disabled={isSubmitting}
							onClick={() => validateField("langPref")}
						>
							Submit
						</button>
						{errors.langPref && errors.langPref}
					</Form>
				)}
			</Formik>
		</>
	)
}

export default withUrqlClient(urqlClientOptions)(NewUserSettings)
