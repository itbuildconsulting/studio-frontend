'use client'

import Card from "@/components/Card/Card";
import PageDefault from "@/components/template/default";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ClassCollection from "../../../../../core/Class";
import DropDownsCollection from "../../../../../core/DropDowns";
import Modal from "@/components/Modal/Modal";
import Loading from "@/components/loading/Loading";
import DropdownType from "../../../../model/Dropdown";
import useConvertDate from "@/data/hooks/useConvertDate";
import { convertDate } from "@/utils/formatterText";
import { EventBtn } from "@/types/btn";
import ValidationFields from "@/validators/fields";
import Table from "@/components/Table/Table";

export default function ListClass() {
    const repo = useMemo(() => new ClassCollection(), []);

    const repoDrop = useMemo(() => new DropDownsCollection(), []);

    const searchParams = useParams()
    const router = useRouter();

    const formatterDate = useConvertDate;

    const [date, setDate] = useState<string | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const [typeProduct, setTypeProduct] = useState<string | null>(null);
    const [teacher, setTeacher] = useState<string | null>(null);
    const [canCommission, setCanCommission] = useState<boolean | null>(null);
    const [commissionRules, setCommissionRules] = useState<string | null>(null);
    const [commissionValue, setCommissionValue] = useState<number | null>(0);
    const [bikes, setBikes] = useState<string[]>([]);

    const [dropdownType, setDropdownType] = useState<DropdownType[]>([]);
    const [dropdownEmployee, setDropdownEmployee] = useState<DropdownType[]>([]);

    const [modalSuccess, setModalSuccess] = useState<any>(false);
    const [log, setLog] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<any>(null);
    const [loading, setLoading] = useState<any>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        repoDrop.dropdown('productTypes/dropdown').then(setDropdownType);
        repoDrop.dropdown('persons/employee/dropdown').then(setDropdownEmployee);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setTeacher(String(dropdownEmployee[0]?.id));
    }, [dropdownEmployee]);

    const back = () => {
        router.push("/aulas");
    }

    const handleClosed = () => {
        if (log === 0) {
            back();
        } else {
            setModalSuccess(false);
        }
    }

    useEffect(() => {
        repo?.details(+searchParams?.slug).then((result: any) => {
            if (result instanceof Error) {
                const message: any = JSON.parse(result.message);
                setErrorMessage(message.error);
                setLoading(false);
                setLog(1);
                setTimeout(() => {
                    setErrorMessage(null);
                }, 2500);
            } else {
                setBikes(result.bikes)
                setDate(result.date);
                setTime(result.time);
                setTypeProduct(result.productTypeId);
                setTeacher(result.teacherId);;
                setCanCommission(result.hasCommission);
                setCommissionRules(result.kickbackRule);
                setCommissionValue(result.kickback);
            }
        }).catch((error) => {
            setErrorMessage(error.message);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2500);
            setLog(1);
            setLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const eventButton: EventBtn[] = [
        {
            name: "Voltar",
            function: back,
            class: "btn-outline-primary self-start"
        }
    ];

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

    const handleCheckin = (id: number) => {

    }

    const checkin = (cell: number) => {
        return (
            <button className="btn-outline-primary px-5 bg-transparent self-end" onClick={() => handleCheckin(cell)}>
                Check-in
            </button>
        );
    }

    const columns = [
        {
            dataField: 'studentName',
            text: ``
        },
        {
            dataField: 'studentId',
            text: ``,
            formatter: checkin
        }
    ];

    return (
        <PageDefault title={"Aulas"}>
            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <Card
                        hasFooter={true}
                        eventsButton={eventButton}
                    >
                        <h4 style={{ marginBottom: "32px" }}>Aula - {formatterDate(date)} - {time}</h4>

                        <div className="grid grid-cols-12 gap-8">
                            <div className="grid grid-cols-12 gap-8 mb-10 col-span-7">
                                <div className='flex flex-col col-span-4'>
                                    <div className="mb-10">
                                        <small>Tipo de Aula</small>
                                        <p><strong>{dropdownType.filter((elem: any) => { return (elem.id === typeProduct) })[0]?.name}</strong></p>
                                    </div>
                                    <div className="mb-10">
                                        <small>Possui comissão?</small>
                                        <p><strong>{canCommission ? "Sim" : "Não"}</strong></p>
                                    </div>
                                </div>
                                <div className='flex flex-col col-span-4'>
                                    <div className="mb-10">
                                        <small>Local</small>
                                        <p><strong>{dropdownType.filter((elem: any) => { return (elem.id === typeProduct) })[0]?.place.name}</strong></p>
                                    </div>
                                    <div className="mb-10">
                                        <small>Regra da comissão</small>
                                        <p><strong>{canCommission ? commissionRules : '-'}</strong></p>
                                    </div>
                                </div>
                                <div className='flex flex-col col-span-4'>
                                    <div className="mb-10">
                                        <small>Professor</small>
                                        <p><strong>{dropdownEmployee.filter((elem: any) => { return (elem.id === teacher) })[0]?.name}</strong></p>
                                    </div>
                                    <div className="mb-10">
                                        <small>Valor</small>
                                        <p><strong>{canCommission ? commissionValue : '-'}</strong></p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-5">
                                <small>Alunos</small>

                                <div className="overflow-alunos">

                                    <Table
                                        data={bikes}
                                        columns={columns}
                                        //class={styles.table_students}
                                        loading={loading}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <Modal
                btnClose={false}
                showModal={modalSuccess}
                setShowModal={setModalSuccess}
                hrefClose={'/alunos'}
                isModalStatus={true}
            >
                <div
                    className={`rounded-lg bg-white w-full py-10 px-10 flex flex-col m-auto`}
                >

                    {loading ? <LoadingStatus /> : <SuccessStatus />}

                    <div className=""></div>
                </div>

            </Modal>
        </PageDefault>
    )
}