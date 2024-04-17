import Card from "@/components/Card/Card";
import PageDefault from "@/components/template/default";

export default function Products() {
    return (
        <PageDefault title={"Produtos"}>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12">
                    <Card title="Meus Produtos">
                        Hello World
                    </Card>
                </div>
            </div>
        </PageDefault>
    )
}