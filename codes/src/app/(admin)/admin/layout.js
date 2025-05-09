import "../../../styles/globals.css"
import AdminSidebar from "@/components/admin/sidebar"

export const metadata = {
    title: 'Charity Admin',
    description: 'Developed By IUX IT Pty Ltd',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <div className="grid xl:grid-cols-5 lg:grid-cols-2">
                    <div className="col-span-1">
                        <AdminSidebar />
                    </div>
                    <div className="xl:col-span-4 col-span-1 ps-0">
                        {children}
                    </div>
                </div>
            </body>
        </html>
    )
}
