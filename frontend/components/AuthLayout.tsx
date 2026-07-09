import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
    heroImage,
    heroTitle,
    heroHighlight,
    heroSubtitle,
    children,
}: {
    heroImage: string;
    heroTitle: string;
    heroHighlight: string;
    heroSubtitle: string;
    children: React.ReactNode;
}) {
    return (
        <section className="grid min-h-screen grid-cols-1 md:grid-cols-2">
            {/* Form side */}
            <div className="flex items-center justify-center bg-secondary-50 px-6 py-12">
                <div className="w-full max-w-md">{children}</div>
            </div>

            {/* Hero side */}
            <div className="relative hidden md:block">
                <Image src={heroImage} alt="Kalakosh heritage" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-primary-900/50" />
                <div className="absolute bottom-10 left-10 right-10 text-white">
                    <h1 className="text-4xl font-semibold leading-tight">
                        {heroTitle} <span className="text-secondary-400 italic">{heroHighlight}</span>
                    </h1>
                    <p className="mt-4 text-lg text-white/90">{heroSubtitle}</p>
                </div>
            </div>
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
            <Link href={href} className="font-semibold text-primary-500 hover:underline">
                {linkText}
            </Link>
        </p>
    );
}