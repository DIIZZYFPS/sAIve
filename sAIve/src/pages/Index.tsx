import { useEffect } from "react"

const Index = () => {
    useEffect(() => {
        document.title = "sAIve - AI Powered Budgeting Application"
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-5xl font-bold">sAIve</h1>
            <p className="text-lg mt-4">AI powered saving</p>
            <p className="text-lg mt-4">Coming soon...</p>
        </div>
    );
}
export default Index