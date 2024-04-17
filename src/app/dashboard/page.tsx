'use client'

import Card from "@/components/Card/Card"
import PageDefault from "@/components/template/default"

export default function Home() {
    return (
        <PageDefault title={"Bem-vindo, Fulano"}>
            <div className="grid grid-rows-2 grid-cols-12 gap-8">
                <div className="col-span-4">
                    <Card title="Frequência de alunos">
                        Hello World
                    </Card>
                </div>
                <div className="col-span-4">
                    <Card title="Total de Vendas">
                        Hello World
                    </Card>
                </div>
                <div className="row-span-2 col-span-4">
                    <Card title="Calendário de Aulas">
                        Hello World
                    </Card>
                </div>
                <div className="col-span-8">
                    <Card title="Notícias Recentes">
                        Hello World
                    </Card>
                </div>
            </div>
        </PageDefault>
    )
}