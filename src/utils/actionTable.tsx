import DropDown from "@/components/dropdown/DropDown";
import Link from "next/link";

interface ActionButtonProps {
    id: number,
    editURL: string,
    changeStatus: (e: number) => void
}

export const actionButton = ({ id, editURL, changeStatus }: ActionButtonProps) => {
    return (
        <DropDown style={'bg-white'}>
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