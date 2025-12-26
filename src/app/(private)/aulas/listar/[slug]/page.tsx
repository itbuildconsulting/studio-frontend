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
import Table from "@/components/Table/Table";
import BikeView from "@/components/BikeView/BikeView";

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

    // Estado para controlar qual visualização está ativa
    const [viewMode, setViewMode] = useState<'table' | 'bikeview'>('table');
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);

    useEffect(() => {
        repoDrop.dropdown('productTypes/dropdown').then(setDropdownType);
        repoDrop.dropdown('persons/employee/dropdown').then(setDropdownEmployee);
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
            
            // Garantir que bikes seja um array válido
            const bikesData = result.bikes || [];
            setBikes(Array.isArray(bikesData) ? bikesData : []);
            
            setLoading(false);
        });
    }, [searchParams?.slug, repo]);

    const columns = [
        { text: 'Bike', dataField: 'bikeNumber' },
        { 
            text: 'Status', 
            dataField: 'status',
            formatter: (cell: string) => {
                if (cell === 'available') return 'Disponível';
                if (cell === 'in_use') return 'Em uso';
                if (cell === 'maintenance') return 'Manutenção';
                return 'Desabilitada';
            }
        },
        { text: 'Aluno', dataField: 'studentName', formatter: (cell: string) => cell || '-' }
    ];

    if (loading) {
        return <Loading />;
    }

    return (
        <PageDefault title="Detalhes da Aula">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                    {/* Card com informações da aula */}
                    <Card>
                        <div className="grid grid-cols-2 gap-4 p-4">
                            <div>
                                <p className="text-sm text-gray-600">Data</p>
                                <p className="font-semibold">{convertDateDayMonthYear(date || '')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Horário</p>
                                <p className="font-semibold">{time}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Tipo de Produto</p>
                                <p className="font-semibold">
                                    {dropdownType.find(t => String(t.id) === String(typeProduct))?.name || '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Professor</p>
                                <p className="font-semibold">
                                    {dropdownEmployee.find(e => String(e.id) === String(teacher))?.name || '-'}
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="col-span-5 gap-4">
                    {/* Accordion para escolher tipo de visualização */}
                    <Card>
                        <div className="border rounded-lg overflow-hidden">
                            {/* Header do Accordion */}
                            <button
                                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <svg 
                                        className="w-5 h-5 text-gray-600" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                                        />
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                                        />
                                    </svg>
                                    <span className="font-semibold text-gray-700">
                                        {viewMode === 'table' ? 'Tabela' : 'BikeView'}
                                    </span>
                                </div>
                                <svg 
                                    className={`w-5 h-5 text-gray-600 transition-transform ${isAccordionOpen ? 'rotate-180' : ''}`}
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Conteúdo do Accordion */}
                            {isAccordionOpen && (
                                <div className="p-4 bg-white border-t">
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => {
                                                setViewMode('table');
                                                setIsAccordionOpen(false);
                                            }}
                                            className={`
                                                flex flex-col items-center justify-center gap-3
                                                py-6 px-4 rounded-lg border-2 transition-all
                                                min-h-[120px]
                                                ${viewMode === 'table' 
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }
                                            `}
                                        >
                                            <svg 
                                                className="w-10 h-10" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth={2} 
                                                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
                                                />
                                            </svg>
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="font-semibold text-base">Tabela</span>
                                                {viewMode === 'table' && (
                                                    <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">
                                                        ✓ Selecionado
                                                    </span>
                                                )}
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => {
                                                setViewMode('bikeview');
                                                setIsAccordionOpen(false);
                                            }}
                                            className={`
                                                flex flex-col items-center justify-center gap-3
                                                py-6 px-4 rounded-lg border-2 transition-all
                                                min-h-[120px]
                                                ${viewMode === 'bikeview' 
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }
                                            `}
                                        >
                                            <svg 
                                                className="w-10 h-10" 
                                                fill="none" 
                                                stroke="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path 
                                                    strokeLinecap="round" 
                                                    strokeLinejoin="round" 
                                                    strokeWidth={2} 
                                                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" 
                                                />
                                            </svg>
                                            <div className="flex flex-col items-center gap-1">
                                                <span className="font-semibold text-base">BikeView</span>
                                                {viewMode === 'bikeview' && (
                                                    <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full">
                                                        ✓ Selecionado
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Visualização condicional */}
                    <Card>
                        {viewMode === 'table' ? (
                            <div>
                                <h3 className="text-lg font-semibold mb-4 px-4 pt-4">Lista de Bikes</h3>
                                <Table 
                                    data={bikes}
                                    columns={columns}
                                    loading={false}
                                />
                            </div>
                        ) : (
                            <div>
                                <h3 className="text-lg font-semibold mb-4 px-4 pt-4">Layout das Bikes</h3>
                                <div className="p-4">
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
                                    />
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Botão Voltar */}
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={back}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
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