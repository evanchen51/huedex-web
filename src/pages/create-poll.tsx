import { Field, FieldArray, Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { Option } from "../components/Options"
import { Poll, PollContainer } from "../components/Poll"
import { SESSIONSTORAGE_KEY_TOAST_MESSAGE } from "../constants"
import {
	CreatePollInput,
	useCreatePollMutation,
	useGetAllTopicsQuery,
	useGetCurrentUserQuery,
	useGetSimilarPollsQuery
} from "../generated/graphql"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClientOptions"

const CreatePoll: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: topicsData, fetching: topicsFetching }] = useGetAllTopicsQuery({})
	const [getSimilarToggle, setGetSimilarToggle] = useState(false)
	const [createPollInput, setCreatePollInput] = useState<null | CreatePollInput>(null)
	const [{ data: similarPollsData, fetching: similarPollsFetching }] = useGetSimilarPollsQuery({
		pause: !getSimilarToggle || !createPollInput || !createPollInput?.text,
		variables: { text: createPollInput?.text as string },
	})
	const [, createPoll] = useCreatePollMutation()
	const [topicOptions, setTopicOptions] = useState<{ name: string; id: string }[]>([])
	const [topicInput, setTopicInput] = useState("")
	const [previewToggle, setPreviewToggle] = useState(false)
	const [{ data: userData, fetching: userFetching}] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})

	if(noBrowser()) return <>loading</>
	if(!userFetching && !userData?.getCurrentUser) router.push("/create-poll-check")

	return (
		<>
			<div onClick={() => setTopicOptions([])}>
				<Formik
					initialValues={{
						text: "",
						optionTexts: ["", ""],
						topicIds: [] as string[],
						newTopics: [] as string[],
						anonymous: false,
					}}
					validate={(values) => {
						let errors = {}
						if (values.text === "")
							errors = { ...errors, text: "please enter your your question" }
						if (values.text.length < 3) errors = { ...errors, text: "question too short" }
						if (values.text.length > 3000) errors = { ...errors, text: "question too long" }
						if (values.topicIds.length + values.newTopics.length > 5)
							errors = {
								...errors,
								topicIds: ["too many topics, add more later blah blah blah"],
							}
						if (values.optionTexts.length < 2)
							errors = { ...errors, optionTexts: ["please at least provide 2 options"] }
						values.optionTexts.forEach((e) => {
							if (e === "")
								// TODO except when if you put media
								errors = {
									...errors,
									optionTexts: ["please don't leave any options blank"],
								}
						})
						if ([...new Set(values.optionTexts)].length < values.optionTexts.length)
							errors = { ...errors, optionTexts: ["please avoid duplicate options"] }
						return errors
					}}
					onSubmit={(values) => {
						setGetSimilarToggle(true)
						setCreatePollInput(values)
					}}
				>
					{({ errors, values, validateField, setFieldValue }) => (
						<Form>
							{/* main text */}
							<div>
								question&nbsp;
								<Field as="textarea" name="text" />
							</div>
							{errors.text && errors.text}
							{/* options */}
							<div>
								<FieldArray name="optionTexts">
									{({ remove, push }) => (
										<div>
											{values.optionTexts.length > 0 &&
												values.optionTexts.map((_, i) => (
													<div key={i}>
														<Field as="textarea" name={`optionTexts[${i}]`} />
														<button type="button" onClick={() => remove(i)}>
															X
														</button>
													</div>
												))}
											<button type="button" onClick={() => push("")}>
												add option
											</button>
										</div>
									)}
								</FieldArray>
							</div>
							{errors.optionTexts && errors.optionTexts}
							{/* topics */}
							{/* new topic details & rules */}
							<div onClick={(e) => e.stopPropagation()}>
								topics (max 5)&nbsp;
								{topicsData?.getAllTopics &&
									topicsData?.getAllTopics
										.filter((e) => values.topicIds.includes(e.id))
										.map((e) => (
											<label key={e.name}>
												<Field type="checkbox" name="topicIds" value={e.id} />
												{e.name}
											</label>
										))}
								{values.newTopics.map((e) => (
									<label key={e}>
										<Field type="checkbox" name="newTopics" value={e} />
										{e}
									</label>
								))}
								<input
									id="topic-input"
									onChange={(e_1) => {
										setTopicInput(e_1.target.value)
										if (e_1.target.value === "") {
											setTopicOptions([])
											return
										}
										if (topicsData)
											setTopicOptions(
												topicsData.getAllTopics.filter((e_2) =>
													e_2.name.includes(e_1.target.value)
												)
											)
									}}
								/>
								{topicInput &&
									topicInput.length > 1 &&
									topicInput.length <= 20 &&
									!topicsData?.getAllTopics.find((e) => e.name === topicInput) &&
									!values.newTopics.find((e) => e === topicInput) && (
										<button
											type="button"
											disabled={topicsFetching}
											onClick={() =>
												setFieldValue("newTopics", [...values.newTopics, topicInput])
											}
										>
											create new topic
										</button>
									)}
								{topicsData?.getAllTopics &&
									topicOptions.map((e) => (
										<label key={e.name}>
											<Field
												type="checkbox"
												name="topicIds"
												value={e.id}
												onClick={() => setTopicOptions([])}
											/>
											{e.name}
										</label>
									))}
							</div>
							{errors.topicIds && errors.topicIds}
							{/* others */}
							<div>
								anonymous&nbsp;
								<Field type="checkbox" name="anonymous" />
							</div>
							<button
								type="submit"
								disabled={getSimilarToggle}
								onClick={() => validateField("displayLanguage")}
							>
								Submit
							</button>
						</Form>
					)}
				</Formik>
			</div>
			{/* TODO numOfChoices, media, sensitive, timed poll */}
			{(similarPollsData || similarPollsFetching) && getSimilarToggle ? (
				<div>
					<button
						onClick={() => {
							setGetSimilarToggle(false)
							setPreviewToggle(false)
						}}
					>
						back to edit
					</button>
					{similarPollsFetching && <>checking</>}
					{similarPollsData && similarPollsData?.getSimilarPolls.length > 0 && (
						<>
							similar poll
							{similarPollsData?.getSimilarPolls.map(
								(e) =>
									e.item && (
										<Poll
											key={e.item.id}
											poll={{ ...e.item, options: e.item.topOptions }}
										/>
									)
							)}
						</>
					)}
				</div>
			) : (
				<></>
			)}
			{getSimilarToggle && <button onClick={() => setPreviewToggle(true)}>preview</button>}
			{previewToggle && createPollInput && (
				<>
					<button
						onClick={() => {
							setGetSimilarToggle(false)
							setPreviewToggle(false)
						}}
					>
						back to edit
					</button>
					<PollContainer>
						<>
							by
							{!createPollInput.anonymous ? (
								<>
									{userData && userData.getCurrentUser ? (
										<b>{userData.getCurrentUser.displayName}</b>
									) : (
										<>error</>
									)}
								</>
							) : (
								<>&lt;anonymous&gt;</>
							)}
						</>
						<>{createPollInput.text}</>
						<>
							<>votes:0</>
							<>
								{createPollInput.optionTexts.map((optionText) => (
									<Option key={optionText} state={"unvoted"}>
										{optionText}
										<span>{` 0%`}</span>
									</Option>
								))}
							</>
						</>
						<>
							topics:
							{createPollInput.topicIds.map((topicId) => (
								<div key={topicId}>
									<b>{topicsData?.getAllTopics.find((e) => e.id === topicId)?.name}</b>
								</div>
							))}
							{createPollInput.newTopics.map((newTopic) => (
								<div key={newTopic}>
									<b>{newTopic}</b>
								</div>
							))}
						</>
					</PollContainer>
					<button
						onClick={async (e) => {
							e.currentTarget.disabled = true
							const id = (await createPoll({ createPollInput })).data?.createPoll?.id
							sessionStorage.setItem(SESSIONSTORAGE_KEY_TOAST_MESSAGE, "poll created!")
							router.push(`/poll/${id}`)
						}}
					>
						Submit
					</button>
				</>
			)}
		</>
	)
}

export default withUrqlClient(urqlClientOptions)(CreatePoll)
