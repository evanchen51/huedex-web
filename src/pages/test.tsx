import Image from "next/image"
import { useEffect, useState } from "react"

const Test = () => {
	const [preview, setPreview] = useState<any>()
	const [previewError, setPreviewError] = useState<string>()
	const [data, setData] = useState<string>()
	useEffect(() => {
		console.log(data)
	}, [data])

	return (
		<div className="w-full">
			<div className="w-100 flex h-10 items-center justify-center">
				<div className="p-2 text-foreground">foreground:</div>
				<div className="bg-foreground text-foreground">foreground:</div>
			</div>
			<div className="w-100 flex h-10 items-center justify-center">
				<div className="p-2 text-background">background:</div>
				<div className="bg-background text-background">background:</div>
			</div>
			<div className="w-100 flex h-10 items-center justify-center">
				<div className="p-2 text-secondary">secondary:</div>
				<div className="bg-secondary text-secondary">secondary:</div>
			</div>
			<div className="w-100 flex h-10 items-center justify-center">
				<div className="p-2 text-accent">accent:</div>
				<div className="bg-accent text-accent">accent:</div>
			</div>

			<Image
				src="https://huedex-s3-bucket.s3.us-west-1.amazonaws.com/lm6m55792ewqtxlvfjjm84m9"
				width={100}
				height={100}
				alt=""
			/>

			<div className="relative mt-12 flex h-12 items-center justify-center">
				<input
					type="file"
					className="w-20 opacity-0"
					onChange={(e) => {
						if (!e.currentTarget.files || e.currentTarget.files.length === 0) return
						const file = e.currentTarget.files[0]
						if (!file.type.match(/jpeg|png|gif|webp/)) {
							setPreviewError("Image must either be JPG, PNG, GIF, or WEBP")
							return
						}
						if (file.size > 20000000) {
							setPreviewError("Image size too large (max 20MB)")
							return
						}
						setPreviewError("")
						setPreview(file)
					}}
				/>
				<div
					className="absolute flex h-12 w-32 cursor-pointer items-center justify-center rounded-full border border-foreground bg-background text-foreground"
					onClick={(e) => {
						;(e.currentTarget?.previousElementSibling as HTMLElement).click()
					}}
				>
					Select File
				</div>
			</div>
			{preview && (
				<div>
					<div className="relative h-24 w-24">
						<Image
							src={URL.createObjectURL(preview)}
							fill={true}
							alt={""}
							className="object-cover	"
						/>
					</div>
					<div className="">
						{preview.name}
						{console.log(preview)}
					</div>
				</div>
			)}
			{previewError && <div>{previewError}</div>}
			<button
				onClick={async () => {
					await fetch(
						"https://huedex-s3-bucket.s3.us-west-1.amazonaws.com/kgqvejx61v9p8a74c6xabcwy?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAZUJZFFUBCKDBNMLU%2F20230919%2Fus-west-1%2Fs3%2Faws4_request&X-Amz-Date=20230919T230710Z&X-Amz-Expires=600&X-Amz-Signature=c710e70cac61ccf06934e42139f30e577c850be99b4fc932b0e781d6c8c67d0a&X-Amz-SignedHeaders=host",
						{
							method: "PUT",
							headers: {
								"Content-Type": "multipart/form-data",
							},
							body: preview,
						}
					).then((res) => {
						setData(res.url)
					})
				}}
			>
				upload
			</button>

			{data && (
				<div className="relative h-24 w-24">
					<Image src={data} fill={true} alt={""} className="object-cover	" />
				</div>
			)}
			<div className="relative h-96 w-96">
				<Image
					src={"https://huedex-s3-bucket.s3.us-west-1.amazonaws.com/kgqvejx61v9p8a74c6xabcwy"}
					fill={true}
					alt={""}
					className="object-cover	"
				/>
			</div>
		</div>
	)
}

export default Test
