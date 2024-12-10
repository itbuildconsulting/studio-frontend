'use client'

import Card from "@/components/Card/Card";
import AuthInput from "@/components/auth/AuthInput";
import AuthSelect from "@/components/auth/AuthSelect";
import SingleCalendar from "@/components/date/SingleCalendar";
import TimePickerCalendar from "@/components/date/TimePickerCalendar";
import PageDefault from "@/components/template/default";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import ClassCollection from "../../../../core/Class";
import DropDownsCollection from "../../../../core/DropDowns";
import Modal from "@/components/Modal/Modal";
import Loading from "@/components/loading/Loading";

import DropdownType from "../../../model/Dropdown";
import AuthSelectMulti from "@/components/auth/AuthSelectMulti";

export default function AddClass() {
    const repo = useMemo(() => new ClassCollection(), []);

    const repoDrop = useMemo(() => new DropDownsCollection(), []);
    const router = useRouter();

    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [typeProduct, setTypeProduct] = useState<string | null>(null);
    const [product, setProduct] = useState<string>("");
    const [teacher, setTeacher] = useState<string>("");
    const [limit, setLimit] = useState<number>(0);
    const [qtdStudents, setQtdStudents] = useState<string>("");
    const [canCommission, setCanCommission] = useState<string>("true");
    const [students, setStudents] = useState<string[]>([]);
    const [commissionRules, setCommissionRules] = useState<string>("1");
    const [commissionValue, setCommissionValue] = useState<number | null>(null);
    const [edit, setEdit] = useState<boolean>(false);

    const [dropdownType, setDropdownType] = useState<string[]>([]);
    const [dropdownEmployee, setDropdownEmployee] = useState<DropdownType[]>([]);
    const [dropdownStudent, setDropdownStudent] = useState<DropdownType[]>([]);
    const [dropdownProduct, setDropdownProduct] = useState<DropdownType[]>([]);

    const [dropdownCommission] = useState<any>(
        [
            {
                name: 'Não',
                id: 1
            },
            {
                name: 'Turma Cheia',
                id: 2
            },
        ]
    );

    const [modalSuccess, setModalSuccess] = useState<any>(false);
    const [log, setLog] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<any>(null);
    const [loading, setLoading] = useState<any>(false);
    const [errorMessage, setErrorMessage] = useState<any>(null);

    useEffect(() => {
        repoDrop.dropdown('productTypes/dropdown').then(setDropdownType);
        repoDrop.dropdown('persons/employee/dropdown').then(setDropdownEmployee);
        repoDrop.dropdown('persons/student/dropdown').then(setDropdownStudent);

    }, []);

    useEffect(() => {
        repoDrop.dropdown(`products/dropdown/${typeProduct}`).then(setDropdownProduct);
    }, [typeProduct]);

    useEffect(() => {
        setProduct(String(dropdownProduct[0]?.id));
    }, [dropdownProduct])

    useEffect(() => {
        setTeacher(String(dropdownEmployee[0]?.id));
    }, [dropdownEmployee])

    /* useEffect(() => {
        setStudents(String(dropdownStudent[0]?.id));
    }, [dropdownStudent]) */

    const clear = () => {
        router.push("/aulas");
    }

    const handleClosed = () => {
        if (log === 0) {
            clear();
        } else {
            setModalSuccess(false);
        }
    }


    const onSubmit = () => {
        repo?.create(date, time, teacher, limit, JSON.parse(canCommission), commissionValue, commissionRules, product, students, true).then((result: any) => {
            if (result instanceof Error) {
                const message: any = JSON.parse(result.message);
                setErrorMessage(message.error);
                setLoading(false);
                setLog(1);
                setTimeout(() => {
                    setErrorMessage(null);
                }, 2500);
            } else {
                setModalSuccess(true);
                setLoading(false);
                setSuccessMessage("Cadastro realizado com sucesso!");
                setLog(0);
            }
        }).catch((error) => {
            setErrorMessage(error.message);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2500);
            setLog(1);
            setLoading(false);
        });
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
                        <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                }

                <h5 className="text-gray-700">{log === 0 ? successMessage : errorMessage}</h5>

                <button className="btn-outline-primary px-5 mt-5" onClick={() => handleClosed()}>
                    Fechar
                </button>

            </div>
        )
    };

    function convertArrayType(array: any) {
        console.log(array)
        return array.map((item: any) => {
            const { name, id, place, ...rest } = item;
            return { label: `${name} - ${place?.name}`, value: id, ...rest };
        });
    }

    function convertArrayType2(array: any) {
        return array?.map((item: any) => {
            const { name, id, place, ...rest } = item;
            return { label: `${name}`, value: id, ...rest };
        });
    }

    return (
        <PageDefault title={"Cadastrar Aulas"}>
            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <Card
                        hasFooter={true}
                        eventsButton={eventButton}
                    >
                        <div className="grid grid-cols-12 gap-8">
                            <div className="col-span-7">
                                <div className="grid grid-cols-12 gap-x-8">
                                    <div className="col-span-12 sm:col-span-6">
                                        <SingleCalendar
                                            label="Data"
                                            date={date}
                                            setValue={setDate}
                                        />
                                    </div>
                                    <div className="col-span-12 sm:col-span-6">
                                        <TimePickerCalendar
                                            label="Hora"
                                            value={time}
                                            setValue={setTime}
                                        />

                                    </div>
                                    <div className="col-span-12 sm:col-span-6">
                                        <AuthSelect
                                            label='Tipo de Produto'
                                            value={typeProduct}
                                            options={convertArrayType(dropdownType)}
                                            changeValue={setTypeProduct}
                                            edit={edit}
                                            required
                                        />
                                    </div>                                    
                                </div>
                                <hr className="mt-3 mb-5 pb-3" style={{ borderColor: "#F4F5F6" }} />
                                <div className="grid grid-cols-12 gap-x-8">
                                    <div className="col-span-12 sm:col-span-6">

                                        <AuthSelect
                                            label="Quantidade de alunos"
                                            value={qtdStudents}
                                            options={[{ label: '1', value: 1 }, { label: '2', value: 2 }, { label: '3', value: 3 }, { label: '4', value: 4 }, { label: '5', value: 5 }, { label: '6', value: 6 }, { label: '7', value: 7 }, { label: '8', value: 8 }, { label: '9', value: 9 }, { label: '10', value: 10 }]}
                                            changeValue={setQtdStudents}
                                            edit={edit}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-12 sm:col-span-6">
                                        <AuthSelect
                                            label="Possui comissão?"
                                            value={canCommission}
                                            options={[{ label: 'Sim', value: true }, { label: 'Não', value: false }]}
                                            changeValue={setCanCommission}
                                            edit={edit}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-12 sm:col-span-6">
                                        {dropdownEmployee.length > 0
                                            ?
                                            <AuthSelect
                                                label='Professor'
                                                value={teacher}
                                                options={convertArrayType2(dropdownEmployee)}
                                                changeValue={setTeacher}
                                                edit={edit}
                                                required
                                            />
                                            :
                                            <AuthInput
                                                label="Professor"
                                                value={teacher}
                                                type='text'
                                                changeValue={setTeacher}
                                                required
                                            />
                                        }
                                    </div>
                                    <div className="col-span-12 sm:col-span-6">
                                        {dropdownStudent.length > 0
                                            ?
                                            <>
                                                <AuthSelectMulti
                                                    label="Alunos"
                                                    options={convertArrayType2(dropdownStudent)}
                                                    value={students}
                                                    changeValue={setStudents}
                                                />
                                            </>
                                            :
                                            <AuthInput
                                                label="Alunos"
                                                value={students}
                                                type='text'
                                                changeValue={setStudents}
                                                required
                                            />
                                        }
                                    </div>
                                    <div className="hidden xl:flex xl:grid-rows-4"></div>
                                    <div className="hidden xl:flex xl:grid-rows-4"></div>
                                </div>
                                <hr className="mt-3 mb-5 pb-3" style={{ borderColor: "#F4F5F6" }} />
                                <div className="grid grid-cols-12 gap-x-8">
                                    <div className="col-span-12 sm:col-span-6">
                                        <AuthSelect
                                            label="Regra de Comissão"
                                            value={commissionRules}
                                            options={convertArrayType2(dropdownCommission)}
                                            changeValue={setCommissionRules}
                                            edit={edit}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-12 sm:col-span-6">
                                        <AuthInput
                                            label="Valor da Comissão"
                                            value={commissionValue}
                                            type='number'
                                            changeValue={setCommissionValue}
                                            required
                                        />
                                    </div>

                                    {errorMessage === null ? false :
                                        <div className={` 
                                        bg-red-400 text-white py-1 px-2
                                        border border-red-500 rounded-md
                                        flex flex-row items-center col-span-12 w-1/2
                                        `}>
                                            {/* {IconWarning} */}
                                            <span className='ml-2 text-sm'>{errorMessage}</span>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="col-span-5" style={{ borderLeft: "1px solid #999999"}}>

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

                    <div className="">

                    </div>
                </div>

            </Modal>
        </PageDefault>
    )
}