import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    size?: number;
}

export const Logo = ({ className, size = 100 }: LogoProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width={size}
            height={size}
            className={cn("text-primary", className)}
        >
            <g transform="translate(10, 10)">
                {/* Outer boundary */}
                <path d="M 40 5 A 35 35 0 0 1 73 50" fill="none" stroke="var(--logo-ring-1)" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 27 72 A 35 35 0 0 1 5 40" fill="none" stroke="var(--logo-ring-2)" strokeWidth="1.5" strokeLinecap="round" />

                {/* Minimalist Triangle connections */}
                <path d="M40 20 L55 45" fill="none" stroke="var(--logo-node-2)" strokeWidth="1.5" />
                <path d="M55 45 L25 45" fill="none" stroke="var(--logo-node-3)" strokeWidth="1.5" />
                <path d="M25 45 L40 20" fill="none" stroke="var(--logo-node-2)" strokeWidth="1.5" />

                {/* Precision "nodes" */}
                {/* Top */}
                <circle cx="40" cy="20" r="3" fill="var(--logo-node-1)" />
                <circle cx="40" cy="20" r="1.5" fill="var(--background)" />

                {/* Bottom Right */}
                <circle cx="55" cy="45" r="3" fill="var(--logo-node-2)" />

                {/* Bottom Left */}
                <circle cx="25" cy="45" r="3" fill="var(--logo-node-3)" />

                {/* Center AI "Core" */}
                <path d="M38 35 L42 35 M40 33 L40 37" fill="none" stroke="var(--logo-core)" strokeWidth="1" />
            </g>
        </svg>
    );
};
