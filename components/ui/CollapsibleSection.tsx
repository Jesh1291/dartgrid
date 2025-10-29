"use client"
import { ChevronDown } from "lucide-react";
import { ReactNode } from "react";

interface CollapsibleSectionProps {
    title: string;
    children: ReactNode;
}

export function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
    return (
        <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-foreground/80 hover:text-foreground">
                <span>{title}</span>
                <ChevronDown size={20} className="transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="mt-4">
                {children}
            </div>
        </details>
    )
}
