import Sidebar from "@/components/Sidebar";

const NotFound = () => {
    return (
    <div className="flex h-screen overflow-hidden">
        <Sidebar />
    
    <div className="flex-1 flex items-center justify-center p-4">
        
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
            <a href="/" className="text-primary hover:text-blue-700 underline">
            Return to Home
            </a>
        </div>
    </div>

    </div>
    );
};

export default NotFound;