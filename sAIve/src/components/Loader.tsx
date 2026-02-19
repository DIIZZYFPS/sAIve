import { cn } from "@/lib/utils";

interface LoaderProps {
    className?: string;
    size?: number;
    processing?: boolean;
}

export const Loader = ({ className, size = 100, processing = true }: LoaderProps) => {
    return (
        <div className={cn("flex flex-col items-center justify-center", className)}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                width={size}
                height={size}
            >
                <g transform="translate(10, 10)">

                    {/* Ultra-thin static tracks */}
                    <path d="M 40 5 A 35 35 0 0 1 73 50" fill="none" stroke="var(--logo-ring-1)" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
                    <path d="M 27 72 A 35 35 0 0 1 5 40" fill="none" stroke="var(--logo-ring-2)" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />

                    <path id="triangleTrack" d="M40 20 L55 45 L25 45 Z" fill="none" stroke="var(--logo-node-2)" strokeWidth="1.5" strokeLinejoin="round" opacity="0.2" />

                    {/* Pulsing Outer Arcs (Slower, alternating) */}
                    <path d="M 40 5 A 35 35 0 0 1 73 50" fill="none" stroke="var(--logo-ring-1)" strokeWidth="1.5" strokeLinecap="round" opacity="0.1">
                        <animate attributeName="opacity" values="0.1;0.8;0.1" dur="4s" begin="0s" repeatCount="indefinite" />
                    </path>
                    <path d="M 27 72 A 35 35 0 0 1 5 40" fill="none" stroke="var(--logo-ring-2)" strokeWidth="1.5" strokeLinecap="round" opacity="0.1">
                        <animate attributeName="opacity" values="0.1;0.8;0.1" dur="4s" begin="2s" repeatCount="indefinite" />
                    </path>

                    {/* Data packet flowing around the inner triangle */}
                    <path d="M40 20 L55 45 L25 45 Z" fill="none" stroke="var(--background)" strokeWidth="2" strokeLinejoin="round"
                        strokeDasharray="10 120" strokeDashoffset="130">
                        <animate attributeName="stroke-dashoffset" values="130;0" dur="1.5s" begin="0s" repeatCount="indefinite" />
                    </path>
                    <path d="M40 20 L55 45 L25 45 Z" fill="none" stroke="var(--foreground)" strokeWidth="1" strokeLinejoin="round"
                        strokeDasharray="10 120" strokeDashoffset="130" opacity="0.5">
                        <animate attributeName="stroke-dashoffset" values="130;0" dur="1.5s" begin="0s" repeatCount="indefinite" />
                    </path>

                    {/* Precision "nodes" - Pulsing subtly */}
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

                    {/* Center AI "Core" - Spinning crosshair indicator */}
                    <g transform="translate(40, 36.67)">
                        <g>
                            <animateTransform attributeName="transform" type="rotate" values="0 0 0; 90 0 0" dur="1.5s" calcMode="discrete" repeatCount="indefinite" />
                            <path d="M-2 -2 L2 -2 M0 -4 L0 0" fill="none" stroke="var(--logo-core)" strokeWidth="1" />
                        </g>
                    </g>

                </g>
            </svg>
            {processing && (
                <p className="mt-4 text-sm font-medium tracking-widest text-muted-foreground animate-pulse">
                    PROCESSING...
                </p>
            )}
        </div>
    );
};
