import DropDown from "@/components/dropdown/DropDown";
import Link from "next/link";

interface ActionButtonProps {
    id: number,
    info: any,
    editURL: string,
    changeStatus: (e: number) => void
}

export const actionButton = ({ id, info, editURL, changeStatus }: ActionButtonProps) => {
    return (
        <DropDown style={'bg-white'} styleHeader={'bg-white'} className="nav-link">
            <>...</>

            <Link href={`${editURL}${id}`}>
                Editar
            </Link>
            <Link href={"#"} onClick={() => changeStatus(id)}>
                Excluir
            </Link>

        </DropDown>
    )
}