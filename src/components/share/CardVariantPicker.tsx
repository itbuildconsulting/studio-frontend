import { RefObject } from "react";
import { cn } from "@/lib/utils";
import { CardVariant } from "./ShareCardKit";

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1920;
const THUMB_WIDTH = 130;
const SCALE = THUMB_WIDTH / CARD_WIDTH;
const THUMB_HEIGHT = CARD_HEIGHT * SCALE;

type CardVariantPickerProps = {
    selected: CardVariant;
    onSelect: (variant: CardVariant) => void;
    darkRef: RefObject<HTMLDivElement>;
    lightRef: RefObject<HTMLDivElement>;
    renderCard: (variant: CardVariant, ref: RefObject<HTMLDivElement>) => React.ReactNode;
};

export default function CardVariantPicker({ selected, onSelect, darkRef, lightRef, renderCard }: CardVariantPickerProps) {
    const options: { variant: CardVariant; label: string; ref: RefObject<HTMLDivElement>; checker: boolean }[] = [
        { variant: "dark", label: "Opção 1", ref: darkRef, checker: true },
        { variant: "light", label: "Opção 2", ref: lightRef, checker: false },
    ];

    return (
        <div className="flex gap-4">
            {options.map((opt) => (
                <button key={opt.variant} type="button" onClick={() => onSelect(opt.variant)} className="flex flex-col items-center gap-2">
                    <div
                        className={cn(
                            "relative overflow-hidden rounded-lg border-2 transition",
                            selected === opt.variant ? "border-primary ring-2 ring-primary/30" : "border-border"
                        )}
                        style={{
                            width: THUMB_WIDTH,
                            height: THUMB_HEIGHT,
                            backgroundImage: opt.checker ? "repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%)" : undefined,
                            backgroundSize: opt.checker ? "16px 16px" : undefined,
                        }}
                    >
                        <div style={{ width: CARD_WIDTH, height: CARD_HEIGHT, transform: `scale(${SCALE})`, transformOrigin: "top left" }}>
                            {renderCard(opt.variant, opt.ref)}
                        </div>
                    </div>
                    <span className={cn("text-xs font-medium", selected === opt.variant ? "text-primary" : "text-muted-foreground")}>
                        {opt.label}
                    </span>
                </button>
            ))}
        </div>
    );
}
