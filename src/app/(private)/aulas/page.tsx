'use client'

import Card from "@/components/Card/Card";
import PageDefault from "@/components/template/default";

import styles from '../../../styles/class.module.css';
import Table from "@/components/Table/Table";
import { useEffect, useMemo, useState } from "react";
import ClassCollecion from "../../../../core/Class";
import { actionButton } from "@/utils/actionTable";
import SingleCalendar from "@/components/date/SingleCalendar";
import DropDownsCollection from "../../../../core/DropDowns"; 
import AuthSelect from "@/components/auth/AuthSelect";
import { EventBtn } from "@/types/btn";
import { convertArray, convertArrayType } from "@/utils/convertArray";
import Modal from "@/components/Modal/Modal";
import Loading from "@/components/loading/Loading";

import listTimes from '../../../json/time.json';
import { PaginationModel } from "@/types/pagination";
import pageDefault from "@/utils/pageDetault";
import { ActionButtonDinamic } from "@/utils/actionTableDinamic";

import { useRouter } from "next/navigation";



export default function Class() {
    const router = useRouter();

    const repo = useMemo(() => new ClassCollecion(), []);
    const repoDrop = useMemo(() => new DropDownsCollection(), []);

    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [teacherId, setTeacherId] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [classses, setClasses] = useState<string[]>([]);
    const [page, setPage] = useState<number>(1);
    const [infoPage, setInfoPage] = useState<PaginationModel>(pageDefault);
    const [loading, setLoading] = useState<any>(false);

    const [dropdownType, setDropdownType] = useState<string[]>([]);
    const [dropdownTeacher, setDropdownTeacher] = useState<string[]>([]);

    // Estados do modal
    const [modalConfirm, setModalConfirm] = useState<boolean>(false);
    const [modalSuccess, setModalSuccess] = useState<boolean>(false);
    const [log, setLog] = useState<number>(0); // 0 = sucesso, 1 = erro
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [selectedClassId, setSelectedClassId] = useState<any>(null);
    const [loadingCancel, setLoadingCancel] = useState<boolean>(false);

    const [selectedClassActive, setSelectedClassActive] = useState<boolean>(true);

    const convertDate = (cell: any, row: any) => {
        return cell.split("T")[0].split("-").reverse().join("/");
    }

    const convertStatus = (cell: any) => {
        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '3px 9px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 500,
                backgroundColor: cell ? '#b7e9bb' : '#f5d1d1',
                color: cell ? '#3B6D11' : '#A32D2D',
                justifyContent: "center",
                maxWidth: '100px'
            }}>
                <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: cell ? '#3B6D11' : '#A32D2D',
                    flexShrink: 0,
                }} />
                {cell ? 'Ativo' : 'Inativo'}
            </span>
        );
    }

    const convertStudentCount = (cell: any) => {
        return (
            <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 9px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 500,
                backgroundColor: 'var(--color-background-info)',
                color: 'var(--color-text-info)',
            }}>
                {`👥 ${cell ?? 0}`}
            </span>
        );
    }

    // Abre modal de confirmação antes de cancelar
    const handleDelete = (cell: any) => {
        console.log(cell)
        setSelectedClassActive(cell.active);
        setSelectedClassId(cell.id);
        setModalConfirm(true);
    }

    // Executa o cancelamento após confirmação
    const confirmCancel = () => {
        setModalConfirm(false);
        setLoadingCancel(true);
        setModalSuccess(true);

        repo?.cancel(selectedClassId).then((result: any) => {
            setLoadingCancel(false);
            if (result instanceof Error) {
                const message: any = JSON.parse(result.message);
                setErrorMessage(message?.error || "Erro ao alterar status da aula.");
                setLog(1);
            } else {
                setSuccessMessage(selectedClassActive ? "Aula cancelada com sucesso!" : "Aula reativada com sucesso!"); // ← usa o state
                setLog(0);
                listClass(date, time, teacherId, type, page); // ← refresh atualiza o row.active e o dropdown
            }
        }).catch((error: any) => {
            setLoadingCancel(false);
            setErrorMessage(error?.message || "Erro ao alterar status da aula.");
            setLog(1);
        });
    }

    const handleClosed = () => {
        setModalSuccess(false);
        setErrorMessage(null);
    }

    const handleRowClick = (row: any) => {
        router.push(`/aulas/listar/${row.id}`);
    };

    const handleActionButton = (cell: number, row: any) => {
        return (
            <div onClick={(e) => e.stopPropagation()}>
                <ActionButtonDinamic
                    id={cell}
                    links={[
                        { href: `/aulas/listar/${cell}`, label: 'Listar' },
                        { href: `/aulas/editar/${cell}`, label: 'Editar' },
                        {
                            href: "#", 
                            label: row.active ? 'Cancelar Aula' : 'Reativar Aula',
                            onClick: () => handleDelete(row)
                        }
                    ]}
                />
            </div>
        );
    }

    const listClass = (dateF: string, timeF: string, teacherF: string, typeF: string, page: number) => {
        setDate(dateF);
        setTime(timeF);
        setTeacherId(teacherF);
        setType(typeF);
        setPage(page);
        setLoading(true);

        repo.listClass(dateF, timeF, teacherF, typeF, page).then((result: any) => {
            setLoading(false);

            if (result instanceof Error) {
                setClasses([]);
                setInfoPage(pageDefault);
            } else {
                setClasses(result.data);
                setInfoPage(result.pagination);
            }
        }).catch(() => {
            setLoading(false);
            setClasses([]);
            setInfoPage(pageDefault);
        });
    }

    const columns = [
        {
            dataField: 'date',
            text: 'Data',
            formatter: convertDate
        },
        {
            dataField: 'time',
            text: 'Hora',
        },
        {
            dataField: 'teacher',
            text: 'Professor'
        },
        {
            dataField: 'productType',
            text: 'Tipo de Produto'
        },
        {
            dataField: 'studentCount',  // ← novo
            text: 'Alunos',
            formatter: convertStudentCount
        },
        {
            dataField: 'active',
            text: 'Status',
            formatter: convertStatus  // ← agora com badge colorido
        },
        {
            dataField: 'id',
            formatter: handleActionButton
        }
    ];

    const clear = () => {
        listClass("", "", "", "", 1);
    }

    const onSubmit = () => {
        listClass(date, time, teacherId, type, 1);
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

    useEffect(() => {
        listClass(date, time, teacherId, type, page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        repoDrop.dropdown('persons/employee/dropdown').then(setDropdownTeacher);
        repoDrop.dropdown('productTypes/dropdown').then(setDropdownType);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Componente de loading no modal
    const LoadingStatus = () => (
        <div className="flex flex-col items-center gap-4">
            <Loading />
            <h5>Cancelando aula...</h5>
            <div style={{ height: "56px" }}></div>
        </div>
    );

    // Componente de resultado no modal
    const ResultStatus = () => (
        <div className="flex flex-col items-center gap-4">
            {log === 0 ? (
                <svg className="mt-4 pb-2" width="135" height="135" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={"var(--primary)"}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ) : (
                <svg className="mt-4 pb-2" width="135" height="135" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke={"var(--primary)"}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            )}
            <h5 className="text-gray-700">{log === 0 ? successMessage : errorMessage}</h5>
            <button className="btn-outline-primary px-5 mt-5" onClick={handleClosed}>
                Fechar
            </button>
        </div>
    );

    return (
        <PageDefault title={"Aulas"}>
            <div className="grid grid-cols-12 gap-8">
                <div className="col-span-12">
                    <Card
                        hasFooter={true}
                        eventsButton={eventButton}
                    >
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-12 md:col-span-3">
                                <SingleCalendar
                                    label="Data"
                                    date={date}
                                    setValue={setDate}
                                />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <AuthSelect
                                    label='Hora'
                                    value={time}
                                    options={listTimes?.time}
                                    changeValue={setTime}
                                />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <AuthSelect
                                    label='Tipo de Produto'
                                    value={type}
                                    options={convertArrayType(dropdownType)}
                                    changeValue={setType}
                                    required
                                />
                            </div>
                            <div className="col-span-12 md:col-span-3">
                                <AuthSelect
                                    label='Professor'
                                    value={teacherId}
                                    options={convertArray(dropdownTeacher)}
                                    changeValue={setTeacherId}
                                    required
                                />
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-span-12">
                    <Card
                        title="Lista de Aulas"
                        hasButton={true}
                        url={"/aulas/cadastrar"}
                    >
                        <Table
                            data={classses}
                            columns={columns}
                            class={styles.table_students}
                            loading={loading}
                            setPage={setPage}
                            infoPage={infoPage}
                            onRowClick={handleRowClick} 
                        />
                    </Card>
                </div>
            </div>

            {/* Modal de Confirmação */}
            <Modal
                title={selectedClassActive ? 'Cancelar Aula' : 'Reativar Aula'} // ← dinâmico
                btnClose={true}
                showModal={modalConfirm}
                setShowModal={setModalConfirm}
                hasFooter={true}
                edit={true}
                customButtonText={["Voltar", selectedClassActive ? "Confirmar Cancelamento" : "Confirmar Reativação"]}
                onSubmit={confirmCancel}
                customStyle={{ height: 'auto' }}
            >
                <div className="text-center p-4">
                    <p className="text-gray-700 mb-4">
                        {selectedClassActive
                            ? 'Tem certeza que deseja cancelar esta aula?'
                            : 'Tem certeza que deseja reativar esta aula?'
                        }
                    </p>
                    <p className="text-sm text-gray-500">
                        {selectedClassActive
                            ? 'Todos os alunos inscritos terão seus créditos devolvidos automaticamente.'
                            : 'A aula voltará a ficar disponível para os alunos.'
                        }
                    </p>
                </div>
            </Modal>

            {/* Modal de Resultado (sucesso/erro) */}
            <Modal
                btnClose={false}
                showModal={modalSuccess}
                setShowModal={setModalSuccess}
                isModalStatus={true}
            >
                <div className="rounded-lg bg-white w-full py-10 px-10 flex flex-col m-auto">
                    {loadingCancel ? <LoadingStatus /> : <ResultStatus />}
                </div>
            </Modal>

        </PageDefault>
    )
}