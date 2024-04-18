'use client'

import Card from "@/components/Card/Card";
import PageDefault from "@/components/template/default";

export default function Students() {
    return (
        <PageDefault title={"Alunos"}>
            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <Card>
                        <div>
                            Hello World
                        </div>
                    </Card>
                </div>
            </div>
        </PageDefault>
    )
}