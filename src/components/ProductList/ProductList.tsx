
import React, { useState } from 'react';
import useWindowSize from '@/data/hooks/useWindowSize';
import styles from '../../styles/credit.module.css';
import { Pagination } from '../pagination/pagination';
import { PaginationModel } from '@/types/pagination';
import { useRouter } from 'next/navigation';  // Importando o hook useRouter

interface ProductListProps {
    data: any,
    columns: any,
    class?: any,
    rowClasses?: any,
    loading?: boolean,
    setPage?: (page: number) => void,
    infoPage?: PaginationModel
}



type Product = {
    id: number;
    name: string;
    credit: number;
    validateDate: number;
    value: string;
    active: number;
    productTypeId: number;
    createdAt: string;
    updatedAt: string;
    placeId: number | null;
    productType: {
        name: string;
        place: {
            name: string;
        };
    };
};

export default function Table(props: ProductListProps) {
    const [selectedProducts, setSelectedProducts] = useState<any>([]);
    const router = useRouter();  // Usando o useRouter para navegação

    // Função que será chamada ao clicar em "Selecionar"
    const handleSelect = (product: Product) => {
        const productData = [{ productId: product.id, quantity: 1, name: product.name, value: product.value }];
        
        // Salva os dados no LocalStorage
        localStorage.setItem('selectedProduct', JSON.stringify(productData));

        // Atualiza o estado local com a seleção
        setSelectedProducts(productData);

        // Confirmação no console
        console.log(`Produto selecionado: ${productData}, Quantidade: 1`);

        // Redireciona para a página de checkout
        router.push('/checkout');  // Redireciona para a página de checkout

    };
    
    return (
        <>
            {
                props?.data?.length > 0 && props.loading === false ?
                    <>
                        <div className={`${styles.product_card}`}>
                            {
                                props.data.map((item: Product, index: any) => {
                                    return (
                                        <div key={index}>
                                            <div className={`${styles.product_item}`}>
                                                <span className={`${styles.item_name}`}>{item.name}</span>
                                                <span className={`${styles.item_name} ${styles.item_credit}`}>{item.credit.toString().padStart(2, "0")}</span>
                                                <span className={`${styles.item_simple_text}`}>Créditos</span>
                                                <div className="grid grid-cols-2 mt-2">
                                                    <div className="flex flex-col">
                                                        <span className={`${styles.item_simple_text} text-left`}>Validade</span>
                                                        <span className={`${styles.item_name} text-left`}>{item.validateDate} dias</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className={`${styles.item_simple_text} text-left`}>Valor</span>
                                                        <span className={`${styles.item_name} text-left`}>{Number(item.value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-center">
                                                    <button className={`${styles.item_btn}`} onClick={() => handleSelect(item)}>Selecionar</button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </>
                    :
                    props.loading === true
                        ?
                        <div className='flex gap-4'>
                            <div className='animated-background' style={{ width: '211px', height: "247px", borderRadius: "16px" }}></div>
                            <div className='animated-background' style={{ width: '211px', height: "247px", borderRadius: "16px" }}></div>
                            <div className='animated-background' style={{ width: '211px', height: "247px", borderRadius: "16px" }}></div>
                            <div className='animated-background' style={{ width: '211px', height: "247px", borderRadius: "16px" }}></div>
                            <div className='animated-background' style={{ width: '211px', height: "247px", borderRadius: "16px" }}></div>
                        </div>
                        :
                        <div className="flex justify-center items-center" style={{ height: "73px" }}>
                            Não foram encontrados items há serem listados
                        </div>
            }

        </>
    );
}
