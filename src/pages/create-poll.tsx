import { Field, FieldArray, Form, Formik } from "formik"
import { withUrqlClient } from "next-urql"
import Image from "next/image"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import Header from "../components/Header"
import LoadingScreen from "../components/LoadingScreen"
import Poll from "../components/Poll"
import { IMAGE, SESSIONSTORAGE_KEY_TOAST_MESSAGE } from "../constants"
import {
	CreatePollInput,
	useCreatePollCheckQuery,
	useCreatePollMutation,
	useGetAllTopicsQuery,
	useGetCurrentUserQuery,
	useGetS3UrLsMutation,
	useGetSimilarPollsQuery,
} from "../generated/graphql"
import { colors } from "../utils/colors"
import { noBrowser } from "../utils/noBrowser"
import { urqlClientOptions } from "../utils/urqlClient"
import { useImageFullViewer } from "../utils/useImageFullViewer"

const CreatePoll: React.FC<{}> = ({}) => {
	const router = useRouter()
	const [{ data: checkData, fetching: checkFetching }] = useCreatePollCheckQuery({
		pause: noBrowser(),
	})

	const { onImageFullView } = useImageFullViewer()

	type ImageInputType = { error?: string; URL?: string; file?: File | null }
	const [pollImageInput, setPollImageInput] = useState<ImageInputType>({})
	const [optionImageInputs, setOptionImageInputs] = useState<ImageInputType[]>([{}, {}])

	const optionTextAreaHeight = useRef(96)

	const [{ data: topicsData, fetching: topicsFetching }] = useGetAllTopicsQuery({})
	const [getSimilarToggle, setGetSimilarToggle] = useState(false)
	const [createPollInput, setCreatePollInput] = useState<null | CreatePollInput>(null)
	const [{ data: similarPollsData, fetching: similarPollsFetching }] = useGetSimilarPollsQuery({
		pause: !getSimilarToggle || !createPollInput || !createPollInput?.text,
		variables: { text: createPollInput?.text as string },
	})
	const [, createPoll] = useCreatePollMutation()
	const [topicOptions, setTopicOptions] = useState<{ id: string }[]>([])
	const [topicInput, setTopicInput] = useState("")
	const [previewToggle, setPreviewToggle] = useState(false)
	const [{ data: userData, fetching: userFetching }] = useGetCurrentUserQuery({
		pause: noBrowser(),
	})

	const [, getS3URL] = useGetS3UrLsMutation()

	const creating = useRef(false)

	useEffect(() => {
		if (
			!similarPollsFetching &&
			similarPollsData &&
			similarPollsData?.getSimilarPolls.length === 0
		)
			setPreviewToggle(true)
	}, [similarPollsFetching, similarPollsData, similarPollsData?.getSimilarPolls])

	useEffect(() => {
		console.log(pollImageInput)
	}, [pollImageInput.URL])

	// if (noBrowser()) return <Loading />
	if (noBrowser() || checkFetching || userFetching) return <LoadingScreen />
	if (!checkData || !userData?.getCurrentUser) return <>error</>

	return (
		<div className="relative">
			<Header />
			{/* <ImageFullView control={imageFullViewControl} /> */}
			<div
				// onClick={() => setTopicOptions([])}
				className="flex h-max w-full flex-col items-center"
			>
				<Formik
					initialValues={{
						text: "",
						options: ["", ""],
						existingTopics: [] as string[],
						newTopics: [] as string[],
						anonymous: false,
					}}
					validate={(values) => {
						window.scroll(0, 0)
						let errors = {} as any
						values.text = values.text.trim()
						if (values.text.length < 3) errors = { ...errors, text: "Question too short" }
						if (values.text === "")
							errors = { ...errors, text: "Please enter your your question" }
						if (values.text.length > 3000) errors = { ...errors, text: "Question too long" }
						if (values.existingTopics.length + values.newTopics.length > 5)
							errors = {
								...errors,
								existingTopics: ["Please don't tag too many topics"],
							}
						if (values.options.length < 2)
							errors = { ...errors, options: ["Please provide at least 2 options"] }
						values.options = values.options.map((e) => e.trim())
						values.options.forEach((e, i) => {
							if (e === "" && !optionImageInputs[i].file)
								// if option blank
								errors = {
									...errors,
									options: ["Please don't leave any options blank"],
								}
						})
						if (
							!errors["options"] &&
							[...new Set(values.options.map((e, i) => e + optionImageInputs[i].file?.name))]
								.length < values.options.length
						)
							errors = { ...errors, options: ["Please avoid duplicate options"] }
						return errors
					}}
					validateOnChange={false}
					validateOnBlur={false}
					onSubmit={(values) => {
						setGetSimilarToggle(true)
						setCreatePollInput({
							...values,
							options: values.options.map((text) => ({ text })),
						})
						window.scroll(0, 0)
					}}
				>
					{({ errors, values, setFieldValue, setFieldError }) => (
						<div className="flex h-max w-[80%] max-w-[640px] flex-col items-center overflow-visible pt-28 pb-48 tracking-wider">
							<Form className="w-full">
								{/* main text */}
								<div className="flex flex-col">
									<div className="flex w-full flex-col border-b-[0.5px] border-foreground border-opacity-30 pb-5 text-sm">
										<div className="text-foreground">Poll Question</div>
										<div className="mt-1 text-negative">{errors.text && errors.text}</div>
									</div>

									{/* poll media */}
									{!pollImageInput.file && (
										<div className="mt-4">
											<div className="flex flex-row items-center">
												<svg
													className="ml-1 h-3 fill-foreground"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 448 512"
												>
													<path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
												</svg>
												{/* <div className="text-sm text-foreground">Add</div> */}
												<div
													className="ml-2 flex cursor-pointer flex-row items-center rounded-lg border-[0.5px] border-dashed border-background px-2 py-0.5"
													onClick={(e) => {
														const e_1 = e.currentTarget.lastElementChild
														const e_2 = e.currentTarget
														if (e_1) e_1.innerHTML = "Selecting..."
														if (e_2) e_2.style.borderColor = colors["secondary"]
														setPollImageInput((prev) => ({ ...prev, error: "" }))
														;(
															e.currentTarget?.firstElementChild as HTMLElement
														)?.click()
														setTimeout(() => {
															if (e_1) e_1.innerHTML = "Image"
															if (e_2) e_2.style.borderColor = colors["background"]
														}, 1500)
													}}
												>
													<input
														type="file"
														className="hidden"
														onChange={(e) => {
															if (!e.currentTarget.files) return
															if (e.currentTarget.files.length === 0) return
															const file = e.currentTarget.files[0]
															if (file.size > 20000000) {
																setPollImageInput((prev) => ({
																	...prev,
																	error: "Image size too large (max 20MB)",
																}))
																return
															}
															if (!file.type.match(/jpeg|png|gif|webp/)) {
																setPollImageInput((prev) => ({
																	...prev,
																	error: "Image must either be JPG, PNG, GIF, or WEBP",
																}))
																return
															}
															setPollImageInput((prev) => ({
																...prev,
																URL: URL.createObjectURL(file),
																file,
															}))
														}}
													/>
													<svg
														className="h-4 fill-foreground"
														xmlns="http://www.w3.org/2000/svg"
														viewBox="0 0 512 512"
													>
														<path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
													</svg>
													<div className="ml-2 text-sm text-foreground">Image</div>
												</div>
											</div>
										</div>
									)}
									{pollImageInput.error && (
										<div className="mt-1 text-sm text-negative">
											{pollImageInput.error}
										</div>
									)}
									{pollImageInput.URL && (
										<div className="mt-4 mb-2 flex w-full flex-row justify-center">
											<div
												className="relative h-64 w-64 cursor-pointer overflow-hidden rounded-2xl sm:h-72 sm:w-72"
												onClick={() => {
													onImageFullView(pollImageInput.URL || "")
												}}
											>
												<Image
													src={pollImageInput.URL}
													fill={true}
													alt={""}
													className="object-cover	"
													// onClick={(e) => {
													// 	setImageFullViewImage({
													// 		src: e.currentTarget.src,
													// 		width: e.currentTarget.naturalWidth,
													// 		height: e.currentTarget.naturalHeight,
													// 	})
													// 	setImageFullViewToggle(true)
													// }}
												/>
											</div>
											<button
												type="button"
												className="flex h-full flex-col items-start pl-3 pt-1"
												onClick={() => {
													setPollImageInput((prev) => ({
														...prev,
														URL: "",
														file: null,
													}))
												}}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 fill-foreground"
													viewBox="0 0 384 512"
												>
													<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
												</svg>
											</button>
										</div>
									)}

									<Field
										as="textarea"
										name="text"
										placeholder="ADD QUESTION"
										className="mt-[18px] resize-none rounded-xl border border-background bg-secondary bg-opacity-[0.075] px-4 pb-5 pt-3 placeholder-secondary outline-none outline-[0.5px] outline-background placeholder:pt-1 placeholder:text-xs focus:bg-opacity-[0.025] focus:outline-secondary"
										rows={3}
										onChange={(e: any) => {
											setFieldError("text", "")
											setFieldValue("text", e.currentTarget.value)
											e.currentTarget.style.height = "auto"
											e.currentTarget.style.height = e.currentTarget.scrollHeight + "px"
										}}
									/>
								</div>

								{/* options */}
								<FieldArray name="options">
									{({ remove, push }) => (
										<div className="relative mt-20 w-full">
											<div className="flex flex-col border-b-[0.5px]  border-foreground border-opacity-30 pb-2 text-sm">
												<div className="flex flex-col sm:flex-row">
													<div className="py-1 text-foreground">
														Options&nbsp;
														{`(${values?.options?.length && values.options.length})`}
													</div>
													<div className="mt-2 flex flex-row items-center sm:ml-6 sm:mt-0">
														<svg
															className="ml-1 h-2.5 fill-foreground"
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 448 512"
														>
															<path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
														</svg>
														{/* <div className="text-sm text-foreground">Add</div> */}
														<div
															className="ml-2 flex cursor-pointer flex-row items-center rounded-lg border-[0.5px] border-dashed border-background px-2 py-1 text-xs"
															onClick={(e) => {
																const e_1 = e.currentTarget.lastElementChild
																const e_2 = e.currentTarget
																if (e_1) e_1.innerHTML = "Selecting..."
																if (e_2) e_2.style.borderColor = colors["secondary"]
																;(
																	e.currentTarget?.firstElementChild as HTMLElement
																)?.click()
																setTimeout(() => {
																	if (e_1) e_1.innerHTML = "Add Multiple Images"
																	if (e_2)
																		e_2.style.borderColor = colors["background"]
																}, 1000)
															}}
														>
															<input
																type="file"
																multiple
																className="hidden"
																onChange={(e) => {
																	if (!e.currentTarget.files) return
																	if (e.currentTarget.files.length === 0) return
																	const files = Array.from(e.currentTarget.files)
																	let po = 0
																	setOptionImageInputs((prev) => [
																		...prev.filter((e, i) => {
																			if (e.file || values.options[i])
																				return true
																			if (
																				prev.slice(i + 1).find((e) => e.file) ||
																				values.options
																					.slice(i + 1)
																					.find((e) => e)
																			)
																				return true
																			po += 1
																			return false
																		}),
																		...files.map((file) => {
																			console.log(po)
																			if (po === 0) push("")
																			else po -= 1
																			if (file.size > 20000000) {
																				return {
																					error: "Image size too large (max 20MB)",
																				}
																			}
																			if (
																				!file.type.match(/jpeg|png|gif|webp/)
																			) {
																				return {
																					error: "Image must either be JPG, PNG, GIF, or WEBP",
																				}
																			}
																			return {
																				URL: URL.createObjectURL(file),
																				file,
																			}
																		}),
																	])
																}}
															/>
															<svg
																className="h-[16px] fill-foreground"
																xmlns="http://www.w3.org/2000/svg"
																viewBox="0 0 576 512"
															>
																<path d="M160 32c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H160zM396 138.7l96 144c4.9 7.4 5.4 16.8 1.2 24.6S480.9 320 472 320H328 280 200c-9.2 0-17.6-5.3-21.6-13.6s-2.9-18.2 2.9-25.4l64-80c4.6-5.7 11.4-9 18.7-9s14.2 3.3 18.7 9l17.3 21.6 56-84C360.5 132 368 128 376 128s15.5 4 20 10.7zM192 128a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120V344c0 75.1 60.9 136 136 136H456c13.3 0 24-10.7 24-24s-10.7-24-24-24H136c-48.6 0-88-39.4-88-88V120z" />
															</svg>
															<div className="ml-2 overflow-visible whitespace-nowrap break-keep text-foreground">
																Add Multiple Images
															</div>
														</div>
													</div>
												</div>
												<div className="mt-1 py-1 text-negative">
													{errors.options && errors.options}
												</div>
											</div>
											<div
												className="w-1 shrink-0"
												style={{
													height:
														optionTextAreaHeight.current +
														80 +
														(optionImageInputs.find((e) => e.file)
															? 139
															: optionImageInputs.find((e) => e.error)
															? 40
															: 0) +
														"px",
												}}
											/>
											<div className="absolute bottom-[8px] left-[calc(-50vw)] flex w-[150vw] flex-row overflow-y-clip overflow-x-scroll">
												<div className="h-1 w-[50vw] shrink-0" />
												<div className="mt-16 flex h-full w-max flex-row">
													{values.options.length > 0 &&
														values.options.map((_, i) => (
															<div className="flex flex-col">
																<div key={i} className="mr-9 flex flex-row">
																	<Field
																		as="textarea"
																		name={`options[${i}]`}
																		placeholder="ADD OPTION"
																		className="w-48 resize-none rounded-xl border border-background bg-secondary bg-opacity-[0.075] px-4 pb-5 pt-3 placeholder-secondary outline-none outline-[0.5px] outline-background placeholder:pt-1 placeholder:text-xs focus:bg-opacity-[0.025] focus:outline-secondary"
																		style={{
																			height:
																				optionTextAreaHeight.current + "px",
																		}}
																		rows={3}
																		onChange={(e: any) => {
																			setFieldError(`options[${i}]`, "")
																			setFieldValue(
																				`options[${i}]`,
																				e.currentTarget.value
																			)
																			if (window.innerWidth < 1048)
																				e.currentTarget.scrollIntoView({
																					behavior: "smooth",
																					block: "nearest",
																					inline: "center",
																				})
																			optionTextAreaHeight.current = Math.max(
																				e.currentTarget.scrollHeight,
																				optionTextAreaHeight.current
																			)
																		}}
																	/>
																	<button
																		type="button"
																		className="flex h-full flex-col items-start pl-2"
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			className="h-4 fill-foreground"
																			viewBox="0 0 384 512"
																			onClick={() => {
																				remove(i)
																				setOptionImageInputs((prev) => {
																					prev.splice(i, 1)
																					return prev
																				})
																				if (values.options.length === 1) {
																					optionTextAreaHeight.current = 64
																					return
																				}
																			}}
																		>
																			<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
																		</svg>
																	</button>
																	<div className="ml-0 h-20 w-[0.5px] self-center bg-background" />
																</div>

																{/* option media */}
																<div className="relative flex flex-col">
																	{(!optionImageInputs[i] ||
																		!optionImageInputs[i].file) && (
																		<div className="mt-4 flex flex-row items-center">
																			<svg
																				className="ml-1 h-3 fill-foreground"
																				xmlns="http://www.w3.org/2000/svg"
																				viewBox="0 0 448 512"
																			>
																				<path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
																			</svg>
																			{/* <div className="text-sm text-foreground">Add</div> */}
																			<div
																				className="ml-2 flex cursor-pointer flex-row items-center rounded-lg border-[0.5px] border-dashed border-background px-2 py-0.5"
																				onClick={(e) => {
																					const e_1 =
																						e.currentTarget.lastElementChild
																					const e_2 = e.currentTarget
																					if (e_1)
																						e_1.innerHTML = "Selecting..."
																					if (e_2)
																						e_2.style.borderColor =
																							colors["secondary"]
																					setOptionImageInputs((prev) =>
																						prev.map((e, i_1) => {
																							if (i_1 !== i) return e
																							return {
																								...e,
																								error: "",
																							}
																						})
																					)
																					;(
																						e.currentTarget
																							?.firstElementChild as HTMLElement
																					)?.click()
																					setTimeout(() => {
																						if (e_1) e_1.innerHTML = "Image"
																						if (e_2)
																							e_2.style.borderColor =
																								colors["background"]
																					}, 1000)
																				}}
																			>
																				<input
																					type="file"
																					className="hidden"
																					onChange={(e) => {
																						if (!e.currentTarget.files) return
																						if (
																							e.currentTarget.files
																								.length === 0
																						)
																							return
																						const file =
																							e.currentTarget.files[0]
																						if (file.size > 20000000) {
																							setOptionImageInputs((prev) =>
																								prev.map((e, i_1) => {
																									if (i_1 !== i) return e
																									return {
																										...e,
																										error: "Image size too large (max 20MB)",
																									}
																								})
																							)
																							return
																						}
																						if (
																							!file.type.match(
																								/jpeg|png|gif|webp/
																							)
																						) {
																							setOptionImageInputs((prev) =>
																								prev.map((e, i_1) => {
																									if (i_1 !== i) return e
																									return {
																										...e,
																										error: "Image must either be JPG, PNG, GIF, or WEBP",
																									}
																								})
																							)
																							return
																						}
																						setOptionImageInputs((prev) =>
																							prev.map((e, i_1) => {
																								if (i_1 !== i) return e
																								return {
																									...e,
																									URL: URL.createObjectURL(
																										file
																									),
																									file,
																								}
																							})
																						)
																					}}
																				/>
																				<svg
																					className="h-4 fill-foreground"
																					xmlns="http://www.w3.org/2000/svg"
																					viewBox="0 0 512 512"
																				>
																					<path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
																				</svg>
																				<div className="ml-2 text-sm text-foreground">
																					Image
																				</div>
																			</div>
																		</div>
																	)}
																	{optionImageInputs[i] &&
																		optionImageInputs[i].error && (
																			<div className="mt-1 w-56 text-sm text-negative">
																				{optionImageInputs[i].error}
																			</div>
																		)}
																	{optionImageInputs[i] &&
																		optionImageInputs[i].URL && (
																			<div className="mt-6 flex w-48 flex-row justify-center">
																				<div
																					className="relative h-[156px] w-[156px] cursor-pointer overflow-hidden rounded-2xl"
																					onClick={() => {
																						onImageFullView(
																							optionImageInputs[i].URL || ""
																						)
																					}}
																				>
																					<Image
																						src={
																							optionImageInputs[i].URL || ""
																						}
																						fill={true}
																						alt={""}
																						className="object-cover	"
																					/>
																				</div>
																				<button
																					type="button"
																					className="flex h-full flex-col items-start pl-2 pt-1"
																					onClick={() => {
																						setOptionImageInputs((prev) =>
																							prev.map((e, i_1) => {
																								if (i_1 !== i) return e
																								return {
																									...e,
																									URL: "",
																									file: null,
																								}
																							})
																						)
																					}}
																				>
																					<svg
																						xmlns="http://www.w3.org/2000/svg"
																						className="h-4 fill-foreground"
																						viewBox="0 0 384 512"
																					>
																						<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
																					</svg>
																				</button>
																			</div>
																		)}
																</div>
															</div>
														))}
													<button
														type="button"
														onClick={(e) => {
															push("")
															setOptionImageInputs((prev) => [...prev, {}])
															if (e.currentTarget.parentElement?.children)
																optionTextAreaHeight.current = Math.max(
																	96,
																	...Array.from(
																		e.currentTarget.parentElement?.children
																	).map(
																		(e) =>
																			e.firstElementChild?.firstElementChild
																				?.scrollHeight || 0
																	)
																)
															const e_1 = e.currentTarget?.previousElementSibling
															console.log(e_1)
															setTimeout(() => {
																console.log(
																	e_1?.nextElementSibling?.firstElementChild
																		?.firstElementChild
																)
																;(
																	e_1?.nextElementSibling?.firstElementChild
																		?.firstElementChild as HTMLElement
																)?.focus?.()
															}, 100)
														}}
													>
														<div className="mb-12 flex flex-row items-center border-b-[0.5px] border-secondary px-1 pb-2.5 text-sm tracking-wider text-foreground">
															<div className="flex flex-col items-center">
																<div className="flex flex-row">
																	Add
																	<svg
																		className="ml-1.5 mt-0.5 h-4 fill-foreground"
																		xmlns="http://www.w3.org/2000/svg"
																		viewBox="0 0 448 512"
																	>
																		<path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
																	</svg>
																</div>
																<div className="mt-1">Option</div>
															</div>
														</div>
													</button>
												</div>
												<div className="h-1 w-[50vw] shrink-0" />
											</div>
										</div>
									)}
								</FieldArray>

								{/* topics */}
								{/* new topic details & rules */}
								<div onClick={(e) => e.stopPropagation()} className="mt-24 w-full ">
									<div className="flex flex-row border-b-[0.5px] border-foreground border-opacity-30 pb-6 text-sm">
										<div className="text-foreground">
											Topics&nbsp;
											{`(${
												values?.existingTopics?.length &&
												values.newTopics?.length &&
												values.existingTopics.length + values.newTopics.length
											}/5)`}
										</div>
										<div className="ml-2 text-negative">
											{errors.existingTopics && errors.existingTopics}
										</div>
									</div>
									<div className="flex h-12 w-full flex-row items-end">
										<input
											id="topic-input"
											autoComplete="off"
											placeholder="Search for Topics..."
											className=" mt-3 w-[136px] border-b border-foreground bg-background pb-1.5 uppercase placeholder-secondary outline-none placeholder:text-xs"
											onChange={(e_1) => {
												const v = e_1.target.value.toUpperCase()
												setTopicInput(v)
												if (v === "") {
													setTopicOptions([])
													return
												}
												console.log(topicsData?.getAllTopics)
												if (topicsData?.getAllTopics)
													setTopicOptions(
														topicsData.getAllTopics.filter(
															(e_2) =>
																e_2.id.includes(v) ||
																e_1.target.value.includes(e_2.id)
														)
													)
											}}
										/>
										<button
											type="button"
											disabled={
												!(
													topicInput &&
													topicInput.length > 1 &&
													topicInput.length <= 20 &&
													!topicsData?.getAllTopics.find(
														(e) => e.id === topicInput.trim()
													) &&
													!values.newTopics.find((e) => e === topicInput.trim())
												) || topicsFetching
											}
											onClick={() => {
												setFieldValue("newTopics", [
													...values.newTopics,
													topicInput.trim(),
												])
												setTopicOptions([])
											}}
											className="ml-4 h-8 w-max rounded-full border border-foreground bg-background px-3 text-[11px] tracking-wider text-foreground sm:h-9 sm:px-4 sm:text-sm "
											style={{
												opacity:
													!(
														topicInput &&
														topicInput.length > 1 &&
														topicInput.length <= 20 &&
														!topicsData?.getAllTopics.find(
															(e) => e.id === topicInput.trim()
														) &&
														!values.newTopics.find((e) => e === topicInput.trim())
													) || topicsFetching
														? "0%"
														: "100%",
											}}
										>
											Create Topic
										</button>
									</div>

									<div className="mt-5 w-screen overflow-x-scroll">
										<div className="mr-12 flex w-max flex-row">
											{topicsData?.getAllTopics &&
												topicsData?.getAllTopics
													.filter((e) => values.existingTopics.includes(e.id))
													.map((e) => (
														<div className="flex shrink-0 flex-row items-center">
															<Field
																type="checkbox"
																name="existingTopics"
																value={e.id}
																className="hidden"
															/>
															<label
																key={e.id}
																className="mr-4 flex h-9 cursor-pointer flex-row items-center rounded-full bg-foreground px-4 py-1.5 text-xs text-background"
															>
																<div className="">{e.id}</div>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	className="ml-2.5 h-3 fill-background"
																	viewBox="0 0 384 512"
																	onClick={() => {
																		setFieldValue(
																			"existingTopics",
																			values.existingTopics.filter(
																				(e_1) => e_1 !== e.id
																			)
																		)
																	}}
																>
																	<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
																</svg>
															</label>
														</div>
													))}
											{values.newTopics.map((e) => (
												<div className="flex shrink-0 flex-row items-center">
													<Field
														type="checkbox"
														name="newTopics"
														value={e}
														className="hidden"
													/>
													<label
														key={e}
														className="mr-4 flex h-9 cursor-pointer flex-row items-center rounded-full bg-foreground px-4 py-1.5 text-xs text-background"
													>
														<div className="">{e}</div>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="ml-2.5 h-3 fill-background"
															viewBox="0 0 384 512"
															onClick={() => {
																setFieldValue(
																	"newTopics",
																	values.newTopics.filter((e_1) => e_1 !== e)
																)
															}}
														>
															<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
														</svg>
													</label>
												</div>
											))}
											{topicsData?.getAllTopics &&
												topicOptions
													.filter((e) => !values.existingTopics.includes(e.id))
													.map((e, i) => (
														<div className="flex shrink-0 flex-row items-center">
															{i === 0 && (
																<div className="mr-2 text-sm tracking-wider text-secondary">
																	Select:
																</div>
															)}
															<Field
																type="checkbox"
																name="existingTopics"
																value={e.id}
																onClick={() => setTopicOptions([])}
																className="hidden"
															/>
															<label
																key={e.id}
																className="mr-4 flex h-8 cursor-pointer flex-row items-center rounded-full border border-foreground bg-background px-4 py-1.5 text-xs text-foreground"
																onClick={() => {
																	setFieldValue("existingTopics", [
																		...values.existingTopics,
																		e.id,
																	])
																}}
															>
																<div className="">{e.id}</div>
															</label>
														</div>
													))}
										</div>
									</div>
								</div>

								{/* others */}
								<div className="mt-24 flex flex-row items-center text-sm text-foreground">
									Post anonymously&nbsp;
									<Field type="checkbox" name="anonymous" className="ml-1 hidden" />
									<div
										className="mt-1 ml-2 flex h-8 w-16 cursor-pointer flex-row items-center justify-start rounded-full transition"
										style={{
											backgroundColor: values.anonymous
												? colors["foreground"]
												: colors["secondary"],
										}}
										onClick={() => {
											setFieldValue("anonymous", !values.anonymous)
										}}
									>
										<div
											className="m-1 h-[26px] w-[26px] rounded-full bg-background transition"
											style={{
												transform: values.anonymous ? "translateX(30px)" : "",
											}}
										/>
									</div>
								</div>
								<button
									type="submit"
									disabled={getSimilarToggle}
									// onClick={() => validateField("displayLanguage")}
									className="mt-24 rounded-full border border-foreground bg-background py-2 px-5 text-sm text-foreground"
								>
									Preview
								</button>
							</Form>
						</div>
					)}
				</Formik>
			</div>
			{/* TODO numOfChoices, media, sensitive, timed poll */}

			{console.log(similarPollsData)}
			{(similarPollsData || similarPollsFetching) && getSimilarToggle ? (
				<div
					className="absolute top-0 z-50 flex h-max min-h-full w-full cursor-pointer flex-row justify-center bg-foreground bg-opacity-50"
					onClick={() => {
						setGetSimilarToggle(false)
						setPreviewToggle(false)
					}}
				>
					{similarPollsFetching && <>checking</>}
					{similarPollsData && similarPollsData?.getSimilarPolls.length > 0 && (
						<div
							className="my-9 flex h-max w-[90vw] max-w-[720px] cursor-default flex-col overflow-x-hidden rounded-[36px] bg-background"
							onClick={(e) => {
								// e.preventDefault()
								e.stopPropagation()
								// e.nativeEvent.stopImmediatePropagation()
							}}
						>
							<div className="mb-3 flex flex-col border-b-[0.5px] border-foreground border-opacity-30 px-9 pt-8 pb-8 font-semibold tracking-wider text-foreground sm:flex-row sm:items-center">
								<div className="mr-5 mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-xl font-bold text-background sm:mb-0">
									!!
								</div>
								<div className="text-sm sm:text-base">
									There might already be some similar polls:
								</div>
							</div>
							{similarPollsData?.getSimilarPolls.map(
								(e) =>
									e.item && (
										<div className="mx-1 mt-3 sm:mx-4" key={e.id}>
											{/* <Link
												href="/poll/[id]"
												as={`/poll/${e.id}`}
												rel="noopener noreferrer"
												target="_blank"
												passHref
											> */}
											<Poll
												poll={{ ...e.item, options: e.item.topOptions }}
												displayMode={true}
												fullViewMode={true}
												link={"new-tab"}
											/>
											{/* </Link> */}
										</div>
									)
							)}
							<div className="mt-9 mb-5 flex w-full flex-row items-center justify-between self-center">
								<button
									className="ml-5 h-12 w-36 rounded-full bg-foreground px-6 py-3 text-xs tracking-wider text-background sm:text-sm"
									onClick={() => {
										setGetSimilarToggle(false)
										setPreviewToggle(false)
									}}
								>
									Back to Edit
								</button>
								<button
									className=" mr-2 px-5 py-3 text-xs tracking-wider text-foreground sm:mr-4 sm:text-sm"
									onClick={() => {
										setGetSimilarToggle(false)
										setPreviewToggle(true)
										window.scroll(0, 0)
									}}
								>
									Continue to Preview
								</button>
							</div>
						</div>
					)}
				</div>
			) : (
				<></>
			)}

			{/* {getSimilarToggle && <button onClick={() => setPreviewToggle(true)}>preview</button>} */}
			{previewToggle && createPollInput && (
				<div
					className="absolute top-0 z-[60] flex h-max min-h-full w-full cursor-pointer flex-row justify-center bg-foreground bg-opacity-50"
					onClick={() => {
						setGetSimilarToggle(false)
						setPreviewToggle(false)
					}}
				>
					<div
						className="my-9 flex h-max w-[90vw] max-w-[720px] cursor-default flex-col overflow-x-hidden rounded-[36px] bg-background"
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							e.nativeEvent.stopImmediatePropagation()
						}}
					>
						<div className="mb-6 border-b-[0.5px] border-foreground border-opacity-30 px-9 pt-7 pb-7 font-bold tracking-wider text-foreground">
							Preview:
						</div>
						<div className="mx-1 mt-3 sm:mx-4">
							<Poll
								poll={{
									id: "",
									topics: [
										...createPollInput.existingTopics.map((e) => ({ topicId: e })),
										...createPollInput.newTopics.map((e) => ({ topicId: e })),
									],
									text: createPollInput.text,
									createdAt: new Date().getTime(),
									numOfVotes: 0,
									numOfOptions: createPollInput.options.length,
									options: createPollInput.options.map((e, i) => ({
										id: "placeholderId:" + i,
										text: e.text,
										numOfVotes: 0,
										...(optionImageInputs[i].URL && {
											mediaTypeCode: IMAGE,
											mediaURL: optionImageInputs[i].URL,
										}),
									})),
									...(!createPollInput.anonymous && {
										posterId: userData.getCurrentUser.id,
									}),
									...(!createPollInput.anonymous && {
										poster: {
											id: userData.getCurrentUser.id,
											displayName: userData.getCurrentUser.displayName,
										},
									}),
									...(pollImageInput.URL && {
										mediaTypeCode: IMAGE,
										mediaURL: pollImageInput.URL,
									}),
								}}
								displayMode={true}
								fullViewMode={true}
							/>
						</div>
						<div className="mt-9 mb-5 flex w-full flex-row justify-between self-center">
							<button
								className="ml-5 h-12 w-32 rounded-full bg-foreground px-6 py-3 text-xs tracking-wider text-background sm:w-36 sm:text-sm"
								onClick={() => {
									setGetSimilarToggle(false)
									setPreviewToggle(false)
								}}
							>
								Back to Edit
							</button>
							<button
								className="mr-5 flex h-12 w-[120px] items-center justify-center rounded-full border border-foreground px-6 py-3 text-xs tracking-wider text-foreground sm:w-36 sm:text-sm"
								onClick={async (e_1) => {
									creating.current = true
									const e = e_1.currentTarget
									e.disabled = true
									e.style.justifyContent = "start"
									e.style.cursor = "default"
									// e.style.backgroundColor = colors["foreground"]
									e.style.color = colors["foreground"]
									// e.style.fontSize = "14px"
									e.innerHTML = "Creating"
									setTimeout(() => {
										if (creating.current) e.innerHTML = "Creating ."
									}, 500)
									setTimeout(() => {
										if (creating.current) e.innerHTML = "Creating . ."
									}, 1500)
									setTimeout(() => {
										if (creating.current) e.innerHTML = "Creating . . ."
									}, 2000)
									setInterval(() => {
										setTimeout(() => {
											if (creating.current) e.innerHTML = "Creating"
										}, 500)
										setTimeout(() => {
											if (creating.current) e.innerHTML = "Creating ."
										}, 1000)
										setTimeout(() => {
											if (creating.current) e.innerHTML = "Creating . ."
										}, 1500)
										setTimeout(() => {
											if (creating.current) e.innerHTML = "Creating . . ."
										}, 2000)
									}, 2000)
									const numOfFiles = [pollImageInput, ...optionImageInputs].reduce(
										(r, e) => (e.file ? r + 1 : r),
										0
									)
									let s3URL: string[] = [],
										id
									if (numOfFiles > 0) {
										s3URL =
											(await getS3URL({ numOfReq: numOfFiles })).data?.getS3URLs || []
										console.log(s3URL)
										if (s3URL.length !== numOfFiles) {
											// e.style.backgroundColor = "transparent"
											e.style.color = colors["negative"]
											e.style.fontSize = "10px"
											e.innerHTML = "Encountered Unexpected Error, Clcik to Try Again!"
											e.disabled = false
											e.style.cursor = "pointer"
											creating.current = false
											// await deletePoll({ id })
											console.log("s3 signature error")
											return
										}
										// const disttributeURL: (
										// 	URLs: string[],
										// 	inputs: ImageInputType[]
										// ) => ImageInputType[] = (URLs, inputs) => {
										// 	console.log("inputs", inputs)
										// 	if (URLs.length === 1) {
										// 		if (inputs[0].file) {
										// 			return [{ ...inputs[0], URL: URLs[0] }]
										// 		} else
										// 			return [
										// 				{ ...inputs[0], URL: "" },
										// 				...disttributeURL(URLs, inputs.slice(1)),
										// 			]
										// 	} else if (inputs[0].file) {
										// 		return [
										// 			{ ...inputs[0], URL: URLs[0] },
										// 			...disttributeURL(URLs.slice(1), inputs.slice(1)),
										// 		]
										// 	} else
										// 		return [
										// 			{ ...inputs[0], URL: "" },
										// 			...disttributeURL(URLs, inputs.slice(1)),
										// 		]
										// }
										id = await(async (readiedOptionImageInputs) => {
											return (
												await createPoll({
													createPollInput: {
														...createPollInput,
														...(pollImageInput.file &&
															s3URL &&
															s3URL[0] && {
																media: { type: IMAGE, URL: s3URL[0].split("?")[0] },
															}),
														...{
															options: createPollInput.options.map((e, i) => ({
																text: e.text,
																...(readiedOptionImageInputs[i] && {
																	media: {
																		type: IMAGE,
																		URL:
																			readiedOptionImageInputs[i].split(
																				"?"
																			)[0] || "",
																	},
																}),
															})),
														},
													},
												})
											).data?.createPoll?.id
										})(
											((URLs) => {
												let p = 0, r:Record<number,string> = {}
												for (let i = 0; i < optionImageInputs.length; i++){
													r = { ...r, [i]: optionImageInputs[i].file ? URLs[p++]:""}
												}
												return r
											})(s3URL.slice(pollImageInput.file?1:0))
										)
										Promise.all(
											[
												...(pollImageInput.file
													? [
															{ body: pollImageInput.file },
															...optionImageInputs
																.filter((e) => e.file)
																.map((e) => ({ body: e.file })),
													  ]
													: [
															...optionImageInputs
																.filter((e) => e.file)
																.map((e) => ({ body: e.file })),
													  ]),
											].map(async ({ body }, i) => {
												await fetch(s3URL[i], {
													method: "PUT",
													headers: {
														"Content-Type": "multipart/form-data",
													},
													body,
												})
											})
										)
										// upload error state
									} else {
										id = (await createPoll({ createPollInput })).data?.createPoll?.id
									}
									if (!id) {
										// e.style.backgroundColor = "transparent"
										e.style.color = colors["negative"]
										e.style.fontSize = "10px"
										e.innerHTML = "Encountered Unexpected Error, Clcik to Try Again!"
										e.disabled = false
										e.style.cursor = "pointer"
										creating.current = false
										return
									}
									sessionStorage.setItem(SESSIONSTORAGE_KEY_TOAST_MESSAGE, "poll created!")
									console.log("id", id)
									router.push(`/poll/${id}`)
									// new page no interaction bug
								}}
							>
								Create Poll!
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default withUrqlClient(urqlClientOptions)(CreatePoll)
