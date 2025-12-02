export default function Home() {
    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">Welcome to Your Project</h1>
                <p className="text-muted-foreground mb-8">
                    This is a fullstack Next.js + Go/Fiber template with pluggable modules.
                </p>

                <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Backend Status</h2>
                        <p className="text-sm text-muted-foreground">
                            Backend running on:{" "}
                            <code className="bg-muted px-1 py-0.5 rounded">
                                http://localhost:8080
                            </code>
                        </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-2">Next Steps</h2>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>
                                Install modules from{" "}
                                <code className="bg-muted px-1 py-0.5 rounded">
                                    github.com/yourcompany/*-module
                                </code>
                            </li>
                            <li>
                                Register modules in{" "}
                                <code className="bg-muted px-1 py-0.5 rounded">
                                    backend/cmd/server/main.go
                                </code>
                            </li>
                            <li>Start building your application</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
