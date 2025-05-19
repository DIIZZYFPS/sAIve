import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";

const Flow = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-auto">
                <DashboardHeader />
                <div className="flex-1 p-6 space-y-6 overflow-auto">
                    <h1 className="text-2xl font-bold">Flow Page</h1>
                </div>
            </div>
        </div>
    );
};
export default Flow;