import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
    heroImage,
    heroTitle,
    heroHighlight,
    heroSubtitle,
    reverse = false,
    children,
}: {
    heroImage: string;
    heroTitle: string;
    heroHighlight: string;
    heroSubtitle: string;
    reverse?: boolean;
    children: React.ReactNode;
}) {
    const heroSide = (
        <div className="relative hidden md:block h-full w-full">
            <Image src={heroImage} alt="Kalakosh heritage" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-primary-950/40 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12 text-white">
                <span className="text-sm font-semibold uppercase tracking-wider text-secondary-400">Kalakosh Heritage</span>
                <h1 className="mt-2 text-4xl font-serif font-semibold leading-tight">
                    {heroTitle} <span className="text-secondary-300 italic block mt-1">{heroHighlight}</span>
                </h1>
                <p className="mt-4 text-base text-stone-200/90 max-w-md">{heroSubtitle}</p>
            </div>
        </div>
    );

    const formSide = (
        <div className="flex items-center justify-center bg-[#FBF3E7] px-6 py-12 md:px-12 h-full overflow-y-auto">
            <div className="w-full max-w-md space-y-8">{children}</div>
        </div>
    );

    return (
        <section className="grid h-screen w-screen grid-cols-1 md:grid-cols-2 overflow-hidden bg-[#FBF3E7]">
            {reverse ? (
                <>
                    {heroSide}
                    {formSide}
                </>
            ) : (
                <>
                    {formSide}
                    {heroSide}
                </>
            )}
        </section>
    );
}

export function AuthFooterLink({
    prompt,
    linkText,
    href,
}: {
    prompt: string;
    linkText: string;
    href: string;
}) {
    return (
        <p className="mt-6 text-center text-sm text-brown-400">
            {prompt}{" "}
            <Link href={href} className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">
                {linkText}
            </Link>
        </p>
    );
}