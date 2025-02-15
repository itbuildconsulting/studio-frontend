'use client'

import Card from "@/components/Card/Card";
import ProductList from "@/components/ProductList/ProductList";
import AuthInput from "@/components/auth/AuthInput";
import PageDefault from "@/components/template/default";
import { useEffect, useMemo, useState } from "react";

import styles from '../../styles/financial.module.css';

import ProductCollecion from "../../../core/Product";

export default function Credit() {
    
    const repo = useMemo(() => new ProductCollecion(), []);

    const [productType, setProductType] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [productList, setProductList] = useState<string[]>([]);

    const statusColors: any = {
        processing: '#FFA500', // Laranja
        authorized: '#87CEEB', // Azul claro
        paid: '#4CAF50', // Verde
        refunded: '#FF0000', // Vermelho
        waiting_payment: '#FFC107', // Amarelo
        pending_refund: '#FF4500', // Vermelho alaranjado
        refused: '#8B0000', // Vermelho escuro
        chargeback: '#8A2BE2', // Roxo
        analyzing: '#FFD700', // Dourado
        pending_review: '#F08080', // Vermelho claro
      };

    const convertValue = (cell: number) => {
        const newValue = cell / 100;
        return newValue.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
        //return cell;
    }

    const convertDate = (cell: string) => {
        return cell.split("-").reverse().join("/");
    }

    const convertStatus = (cell: number) => {        
        return (
            <div
              style={{
                backgroundColor: statusColors[cell] || '#D3D3D3', // Cor padrão cinza, se o cell não for reconhecido
                color: '#fff',
                padding: '5px 10px',
                borderRadius: '5px',
                textAlign: 'center',
                display: 'inline-block',
                maxWidth: '150px',
                fontSize: '14px'
              }}
            >
              {cell}
            </div>
        );
    }


    const listProducts = () => {
        setLoading(true);
        repo.list(1).then((result: any) => {
            if (result instanceof Error) {
                setLoading(false);
            } else {
                setProductList(result.data);
                setLoading(false);
            }
        }).catch((error: any) => {
            setLoading(false);
        });
    }

    useEffect(() => {
        listProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns = [
        {
            dataField: 'customerName',
            text: `Nome`
        },
        {
            dataField: 'transactionId',
            text: `Id da Transação`
        },
        {
            dataField: 'createdAt',
            text: `Data`,
        },
        {
            dataField: 'amount',
            text: `Valor`,
            formatter: convertValue
        },
        {
            dataField: 'status',
            text: `Status`,
            formatter: convertStatus
        }
    ];

    const clear = () => {
        console.log("Limpei")
    }

    const onSubmit = () => {
        listProducts()
    }


    const eventButton = [
        {
            name: "Limpar",
            function: clear,
            class: "btn-outline-primary"
        },
        {
            name: "Pesquisar",
            function: onSubmit,
            class: "btn-primary"
        },
    ];

    return (
        <PageDefault title={"Vender Créditos"}>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12">
                    <Card
                        hasFooter={true}
                        eventsButton={eventButton}
                    >
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-12 md:col-span-3">
                                <AuthInput
                                    label="Tipo de Produto"
                                    value={productType}
                                    type='text'
                                    changeValue={setProductType}
                                    required
                                />
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-span-12">
                    <Card
                        title="Produtos"
                    >
                        <ProductList
                            data={productList}
                            columns={columns}
                            class={styles.table_students}
                            loading={loading}
                        />
                    </Card>
                </div>
            </div>
        </PageDefault >
    )
}