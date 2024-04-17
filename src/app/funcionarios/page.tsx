import Card from "@/components/Card/Card";
import PageDefault from "@/components/template/default";

export default function Employees() {
    return (
        <PageDefault title={"Professores"}>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12">
                    <Card>
                        Hello World
                    </Card>
                </div>
                <div className="col-span-12">
                    <Card title="Lista de Professores">
                        Hello World
                    </Card>
                </div>
            </div>
        </PageDefault>
    )
}