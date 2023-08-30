const Test = () => {
   return (
		<div>
			<div className="w-100 flex h-10 items-center justify-center">
				<div className="p-2 text-foreground">foreground:</div>
				<div className="text-foreground bg-foreground">foreground:</div>
			</div>
			<div className="w-100 flex h-10 items-center justify-center">
				<div className="p-2 text-background">background:</div>
				<div className="text-background bg-background">background:</div>
			</div>
			<div className="w-100 flex h-10 items-center justify-center">
				<div className="p-2 text-secondary">secondary:</div>
				<div className="text-secondary bg-secondary">secondary:</div>
			</div>
			<div className="w-100 flex h-10 items-center justify-center">
				<div className="p-2 text-accent">accent:</div>
				<div className="text-accent bg-accent">accent:</div>
			</div>
		</div>
	)
}

export default Test