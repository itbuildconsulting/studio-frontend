'use client'

import Card from "@/components/Card/Card";
import AuthInput from "@/components/auth/AuthInput";
import AuthSelect from "@/components/auth/AuthSelect";
import PageDefault from "@/components/template/default";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Students() {
    const router = useRouter();

    const [name, setName] = useState<string>("");
    const [document, setDocument] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [validity, setValidity] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [status, setStatus] = useState<boolean>(true);
    const [heigth, setHeigth] = useState<string>("");
    const [weight, setWeight] = useState<string>("");
    const [shoes, setShoes] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPass, setConfirmPass] = useState<string>("");
    const [contract, setContract] = useState<string>("");
    const [frequency, setFrequency] = useState<string>("");
    const [classValue, setClassValue] = useState<string>("");

    const clear = () => {
        router.push("/alunos");
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
        <PageDefault title={"Cadastrar Alunos"}>
            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <Card
                        hasFooter={true}
                        eventsButton={eventButton}
                    >
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-4">
                                <AuthInput
                                    label="Nome"
                                    value={name}
                                    type='text'
                                    changeValue={setName}
                                    required
                                />
                            </div>
                            <div className="col-span-4">
                                <AuthInput
                                    label="CPF"
                                    value={document}
                                    type='text'
                                    changeValue={setDocument}
                                    required
                                />
                            </div>
                            <div className="col-span-4">
                                <AuthInput
                                    label="Email"
                                    value={email}
                                    type='text'
                                    changeValue={setEmail}
                                    required
                                />
                            </div>
                            <div className="col-span-4">
                                <AuthInput
                                    label="Validade"
                                    value={validity}
                                    type='text'
                                    changeValue={setValidity}
                                    required
                                />
                            </div>
                            <div className="col-span-4">
                                <AuthInput
                                    label="Telefone"
                                    value={phone}
                                    type='text'
                                    changeValue={setPhone}
                                    required
                                />
                            </div>
                            <div className="col-span-4">
                                <AuthSelect
                                    label="Status"
                                    options={[
                                        {
                                            value: true,
                                            label: "Ativo"
                                        },
                                        {
                                            value: false,
                                            label: "Inativo"
                                        }
                                    ]}
                                    value={status}
                                    changeValue={setStatus}
                                    required
                                />
                            </div>
                        </div>
                        <hr className="mt-3 mb-5 pb-3" style={{ borderColor: "#F4F5F6" }} />
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-4">
                                <AuthInput
                                    label="Altura"
                                    value={heigth}
                                    type='text'
                                    changeValue={setHeigth}
                                    required
                                />
                            </div>
                            <div className="col-span-4">
                                <AuthInput
                                    label="Peso"
                                    value={weight}
                                    type='text'
                                    changeValue={setWeight}
                                    required
                                />
                            </div>
                            <div className="col-span-4">
                                <AuthInput
                                    label="Sapato"
                                    value={shoes}
                                    type='text'
                                    changeValue={setShoes}
                                    required
                                />
                            </div>
                            <div className="col-span-4">
                                <AuthInput
                                    label="Senha"
                                    value={password}
                                    type='text'
                                    changeValue={setPassword}
                                    required
                                />
                            </div>
                            <div className="col-span-4">
                                <AuthInput
                                    label="Confirmar Senha"
                                    value={confirmPass}
                                    type='text'
                                    changeValue={setConfirmPass}
                                    required
                                />
                            </div>
                        </div>
                        <hr className="mt-3 mb-5 pb-3" style={{ borderColor: "#F4F5F6" }} />
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-4">
                                <AuthInput
                                    label="Contrato"
                                    value={contract}
                                    type='text'
                                    changeValue={setContract}
                                    required
                                />
                            </div>
                            <div className="col-span-4">
                                <AuthInput
                                    label="Frequência"
                                    value={frequency}
                                    type='text'
                                    changeValue={setFrequency}
                                    required
                                />
                            </div>
                            <div className="col-span-4">
                                <AuthInput
                                    label="Aula"
                                    value={classValue}
                                    type='text'
                                    changeValue={setClassValue}
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