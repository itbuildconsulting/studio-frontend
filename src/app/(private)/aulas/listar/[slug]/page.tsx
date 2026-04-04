'use client'

import Card from "@/components/Card/Card";
import PageDefault from "@/components/template/default";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ClassCollection from "../../../../../../core/Class";
import DropDownsCollection from "../../../../../../core/DropDowns";
import Modal from "@/components/Modal/Modal";
import Loading from "@/components/loading/Loading";
import DropdownType from "../../../../../model/Dropdown";
import useConvertDate from "@/data/hooks/useConvertDate";
import { convertDate, convertDateDayMonthYear } from "@/utils/formatterText";
import { EventBtn } from "@/types/btn";
import ValidationFields from "@/validators/fields";
import BikeView from "@/components/BikeView/BikeView";
import { CalendarDays, Clock, Tag, User, Bike, Users } from "lucide-react";
import WaitingListCollection from "../../../../../../core/WaitingList";

export default function ListClass() {
    const repo = useMemo(() => new ClassCollection(), []);
    const repoDrop = useMemo(() => new DropDownsCollection(), []);
    const repoWaitingList = useMemo(() => new WaitingListCollection(), []);
    const searchParams = useParams();
    const router = useRouter();
    const formatterDate = useConvertDate;

    const [date, setDate] = useState<string | null>(null);
    const [time, setTime] = useState<string | null>(null);
    const [typeProduct, setTypeProduct] = useState<string | null>(null);
    const [teacher, setTeacher] = useState<string | null>(null);
    const [canCommission, setCanCommission] = useState<boolean | null>(null);
    const [commissionRules, setCommissionRules] = useState<string | null>(null);
    const [commissionValue, setCommissionValue] = useState<number | null>(0);
    const [bikes, setBikes] = useState<any[]>([]);
    const [waitlist, setWaitlist] = useState<any[]>([]);

    const [dropdownType, setDropdownType] = useState<DropdownType[]>([]);
    const [dropdownEmployee, setDropdownEmployee] = useState<DropdownType[]>([]);

    const [modalSuccess, setModalSuccess] = useState<any>(false);
    const [log, setLog] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<any>(null);
    const [loading, setLoading] = useState<any>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [viewMode, setViewMode] = useState<'table' | 'bikeview'>('table');
    

    useEffect(() => {
        repoDrop.dropdown('productTypes/dropdown').then(setDropdownType);
        repoDrop.dropdown('persons/employee/dropdown').then(setDropdownEmployee);
        
    }, []);

    useEffect(() => {
        setTeacher(String(dropdownEmployee[0]?.id));
    }, [dropdownEmployee]);

    const back = () => {
        router.push("/aulas");
    };

    const handleClosed = () => {
        if (log === 0) {
            back();
        } else {
            setModalSuccess(false);
        }
    };

    useEffect(() => {
        if (!searchParams?.slug) return;

        repo?.details(+searchParams?.slug).then((result: any) => {
            if (result instanceof Error) {
                const message: any = JSON.parse(result.message);
                setErrorMessage(message.error);
                setLoading(false);
                return;
            }

            setDate(result.date);
            setTime(result.time);
            setTypeProduct(result.productTypeId);
            setTeacher(result.teacherId);
            setCanCommission(result.canCommission);
            setCommissionRules(result.commissionRules);
            setCommissionValue(result.commissionValue);

            const bikesData = result.bikes || [];
            setBikes(Array.isArray(bikesData) ? bikesData : []);

            if (!searchParams?.slug) return;
            repoWaitingList.listByClass(+searchParams?.slug).then((wlResult: any) => {
                if (wlResult?.data) {
                    setWaitlist(wlResult.data);
                }
            });

            setLoading(false);
        });
    }, [searchParams?.slug, repo]);

    if (loading) {
        return <Loading />;
    }

    return (
        <PageDefault title="Detalhes da Aula">
            <div className="grid grid-cols-12 gap-6">

                {/* Card de informações da aula */}
                <div className="col-span-6 flex flex-col gap-6">
                    <Card>
                        <div>
                            {/* Badges de resumo */}
                            <div className="flex gap-3 mb-5">
                                <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-600 text-xs font-medium px-3 py-1 rounded-full">
                                    <Bike className="w-3.5 h-3.5" />
                                    {bikes.filter((b: any) => b.status === 'in_use').length}/12 bikes
                                </span>
                                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
                                    <Users className="w-3.5 h-3.5" />
                                    {waitlist.length} na fila
                                </span>
                            </div>

                            {/* Campos */}
                            <div className="grid grid-cols-2 gap-5">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                        <CalendarDays className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-gray-400 uppercase tracking-wider">Data</span>
                                        <p className="text-sm font-semibold text-gray-800">{convertDateDayMonthYear(date || '')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-gray-400 uppercase tracking-wider">Horário</span>
                                        <p className="text-sm font-semibold text-gray-800">{time}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                        <Tag className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-gray-400 uppercase tracking-wider">Tipo de Produto</span>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {dropdownType.find(t => String(t.id) === String(typeProduct))?.name || '-'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                        <User className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <div>
                                        <span className="text-[11px] text-gray-400 uppercase tracking-wider">Professor</span>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {dropdownEmployee.find(e => String(e.id) === String(teacher))?.name || '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                     {/* Card de fila de espera */}
                    <Card>
                        <div>
                            <div className="flex items-center gap-2 mb-4" >
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-gray-500" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-800">Fila de Espera</h3>
                                <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                                    {waitlist.length}
                                </span>
                            </div>

                            {waitlist.length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-4">Nenhum aluno na fila</p>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {waitlist.map((person: any) => (
                                        <div
                                            key={person.id}
                                            className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-3 hover:bg-gray-200 transition-colors"
                                        >
                                            <span className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 text-xs font-bold flex items-center justify-center shrink-0">
                                                {person.order}º
                                            </span>
                                            <span className="text-sm font-medium text-gray-800 flex-1">
                                                {person.studentName || '-'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Coluna direita */}
                <div className="col-span-6 flex flex-col ">

                    {/* Card de bikes */}
                    <Card>
                        <div>
                            {/* Header com título e toggle */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-semibold text-gray-800">
                                    {viewMode === 'table' ? 'Lista de Bikes' : 'Layout das Bikes'}
                                </h3>
                                <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1" style={{maxWidth: '88px', backgroundColor: '#f4f2f1'}}>
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`p-1.5 rounded-md transition-colors ${
                                            viewMode === 'table' ? 'bg-white text-gray-700' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    >
                                        <Users className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('bikeview')}
                                        className={`p-1.5 rounded-md transition-colors ${
                                            viewMode === 'bikeview' ? 'bg-white text-gray-700' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                    >
                                        <Bike className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Visualização condicional */}
                            {viewMode === 'table' ? (
                                <div className="flex flex-col gap-3">
                                    {bikes
                                        .filter((b: any) => b.status === 'in_use')
                                        .map((bike: any) => (
                                            <div
                                                key={bike.bikeNumber}
                                                className="flex items-center gap-6 bg-gray-100 rounded-lg px-4 py-3"
                                            >
                                                <div>
                                                    <span className="text-[10px] text-gray-400">Bike</span>
                                                    <p className="text-lg font-bold text-gray-800">{bike.bikeNumber}</p>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-gray-400">Status</span>
                                                    <p className="text-sm font-medium text-gray-700">Em uso</p>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-gray-400">Aluno</span>
                                                    <p className="text-sm font-medium text-gray-700">{bike.studentName || '-'}</p>
                                                </div>
                                            </div>
                                        ))}
                                    {bikes.filter((b: any) => b.status === 'in_use').length === 0 && (
                                        <p className="text-sm text-gray-400 text-center py-4">Nenhuma bike em uso</p>
                                    )}
                                </div>
                            ) : (
                                <BikeView
                                    bikes={bikes}
                                    totalBikes={13}
                                    onUpdateBikes={(updatedBikes: any) => setBikes(updatedBikes)}
                                    handleRemoveStudent={(classId: number, studentId: number) => {
                                        console.log('Remove student:', classId, studentId);
                                    }}
                                    handleCheckin={(classId: number, studentId: number) => {
                                        console.log('Checkin:', classId, studentId);
                                    }}
                                    handleAddStudent={(classId: number, studentId: number) => {
                                        console.log('Add student:', classId, studentId);
                                    }}
                                />
                            )}
                        </div>
                    </Card>

                   

                    {/* Botão Voltar */}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={back}
                            className="px-6 py-2 bg-gray-500 text-white hover:bg-gray-600 transition-colors text-sm rounded-full"
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Sucesso/Erro */}
            {modalSuccess && (
                <Modal
                    title={log === 0 ? "Sucesso!" : "Erro"}
                    showModal={modalSuccess}
                    setShowModal={setModalSuccess}
                    btnClose={true}
                >
                    <div className="flex flex-col items-center justify-center p-6">
                        {log === 0 ? (
                            <svg className="mt-4 pb-2" width="135" height="135" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="var(--primary)">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        ) : (
                            <svg className="mt-4 pb-2" width="135" height="135" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="var(--primary)">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        )}
                        <h5 className="text-gray-700 mt-4">{successMessage || errorMessage}</h5>
                        <button
                            className="btn-outline-primary px-5 mt-5"
                            onClick={handleClosed}
                        >
                            Fechar
                        </button>
                    </div>
                </Modal>
            )}
        </PageDefault>
    );
}