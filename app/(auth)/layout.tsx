export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-muted min-h-svh flex justify-center items-center p-6 md:p-10">
            <div className="w-full min-w-sm md:max-w-3xl">
                {children}
            </div>
        </div>
    )
}
