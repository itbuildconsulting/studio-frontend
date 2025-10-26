'use client'

import Card from "@/components/Card/Card";
import AuthInput from "@/components/auth/AuthInput";
import AuthSelect from "@/components/auth/AuthSelect";
import SingleCalendar from "@/components/date/SingleCalendar";
import PageDefault from "@/components/template/default";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import ClassCollection from "../../../../../../core/Class";
import DropDownsCollection from "../../../../../../core/DropDowns";
import Modal from "@/components/Modal/Modal";
import Loading from "@/components/loading/Loading";

import DropdownType from "../../../../../model/Dropdown";
import AuthSelectMulti from "@/components/auth/AuthSelectMulti";
import useConvertDate from "@/data/hooks/useConvertDate";
import { convertDate } from "@/utils/formatterText";
import { EventBtn } from "@/types/btn";
import { BikeAvalible, BikeBusy } from "@/components/icons";
import BikeView from "@/components/BikeView/BikeView";
import { convertArray, convertArrayType } from "@/utils/convertArray";
import { ValidationForm } from "@/components/formValidation/validation";
import ValidationFields from "@/validators/fields";

import listTimes from '../../../../../json/time.json';

export default function AddClass() {
    const edit: boolean = true;
    const repo = useMemo(() => new ClassCollection(), []);

    const repoDrop = useMemo(() => new DropDownsCollection(), []);

    const searchParams = useParams()
    const router = useRouter();

    const formatterDate = useConvertDate;

    const [date, setDate] = useState<string | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const [typeProduct, setTypeProduct] = useState<string | null>(null);
    const [product, setProduct] = useState<string | null>(null);
    const [teacher, setTeacher] = useState<string | null>(null);
    const [limit, setLimit] = useState<number>(0);
    const [qtdStudents, setQtdStudents] = useState<string | null>(null);
    const [canCommission, setCanCommission] = useState<boolean | null>(null);
    const [students, setStudents] = useState<string[] | null>(null);
    const [commissionRules, setCommissionRules] = useState<string | null>(null);
    const [commissionValue, setCommissionValue] = useState<number | null>(0);
    const [bikes, setBikes] = useState<string[]>([]);

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
    const [modalMessage, setModalMessage] = useState<any>(null);
    const [loading, setLoading] = useState<any>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        repoDrop.dropdown('productTypes/dropdown').then(setDropdownType);
        repoDrop.dropdown('persons/employee/dropdown').then(setDropdownEmployee);
        repoDrop.dropdown('persons/student/dropdown').then(setDropdownStudent);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setTeacher(String(dropdownEmployee[0]?.id));
    }, [dropdownEmployee]);

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
                setProduct(result.productId);
                setTeacher(result.teacherId);;
                setQtdStudents(result.limit)
                setCanCommission(result.hasCommission);
                setStudents(result.weight);
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

    const onUpdateBikes = (updatedBikes: any[]) => {
        setBikes(updatedBikes);
    };

    const onSubmit = () => {
        const validationError = ValidationFields({ "Data": date, "Hora": time, "Professor": String(teacher), "Tipo de Produto": String(typeProduct) });

        if (validationError) {
            setErrorMessage(validationError);
            setLoading(false);
            setTimeout(() => setErrorMessage(null), 2500);
            return;
        }

        repo?.edit(+searchParams?.slug, convertDate(date), time, teacher, limit, canCommission, commissionValue, commissionRules, typeProduct, bikes, true).then((result: any) => {
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
                setModalMessage("Edição realizada com sucesso!");
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

    const eventButton: EventBtn[] = [
        {
            name: "Cancelar",
            function: clear,
            class: "btn-outline-primary"
        },
        {
            name: "Editar",
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                }

                <h5 className="text-gray-700">{modalMessage}</h5>

                <button className="btn-outline-primary px-5 mt-5" onClick={() => handleClosed()}>
                    Fechar
                </button>

            </div>
        )
    };

    const handleRemoveStudent = (classId: number, studentId: number) => {
        repo?.remove(classId, studentId).then((result: any) => {
            if (result instanceof Error) {
                const message: any = JSON.parse(result.message);
                setModalSuccess(true)
                setModalMessage(message.message);
                setErrorMessage(message.message);
                setLoading(false);
                setLog(1);
                setTimeout(() => {
                    setErrorMessage(null);
                }, 2500);
            } else {
                setModalSuccess(true);
                setLoading(false);
                setModalMessage("Aluno removido com sucesso!");
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

    const handleCheckin = (classId: number, studentId: number) => {
        repo?.checkin(classId, studentId).then((result: any) => {
            if (result instanceof Error) {
                const message: any = JSON.parse(result.message);
                setModalSuccess(true)
                setModalMessage(message?.message);
                setErrorMessage(message?.message);
                setLoading(false);
                setLog(1);
                setTimeout(() => {
                    setErrorMessage(null);
                }, 2500);
            } else {
                setLoading(false);
                setModalMessage("Check-in efetuado com sucesso!");
                setLog(0);
                setModalSuccess(true);
            }
        }).catch((error) => {
            setModalSuccess(true)
            setErrorMessage(error.message);
            setLog(1);
            setLoading(false);
        });
    }

    return (
        <PageDefault title={"Editar Aula"}>
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
                                            date={formatterDate(date)}
                                            setValue={setDate}
                                        />
                                    </div>
                                    <div className="col-span-12 sm:col-span-6">
                                        <AuthSelect
                                            label="Horário"
                                            value={time}
                                            options={ listTimes?.time }
                                            changeValue={setTime}
                                            edit={edit}
                                            required
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
                                            options={[{ label: '12', value: 12 }]}
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
                                                options={convertArray(dropdownEmployee)}
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
                                    {/*<div className="col-span-12 sm:col-span-6">
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
                                    </div>*/}
                                    <div className="hidden xl:flex xl:grid-rows-4"></div>
                                    <div className="hidden xl:flex xl:grid-rows-4"></div>
                                </div>
                                {
                                    Boolean(canCommission) === true &&
                                    <>
                                        <hr className="mt-3 mb-5 pb-3" style={{ borderColor: "#F4F5F6" }} />
                                        <div className="grid grid-cols-12 gap-x-8">
                                            <div className="col-span-12 sm:col-span-6">
                                                <AuthSelect
                                                    label="Regra de Comissão"
                                                    value={commissionRules}
                                                    options={convertArray(dropdownCommission)}
                                                    changeValue={setCommissionRules}
                                                    edit={edit}
                                                    required
                                                />
                                            </div>
                                            <div className="col-span-12 sm:col-span-6">
                                                <AuthInput
                                                    label="Valor da Comissão"
                                                    value={commissionValue}
                                                    type='text'
                                                    changeValue={setCommissionValue}
                                                    edit={edit}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </>
                                }                            
                                <ValidationForm errorMessage={errorMessage} />
                            </div>
                            <div className="col-span-5 flex items-center justify-center" style={{ borderLeft: "1px solid #999999" }}>
                                {/*<div className="flex flex-col items-center ">
                                    <div className="flex flex-row"> 
                                        <div>
                                            {BikeBusy()}
                                            Professor                                       
                                        </div>
                                    </div>

                                    <div className="flex flex-row"> 
                                        <div>
                                            {BikeAvalible()}
                                            1                                      
                                        </div>
                                        <div>
                                            {BikeAvalible()}
                                            2                                     
                                        </div>
                                        <div>
                                            {BikeAvalible()}
                                            3                                     
                                        </div>
                                    </div>

                                    <div className="flex flex-row"> 
                                        <div>
                                            {BikeAvalible()}
                                            4                                     
                                        </div>
                                        <div>
                                            {BikeAvalible()}
                                            5                                    
                                        </div>
                                        <div>
                                            {BikeAvalible()}
                                            6                                    
                                        </div>
                                        <div>
                                            {BikeAvalible()}
                                            7                                    
                                        </div>
                                    </div>

                                    <div className="flex flex-row"> 
                                        <div>
                                            {BikeAvalible()}
                                            8                                     
                                        </div>
                                        <div>
                                            {BikeAvalible()}
                                            9                                    
                                        </div>
                                        <div>
                                            {BikeAvalible()}
                                            10                                   
                                        </div>
                                    </div>

                                    <div className="flex flex-row"> 
                                        <div>
                                            {BikeAvalible()}
                                            11                                    
                                        </div>
                                        <div>
                                            {BikeAvalible()}
                                            12                                   
                                        </div>
                                    </div>

                                </div>*/}
                                <BikeView bikes={bikes} totalBikes={12} onUpdateBikes={onUpdateBikes} handleRemoveStudent={handleRemoveStudent} handleCheckin={handleCheckin} />
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