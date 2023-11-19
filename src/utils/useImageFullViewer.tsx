import Image from "next/image"
import React, { ReactNode, useContext, useState } from "react"
import LoadingSpinner from "../components/LoadingSpinner"

const ImageFullViewContext = React.createContext<any>(null)

export const ImageFullViewProvider = ({ children }: { children: ReactNode }) => {
	const [imageFullViewToggle, setImageFullViewToggle] = useState<boolean>(false)
	const [imageFullViewImage, setImageFullViewImage] = useState<{ src: string }>()

	return (
		<ImageFullViewContext.Provider
			value={{
				imageFullViewToggle,
				setImageFullViewToggle,
				imageFullViewImage,
				setImageFullViewImage,
			}}
		>
			<ImageFullViewModal />
			{children}
		</ImageFullViewContext.Provider>
	)
}

const ImageFullViewModal = () => {
	const {
		imageFullViewToggle,
		setImageFullViewToggle,
		imageFullViewImage,
	}: {
		imageFullViewToggle: boolean
		setImageFullViewToggle: React.Dispatch<React.SetStateAction<boolean>>
		imageFullViewImage: { src: string }
	} = useContext(ImageFullViewContext)
	return (
		<div
			className="fixed flex h-screen w-screen cursor-pointer flex-row items-center justify-center bg-foreground bg-opacity-50"
			style={{ visibility: imageFullViewToggle ? "visible" : "hidden", zIndex: 200 }}
			onClick={(e) => {
				e.preventDefault()
				e.stopPropagation()
				e.nativeEvent.stopImmediatePropagation()
				setImageFullViewToggle(false)
			}}
		>
			{imageFullViewImage ? (
				<div className="relative" style={{ height: "80%", width: "80%" }}>
					<Image
						src={imageFullViewImage.src}
						fill={true}
						alt={""}
						className="cursor-default"
						style={{ objectFit: "contain" }}
						onClick={(e) => {
							e.preventDefault()
							e.stopPropagation()
							e.nativeEvent.stopImmediatePropagation()
							setImageFullViewToggle(false)
						}}
					/>
					{/* <div className="absolute top-0 left-0 h-full w-full bg-black opacity-50" /> */}
				</div>
			) : (
				<LoadingSpinner />
			)}
			<div
				className="absolute flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[rgba(255,255,255,0)] transition-colors duration-200"
				style={{ top: "36px", right: "36px", height: "36px", width: "36px" }}
				onMouseEnter={(e) => {
					e.currentTarget.style.backgroundColor = "rgb(255,255,255,0.05)"
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.backgroundColor = "rgb(255,255,255,0)"
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-6 fill-background drop-shadow-lg"
					viewBox="0 0 384 512"
				>
					<path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
				</svg>
			</div>
		</div>
	)
}

export const useImageFullViewer = () => {
	const {
		setImageFullViewImage,
		setImageFullViewToggle,
	}: {
		setImageFullViewImage: React.Dispatch<
			React.SetStateAction<
				| {
						src: string
				  }
				| undefined
			>
		>
		setImageFullViewToggle: React.Dispatch<React.SetStateAction<boolean>>
	} = useContext(ImageFullViewContext)
	return {
		onImageFullView: (src: string) => {
			setImageFullViewImage({ src })
			setImageFullViewToggle(true)
		},
	}
}
