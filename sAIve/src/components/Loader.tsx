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
                <style>{`
                    .coal-outer-shell {
                        transform-origin: 50% 50%;
                        animation: coalDecoupleSpin 3.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
                    }
                    .coal-inner-track {
                        transform-origin: 50% 50%;
                        animation: coalSpinReverse 6s linear infinite;
                    }
                    .coal-node {
                        animation: coalPulse 2s ease-in-out infinite;
                    }
                    .coal-data-flow {
                        stroke-dasharray: 20 150;
                        animation: coalFlow 1.5s linear infinite;
                    }

                    @keyframes coalDecoupleSpin {
                        0% { transform: scale(1) rotate(-110deg); }
                        15% { transform: scale(1.22) rotate(-110deg); }
                        45% { transform: scale(1.22) rotate(130deg); }
                        60% { transform: scale(1) rotate(250deg); }
                        100% { transform: scale(1) rotate(250deg); }
                    }

                    @keyframes coalSpinReverse {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(-360deg); }
                    }

                    @keyframes coalPulse {
                        0%, 100% { opacity: 0.5; }
                        50% { opacity: 1; }
                    }

                    @keyframes coalFlow {
                        from { stroke-dashoffset: 170; }
                        to { stroke-dashoffset: 0; }
                    }
                `}</style>

                {/* Outer Coin Shell - Coalescence mechanical spin */}
                <circle className="coal-outer-shell" cx="50" cy="50" r="34" fill="none" stroke="var(--logo-ring-1)" strokeWidth="4" strokeDasharray="56 15.209" strokeLinecap="round" />

                {/* Subtle Inner tech track */}
                <circle className="coal-inner-track" cx="50" cy="50" r="28" fill="none" stroke="var(--logo-ring-2)" strokeWidth="1" strokeDasharray="2 6" opacity="0.4" />

                {/* Triangle Geometry - Faint static base */}
                <path d="M 50 25 L 71.65 62.5 L 28.35 62.5 Z" fill="none" stroke="var(--logo-node-2)" strokeWidth="1.5" strokeLinejoin="round" opacity="0.2" />

                {/* Data Flow around the triangle */}
                <path className="coal-data-flow" d="M 50 25 L 71.65 62.5 L 28.35 62.5 Z" fill="none" stroke="var(--foreground)" strokeWidth="2" strokeLinejoin="round" />

                {/* Precision Nodes */}
                <circle cx="50" cy="25" r="4.5" fill="var(--logo-node-1)" className="coal-node" style={{ animationDelay: "0s" }} />
                <circle cx="50" cy="25" r="2.5" fill="var(--background)" />

                <circle cx="71.65" cy="62.5" r="4.5" fill="var(--logo-node-2)" className="coal-node" style={{ animationDelay: "0.3s" }} />
                <circle cx="28.35" cy="62.5" r="4.5" fill="var(--logo-node-3)" className="coal-node" style={{ animationDelay: "0.6s" }} />

                {/* Center Core - Spinning crosshair */}
                <g transform="translate(50, 50)">
                    <g>
                        <animateTransform attributeName="transform" type="rotate" values="0 0 0; 90 0 0" dur="1.5s" calcMode="discrete" repeatCount="indefinite" />
                        <path d="M-2 -2 L2 -2 M0 -4 L0 0" fill="none" stroke="var(--logo-core)" strokeWidth="1" />
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
