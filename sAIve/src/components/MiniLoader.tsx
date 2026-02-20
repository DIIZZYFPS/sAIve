import { cn } from "@/lib/utils";

interface MiniLoaderProps {
    className?: string;
    size?: number;
}

export const MiniLoader = ({ className, size = 40 }: MiniLoaderProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="15 10 50 45"
            width={size}
            height={size}
            className={cn(className)}
        >
            {/* Triangle track (faint base) */}
            <path d="M40 20 L55 45 L25 45 Z" fill="none" stroke="var(--logo-ring-2)" strokeWidth="1.5" strokeLinejoin="round" opacity="0.25" />

            {/* Data packet flowing around the triangle */}
            <path d="M40 20 L55 45 L25 45 Z" fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinejoin="round"
                strokeDasharray="10 120" strokeDashoffset="130">
                <animate attributeName="stroke-dashoffset" values="130;0" dur="1.5s" begin="0s" repeatCount="indefinite" />
            </path>

            {/* Precision Nodes */}
            <circle cx="40" cy="20" r="3" fill="var(--logo-node-1)">
                <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" begin="0s" repeatCount="indefinite" />
            </circle>
            <circle cx="40" cy="20" r="1.5" fill="var(--background)" />

            <circle cx="55" cy="45" r="3" fill="var(--logo-node-2)">
                <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" begin="0.66s" repeatCount="indefinite" />
            </circle>
            <circle cx="25" cy="45" r="3" fill="var(--logo-node-3)">
                <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" begin="1.33s" repeatCount="indefinite" />
            </circle>

            {/* Center Core - Spinning crosshair */}
            <g transform="translate(40, 36.67)">
                <g>
                    <animateTransform attributeName="transform" type="rotate" values="0 0 0; 90 0 0" dur="1.5s" calcMode="discrete" repeatCount="indefinite" />
                    <path d="M-2 -2 L2 -2 M0 -4 L0 0" fill="none" stroke="var(--logo-core)" strokeWidth="1" />
                </g>
            </g>
        </svg>
    );
};
