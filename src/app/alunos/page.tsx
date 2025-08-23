'use client'

import Card from "@/components/Card/Card";
import PageDefault from "@/components/template/default";

import styles from '../../styles/students.module.css';
import Table from "@/components/Table/Table";
import { useEffect, useMemo, useState } from "react";
import AuthInput from "@/components/auth/AuthInput";
import DropDown from "@/components/dropdown/DropDown";
import Link from "next/link";

import PersonsCollecion from "../../../core/Persons";
import Loading from "@/components/loading/Loading";
import Modal from "@/components/Modal/Modal";
import { EventBtn } from "@/types/btn";
import { convertUpdateAt } from "@/utils/formatterText";
import { PaginationModel } from "@/types/pagination";
import pageDefault from "@/utils/pageDetault";

export default function Students() {
    const repo = useMemo(() => new PersonsCollecion(), []);

    const [name, setName] = useState<string>("");
    const [document, setDocument] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const [modalSuccess, setModalSuccess] = useState<any>(false);
    const [log, setLog] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<any>(null);
    const [loading, setLoading] = useState<any>(false);
    const [errorMessage, setErrorMessage] = useState<any>(null);

    const [listPersons, setListPersons] = useState<string[]>([]);

    const [page, setPage] = useState<number>(1);
    const [infoPage, setInfoPage] = useState<PaginationModel>( pageDefault );

    const convertPhone = (cell: any, row: any) => {
        let phoneNumber = cell.replace(/\D/g, '');
        let formattedNumber = '(' + phoneNumber.substring(0, 2) + ') ' + phoneNumber.substring(2, 7) + '-' + phoneNumber.substring(7);

        return formattedNumber;
    }

    const convertDate = (cell: any, row: any) => {
        return convertUpdateAt(cell);
    }

    const convertStatus = (cell: any, row: any) => {
        return cell === 1 ? "Ativo" : "Inativo";
    }

    const actionButtonProduct = (cell: any, row: any) => {
        return (
            <DropDown style={'bg-white'}>
                <>...</>

                <Link href={`/alunos/editar/${cell}`}>
                    Editar
                </Link>
                <Link href={'#'} onClick={() => deletePersons(cell)}>
                    Excluir
                </Link>

            </DropDown>
        )
    }

    const columns = [
        {
            dataField: 'name',
            text: `Nome`,
        },
        {
            dataField: 'email',
            text: `Email`,
        },
        {
            dataField: 'phone',
            text: `Telefone`,
            formatter: convertPhone
        },
        {
            dataField: 'updatedAt',
            text: `Último Check-in`,
            formatter: convertDate
        },
        {
            dataField: 'active',
            text: `Status`,
            formatter: convertStatus
        },
        {
            dataField: 'id',
            formatter: actionButtonProduct
        }
    ];

    const clear = () => {
        listGeneralStudent("", "", "", 1);
    }

    const onSubmit = () => {
        listGeneralStudent(name, email, document, 1);
    }

    const eventButton: EventBtn[] = [
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

    const handleClosed = () => {
        setModalSuccess(false);
    }

    const LoadingStatus = () => {
        return (
            <div className="flex flex-col items-center gap-4">
                <Loading />
                <h5>Carregando...</h5>
                <div style={{ height: "56px" }}></div>
            </div>
        )
    }

    const SuccessStatus = () => {
        return (
            <div className="flex flex-col items-center gap-4">

                {log === 0 ?
                    <svg className="mt-4 pb-2" width="135" height="135" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={"var(--primary)"}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    :
                    <svg className="mt-4 pb-2" width="135" height="135" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={"var(--primary)"}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                }

                <h5 className="text-gray-700">{log === 0 ? successMessage : errorMessage}</h5>

                <button className="btn-outline-primary px-5 mt-5" onClick={() => handleClosed()}>
                    Fechar
                </button>

            </div>
        )
    };

    const listGeneralStudent = (name: string, email: string, document: string, page: number) => {
        setName(name);
        setEmail(email);
        setDocument(document);
        setPage(page);
        setLoading(true);

        repo.listStudent(name, email, document, page).then((result: any) => {
            if (result instanceof Error) {
                setLoading(false);
                setListPersons([]);
                setInfoPage(pageDefault);
            } else {
                setListPersons(result.data);
                setInfoPage(result.pagination);
                setLoading(false);
            }
        }).catch((error: any) => {
            setLoading(false);
            setListPersons([]);
            setInfoPage(pageDefault);
        });
    }

    useEffect(() => {
        listGeneralStudent(name, email, document, page);
    }, [page]);

    const deletePersons = (id: number) => {
        setModalSuccess(true);
        setLoading(true);

        repo.delete(id).then((result: any) => {
            if (result instanceof Error) {
                const message: any = JSON.parse(result.message);
                setErrorMessage(message.error);
                setLoading(false);
                setLog(1);
            } else {
                setSuccessMessage("Item removido com sucesso!");
                setModalSuccess(true);
                setLoading(false);
                setLog(0);
            }
        }).catch((error: any) => {
            setErrorMessage(error.message);
            setLog(1);
            setLoading(false);
        });
    };

    return (
        <PageDefault title={"Alunos"}>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12">
                    <Card
                        hasFooter={true}
                        eventsButton={eventButton}
                    >
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-12 md:col-span-3">
                                <AuthInput
                                    label="Nome"
                                    value={name}
                                    type='text'
                                    changeValue={setName}
                                    required
                                />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <AuthInput
                                    label="CPF"
                                    value={document}
                                    type='text'
                                    changeValue={setDocument}
                                    required
                                />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <AuthInput
                                    label="Email"
                                    value={email}
                                    type='text'
                                    changeValue={setEmail}
                                    required
                                />
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-span-12">
                    <Card
                        title="Lista de Alunos"
                        hasButton={true}
                        url={"/alunos/cadastrar"}
                    >
                        <Table
                            data={listPersons}
                            columns={columns}
                            class={styles.table_students}
                            loading={loading}
                            setPage={setPage}
                            infoPage={infoPage}
                        />
                    </Card>
                </div>
            </div>

            <Modal
                btnClose={false}
                showModal={modalSuccess}
                setShowModal={setModalSuccess}
                hrefClose={'/alunos'}
                isModalStatus={true}
                //edit={edit}
            >
                <div
                    className={`rounded-lg bg-white w-full py-10 px-10 flex flex-col m-auto`}
                >

                    {loading ? <LoadingStatus /> : <SuccessStatus />}

                    <div className="">

                    </div>
                </div>

            </Modal>
        </PageDefault>
    )
}