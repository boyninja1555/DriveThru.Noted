import "./globals.css"
import type { Metadata } from "next"

export function metadata(): Metadata {
	return {
		title: "DriveThru.Noted",
		description: "A complex food-note-taking app for large fast-food restaurant orders.",
		manifest: "/site.webmanifest",
	}
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body>
				<div id="wrapper" className="flex flex-col p-[1rem] max-w-full min-h-screen">
					{children}
				</div>
			</body>
		</html>
	)
}
