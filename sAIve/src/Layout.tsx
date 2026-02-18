
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';

export default function Layout() {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-auto">
                <Outlet />
            </div>
        </div>
    );
}
