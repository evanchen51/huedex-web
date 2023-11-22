import React, { ReactNode, useContext, useRef } from "react"

const SidebarScrollerContext = React.createContext<any>(null)

export const SidebarScrollerProvider = ({ children }: { children: ReactNode }) => {
	const sidebarRef = useRef<HTMLDivElement|null>(null)
	return (
		<SidebarScrollerContext.Provider value={{ sidebarRef }}>
			{children}
		</SidebarScrollerContext.Provider>
	)
}

export const useSidebarScroller = () => {
	const { sidebarRef }: { sidebarRef: React.MutableRefObject<HTMLDivElement | null> } =
		useContext(SidebarScrollerContext)
	return {
		sidebarRef,
      sidebarScroller: (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
         if(!sidebarRef.current)return 
			sidebarRef.current.style.top = `-${e.currentTarget.scrollTop}px`
		},
	}
}
