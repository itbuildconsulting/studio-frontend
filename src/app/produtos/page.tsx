'use client'

import Card from "@/components/Card/Card";
import Modal from "@/components/Modal/Modal";
import Table from "@/components/Table/Table";
import AuthInput from "@/components/auth/AuthInput";
import PageDefault from "@/components/template/default";
import { useState } from "react";

import styles from '../../styles/products.module.css';
import AuthSelect from "@/components/auth/AuthSelect";

export default function Products() {
    const [modalProductAdd, setModalProductAdd] = useState<boolean>(false);

    const [productName, setProductName] = useState<string>("");
    const [creditValue, setCreditValue] = useState<string>("");
    const [typeProduct, setTypeProduct] = useState<string>("");
    const [localeName, setLocaleName] = useState<string>("");
    const [value, setValue] = useState<string | number>("");
    const [status, setStatus] = useState<boolean>(true);

    const convertValue = (cell: any, row: any) => {
        return cell.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
    }

    const convertStatus = (cell: any, row: any) => {
        return cell ? "Ativo" : "Inativo"
    }

    let info: any = {
        rows: [
            {
                produto: "Aula Studio",
                creditos: "01",
                tipo: "Aula Coletiva",
                local: "Studio Raphael Oliveira",
                valor: 65,
                status: true,
            },
            {
                produto: "Aula Studio",
                creditos: "01",
                tipo: "Aula Coletiva",
                local: "Studio Raphael Oliveira",
                valor: 65,
                status: true,
            },
            {
                produto: "Aula Studio",
                creditos: "01",
                tipo: "Aula Coletiva",
                local: "Studio Raphael Oliveira",
                valor: 65,
                status: false,
            },
            {
                produto: "Aula Studio",
                creditos: "01",
                tipo: "Aula Coletiva",
                local: "Studio Raphael Oliveira",
                valor: 65,
                status: true,
            },
            {
                produto: "Aula Studio",
                creditos: "01",
                tipo: "Aula Coletiva",
                local: "Studio Raphael Oliveira",
                valor: 65,
                status: true,
            },
            {
                produto: "Aula Studio",
                creditos: "01",
                tipo: "Aula Coletiva",
                local: "Studio Raphael Oliveira",
                valor: 65,
                status: false,
            }
        ]
    }

    const columns = [
        {
            dataField: 'produto',
            text: `Produto`,
        },
        {
            dataField: 'creditos',
            text: `Créditos`,
        },
        {
            dataField: 'tipo',
            text: `Tipo`,
        },
        {
            dataField: 'local',
            text: `Local`,
        },
        {
            dataField: 'valor',
            text: `Valor`,
            formatter: convertValue
        },
        {
            dataField: 'status',
            text: `Status`,
            formatter: convertStatus
        }
    ];

    function onSubmitProductAdd() {
        console.log("Cadastrei");
    }

    return (
        <PageDefault title={"Produtos"}>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12">
                    <Card
                        title="Meus Produtos"
                        hasButton={true}
                        setShowModal={setModalProductAdd}
                    >
                        <Table
                            data={info.rows}
                            columns={columns}
                            class={styles.table_locale_adm}
                        />
                    </Card>
                </div>
            </div>

            <Modal
                title={"Adicionar Produto"}
                btnClose={true}
                setShowModal={setModalProductAdd}
                showModal={modalProductAdd}
                hasFooter={true}
                onSubmit={onSubmitProductAdd}
            >
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-6">
                        <AuthInput
                            label="Nome do Produto"
                            value={productName}
                            type='text'
                            changeValue={setProductName}
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthInput
                            label="Créditos"
                            value={creditValue}
                            type='text'
                            changeValue={setCreditValue}
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthInput
                            label="Tipo de Produto"
                            value={typeProduct}
                            type='text'
                            changeValue={setTypeProduct}
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthInput
                            label="Local"
                            value={localeName}
                            type='text'
                            changeValue={setLocaleName}
                            required
                        />
                    </div>
                    <div className="col-span-6">
                        <AuthInput
                            label="Valor"
                            value={value}
                            type='text'
                            changeValue={setValue}
                            required
                        />
                    </div>
                    <div className="col-span-6">
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
            </Modal>
        </PageDefault>
    )
}