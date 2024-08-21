// Providers
import NotificationsProvider from "@/providers/notifications/notifications"
import ApplicationsProvider from "@/providers/applications/applications"

// Next.js
import { Analytics } from "@vercel/analytics/react"
import type { Metadata } from "next"

// Font
import { Inter } from "next/font/google"

// Style
import "@/styles/globals/globals.scss"

// Inter font
const inter = Inter({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
    display: "swap",
})

// Metadata
export const metadata: Metadata = {
    title: "Job Application Tracker",
    description: "Keep track of your job applications when job hunting",
}

export default function RootLayout({ children }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>

                <ApplicationsProvider>
                    <NotificationsProvider>
                        {children}
                    </NotificationsProvider>
                </ApplicationsProvider>

                <Analytics />
                
            </body>
        </html>
    )
}
