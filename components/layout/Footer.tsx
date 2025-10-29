import { useTranslation } from "@/hooks/useTranslation";
import { Heart } from "lucide-react";

export function Footer() {
    const t = useTranslation();
    return (
        <footer className="py-6 md:px-8 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    <span className="inline-flex items-center">
                        {t.footer.madeWith} <Heart className="mx-1 h-4 w-4 fill-red-500 text-red-500" /> {t.footer.by}
                    </span>
                </p>
            </div>
        </footer>
    )
}
