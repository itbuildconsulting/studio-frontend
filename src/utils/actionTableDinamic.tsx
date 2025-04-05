import DropDown from "@/components/dropdown/DropDown";
import Link from "next/link";

interface ActionButtonProps {
    id: any;
    links: { 
        href: string;  // URL do link
        label: string;  // Texto do link
        onClick?: (id: any) => void;  // Função opcional de click
    }[];
}

export const ActionButtonDinamic = ({ id, links }: ActionButtonProps) => {
    return (
        <DropDown style={'bg-white'}>
             <>...</>
             
            {links.map((link, index) => (
                <div key={index}>
                    {/* Verifica se há onClick, caso contrário usa o href */}
                    {link.onClick ? (
                        <a href={link.href} onClick={() => link.onClick?.(id)}>{link.label}</a>
                    ) : (
                        <Link href={link.href}>{link.label}</Link>
                    )}
                </div>
            ))}
        </DropDown>
    );
};
