'use client'

import Card from "@/components/Card/Card";
import Table from "@/components/Table/Table";
import PageDefault from "@/components/template/default";

import styles from '../../styles/administrative.module.css';
import Modal from "@/components/Modal/Modal";
import { useState } from "react";

export default function Administrative() {
    const [modalLocaleShow, setModalLocaleShow] = useState<boolean>(false);
    const [modalTypeProductShow, setModalTypeProductShow] = useState<boolean>(false);

/*     const changeStatus = (cell: any, row: any) => {
        return (
            <>
                {cell ? "Ativo" : "Inativo"}
            </>
        )
    }

    const convertDate = (cell: any, row: any) => {
        return (
            <>
                {cell.split("-").reverse().join("/")}
            </>
        )
    } */

    let info: any = {
        rows: [
            {
                local: "Studio Raphael Oliveira",
                endereço: "Estr. Caetano Monteiro, 1650, sl 104 - Pendotiba"
            },
            {
                local: "Bike Raphael Oliveira",
                endereço: "Estr. Caetano Monteiro, 1650, sl 104 - Pendotiba"
            },
            {
                local: "Studio Barra da Tijuca",
                endereço: "Av. das Américas, 7700 - Barra da Tijuca"
            }
        ]
    }

    let info2: any = {
        rows: [
            {
                tipo: "Aula Coletiva",
                local: "Studio Raphael Oliveira",
            },
            {
                tipo: "Aula Individual",
                local: "Studio Raphael Oliveira",
            },
            {
                tipo: "Bike Coletiva",
                local: "Bike Raphael Oliveira",
            }
        ]
    }

    const columns = [
        {
            dataField: 'local',
            text: `Local`,
        },
        {
            dataField: 'endereço',
            text: `Endereço`,
        }
    ];

    const columns2 = [
        {
            dataField: 'tipo',
            text: `Tipo`,
        },
        {
            dataField: 'local',
            text: `Local`,
        }
    ];

    function onSubmitLocale() {
        console.log("Cadastrei");
    }

    function onSubmitTypeProduct() {
        console.log("Cadastrei");
    }

    return (
        <PageDefault title={"Administrativo"}>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-6">
                    <Card
                        title="Locais"
                        hasButton={true}
                        setShowModal={setModalLocaleShow}
                    >
                        <Table
                            data={info.rows}
                            columns={columns}
                            class={styles.table_locale_adm}
                        />
                    </Card>
                </div>
                <div className="col-span-6">
                    <Card
                        title="Tipos de Produtos"
                        hasButton={true}
                        setShowModal={setModalTypeProductShow}
                    >
                        <Table
                            data={info2.rows}
                            columns={columns2}
                            class={styles.product_type_adm}
                        />
                    </Card>
                </div>
            </div>

            <Modal 
                title={"Adicionar Local"}
                btnClose={true}
                setShowModal={setModalLocaleShow}
                showModal={modalLocaleShow}
                hasFooter={true}
                onSubmit={onSubmitLocale}
            >
                Hello World
            </Modal>

            <Modal 
                title={"Adicionar Tipo de Produto"}
                btnClose={true}
                setShowModal={setModalTypeProductShow}
                showModal={modalTypeProductShow}
                hasFooter={true}
                onSubmit={onSubmitTypeProduct}
            >
                Hello World
            </Modal>
        </PageDefault>
    )
}