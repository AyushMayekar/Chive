import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// const LOGO_URL = "/ChiveLogo.png";
const LOGO_URL = "/ChiveLogo.ico";

type LogoProps = {
    href?: string;
    imageClassName?: string;
    textClassName?: string;
    className?: string;
    showText?: boolean;
    /**
     * Layout footprint in px. This is the only thing that affects the height
     * of whatever row/grid the logo sits in (Navbar, Footer, etc). Keep this
     * modest and stable — use `scale` below to make the mark look bigger.
     */
    boxSize?: number;
    /**
     * Purely visual zoom applied to the mark inside its fixed-size box.
     * Does NOT affect layout — safe to tune freely by trial and error.
     * 1 = actual asset size within the box, 1.6-2 usually reads as "bigger logo".
     */
    scale?: number;
};

export function Logo({
    href = "#top",
    imageClassName,
    textClassName,
    className,
    showText = true,
    boxSize = 58,
    scale = 1,
}: LogoProps) {
    return (
        <Link
            href={href}
            className={cn(
                "group flex shrink-0 items-center gap-2 transition-opacity hover:opacity-90",
                className
            )}
        >
            {/* Fixed-size box: this is what Navbar/Footer measure. Never grows. */}
            <span
                className="relative shrink-0 overflow-visible"
                style={{ width: boxSize, height: boxSize }}
            >
                {/* `fill` takes the image out of normal flow (position: absolute),
           so scaling it visually does not push on surrounding elements. */}
                <Image
                    src={LOGO_URL}
                    alt="Chive"
                    fill
                    priority
                    sizes={`${boxSize}px`}
                    className={cn("object-contain", imageClassName)}
                    style={{ transform: `scale(${scale})` }}
                />
            </span>

            {showText && (
                <span
                    className={cn(
                        "font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-extrabold tracking-tight text-paper transition-colors group-hover:text-mint",
                        textClassName
                    )}
                >
                    Chive
                </span>
            )}
        </Link>
    );
}
