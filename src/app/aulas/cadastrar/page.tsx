'use client'

import Card from "@/components/Card/Card";
import AuthInput from "@/components/auth/AuthInput";
import AuthSelect from "@/components/auth/AuthSelect";
import PageDefault from "@/components/template/default";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddClass() {
    const router = useRouter();

    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [typeProduct, setTypeProduct] = useState<string>("");
    const [product, setProduct] = useState<string>("");
    const [teacher, setTeacher] = useState<string>("");
    const [qtdStudents, setQtdStudents] = useState<string>("");
    const [canCommission, setCanCommission] = useState<string>("");
    const [students, setStudents] = useState<string>("");
    const [commissionRules, setCommissionRules] = useState<string>("");
    const [commissionValue, setCommissionValue] = useState<string>("");

    const clear = () => {
        router.push("/aulas");
    }

    const onSubmit = () => {
        console.log("Cadastrei");
    }

    const eventButton = [
        {
            name: "Cancelar",
            function: clear,
            class: "btn-outline-primary"
        },
        {
            name: "Cadastrar",
            function: onSubmit,
            class: "btn-primary"
        },
    ];

    return (
        <PageDefault title={"Cadastrar Aulas"}>
            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <Card
                        hasFooter={true}
                        eventsButton={eventButton}
                    >
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Data"
                                    value={date}
                                    type='text'
                                    changeValue={setDate}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4 xl:grid-rows-4">
                                <AuthInput
                                    label="Hora"
                                    value={time}
                                    type='text'
                                    changeValue={setTime}
                                    required
                                />
                            </div>
                            <div className="hidden xl:flex xl:grid-rows-4"></div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Tipo de Produto"
                                    value={typeProduct}
                                    type='text'
                                    changeValue={setTypeProduct}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Produto"
                                    value={product}
                                    type='text'
                                    changeValue={setProduct}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Professor"
                                    value={teacher}
                                    type='text'
                                    changeValue={setTeacher}
                                    required
                                />
                            </div>
                        </div>
                        <hr className="mt-3 mb-5 pb-3" style={{ borderColor: "#F4F5F6" }} />
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Quantidade de alunos"
                                    value={qtdStudents}
                                    type='text'
                                    changeValue={setQtdStudents}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Possiu comissão?"
                                    value={canCommission}
                                    type='text'
                                    changeValue={setCanCommission}
                                    required
                                />
                            </div>
                            <div className="hidden xl:flex xl:grid-rows-4"></div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Alunos"
                                    value={students}
                                    type='text'
                                    changeValue={setStudents}
                                    required
                                />
                            </div>
                            <div className="hidden xl:flex xl:grid-rows-4"></div>
                            <div className="hidden xl:flex xl:grid-rows-4"></div>
                        </div>
                        <hr className="mt-3 mb-5 pb-3" style={{ borderColor: "#F4F5F6" }} />
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Regra de Comissão"
                                    value={commissionRules}
                                    type='text'
                                    changeValue={setCommissionRules}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Valor da Comissão"
                                    value={commissionValue}
                                    type='text'
                                    changeValue={setCommissionValue}
                                    required
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </PageDefault>
    )
}