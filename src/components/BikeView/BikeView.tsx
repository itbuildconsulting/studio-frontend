import React, { useEffect, useMemo, useState } from 'react';
import { BikeAvalible, BikeBusy, BikeDisable, BirthdayIcon } from '../icons';
import DropDown from '../dropdown/DropDown';
import Link from 'next/link';
import Modal from "@/components/Modal/Modal";
import DropDownsCollection from "../../../core/DropDowns";
import DropdownType from "@/model/Dropdown";
import AuthInput from '../auth/AuthInput';
import AuthSelect from '../auth/AuthSelect';
import AuthSelectSearch from '../auth/AuthSelectSearch';
import { convertArray } from '@/utils/convertArray';
import { useParams } from 'next/navigation';
import { isBirthday } from '@/utils/checkBirthday';

type Bike = {
    bikeNumber: number;
    status?: string; // "in_use" ou "disable". Ausente significa "available".
    studentName?: string;
    studentBirthday?: string; // ✅ ADICIONAR
};

type BikeStatusProps = {
    bikes: any;
    totalBikes: number; // Número total de bikes (por exemplo, 12)
    onUpdateBikes: (updatedBikes: any[]) => void; // Callback para atualizar bikes
    handleRemoveStudent: (classId: number, studentId: number, bikeId: number) => void;
    handleCheckin: (classId: number, studentId: number) => void;
    handleAddStudent: (studentId: number, bikeNumber: number) => void;
};

const BikeView: React.FC<BikeStatusProps> = ({ bikes, totalBikes, onUpdateBikes, handleRemoveStudent, handleCheckin, handleAddStudent }) => {
    const edit: boolean = false;

    const repoDrop = useMemo(() => new DropDownsCollection(), []);
    const searchParams = useParams()

    const [modalType, setModalType] = useState<'addStudent' | 'changeStatus' | 'removeStudent' | 'checkin' | null>(null);
    const [selectedBike, setSelectedBike] = useState<number | null>(null);
    const [studentName, setStudentName] = useState('');
    const [bikeStatus, setBikeStatus] = useState('');
    const [students, setStudents] = useState<string | number | null>(null);

    const [dropdownStudent, setDropdownStudent] = useState<DropdownType[]>([]);

    useEffect(() => {
        repoDrop.dropdown('persons/student/dropdown').then(setDropdownStudent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalType]);

    const closeModal = () => {
        setModalType(null);
        setSelectedBike(null);
        setStudentName('');
        setBikeStatus('');
    };

    const rows = [
        [0], // Primeira linha: Bike 0
        [1, 2, 3], // Segunda linha: Bike 1, 2, 3
        [4, 5, 6, 7], // Terceira linha: Bike 4, 5, 6, 7
        [8, 9, 10], // Quarta linha: Bike 8, 9, 10
        [11, 12], // Quinta linha: Bike 11, 12
    ];

    const handleUpdateBike = (updatedBike: any) => {
        const bikeExists = bikes.some((bike: any) => bike.bikeNumber === updatedBike.bikeNumber);

        const updatedBikes = bikeExists
            ? bikes.map((bike: any) =>
                bike.bikeNumber === updatedBike.bikeNumber ? updatedBike : bike
            )
            : [...bikes, updatedBike]; // Adiciona a bike se ela não existir

        onUpdateBikes(updatedBikes);
    };

    const shortName = (fullName?: string): string => {
        if (!fullName) return '';
        const parts = fullName.trim().split(' ');
        if (parts.length <= 2) return fullName;
        return `${parts[0]} ${parts[parts.length - 1]}`;
    };

    const renderBikeStatus = (bikeNumber: number) => {
        // Procura se a bike está no array de bikes
        const bike = bikes.find((b: any) => b.bikeNumber === bikeNumber);

        return (
            <>
                <DropDown className="flex flex-col items-center" style={'bg-white'}>
                    {(bike === undefined || bike?.status === 'available') &&
                        <div>
                            {BikeAvalible()}
                        </div>
                    }
                    {(bike === undefined || bike?.status === 'available') &&
                        < Link href={"#"}
                            onClick={() => {
                                setSelectedBike(bikeNumber);
                                setModalType('addStudent');
                            }}
                        >
                            Adicionar Aluno
                        </Link>
                    }

                    {bike?.status === 'in_use' &&
                        <div className="flex flex-col items-center text-red-500">
                            {BikeBusy()}
                             
                            <span
                                className='absolute -bottom-4 z-10 cursor-default group'
                                style={{fontSize: '11px'}}
                                title={bike?.studentName}
                            >
                                {shortName(bike?.studentName)}
                                <span className="absolute top-3 left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    {bike?.studentName}
                                </span>
                            </span>
                            {isBirthday(bike?.studentBirthday) && (
                                <span className='text-xs text-yellow-500 font-bold absolute text-xs -bottom-8 z-10'>
                                    🎂 Aniversário!
                                </span>
                            )}
                        </div>
                    }
                    {bike?.status === 'in_use' &&
                        <Link href={"#"}
                            onClick={() => {
                                setSelectedBike(bikeNumber);
                                setModalType('checkin');
                            }}
                        >
                            Check-in
                        </Link>
                    }

                    {bike?.status === 'in_use' &&
                        <Link href={"#"}
                            onClick={() => {
                                setSelectedBike(bikeNumber);
                                setModalType('removeStudent');
                            }}
                        >
                            Remover aluno
                        </Link>
                    }


                    {bike?.status === 'maintenance' &&
                        <div className="flex flex-col items-center text-gray-500">
                            {BikeDisable()}
                        </div>
                    }

                    {bike?.status !== 'in_use' &&
                        <Link href={"#"}
                            onClick={() => {
                                setSelectedBike(bikeNumber);
                                setModalType('changeStatus');
                            }}
                        >
                            Mudar Status
                        </Link>
                    }

                </DropDown >
            </>
        )
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex flex-row justify-center mb-6">
                    {row.map((bikeNumber) => (
                        <div key={bikeNumber} className="flex flex-col items-center relative p-5">
                            {bikeNumber === 0
                                ?
                                <div className="flex flex-col items-center text-red-500">
                                    {BikeBusy()}
                                </div>
                                :
                                renderBikeStatus(bikeNumber)
                            }
                            {bikeNumber === 0 ? <span className="mt-2">Professor</span> : <span className="mt-2 number_bike">{bikeNumber}</span>}
                        </div>
                    ))}
                </div>
            ))}

            {modalType === 'addStudent' && (
                <Modal
                    title={`Adicionar Aluno - Bike ${selectedBike}`}
                    btnClose={true}
                    setShowModal={closeModal}
                    showModal={!!modalType}
                    hasFooter={true}
                    onSubmit={() => {
                        if (students && selectedBike) {
                            handleAddStudent(Number(students), selectedBike);
                            setStudents(null);
                            closeModal();
                        }
                    }}
                    loading={false}
                >
                    <AuthSelectSearch
                        label='Alunos'
                        value={students}
                        options={convertArray(dropdownStudent)}
                        changeValue={setStudents}
                        placeholder="Buscar aluno..."
                        required
                    />
                </Modal>
            )}

            {modalType === 'changeStatus' && (
                <Modal
                    title={`Alterar status - Bike ${selectedBike}`}
                    btnClose={true}
                    setShowModal={closeModal}
                    showModal={!!modalType}
                    hasFooter={true}
                    edit={true}
                    onSubmit={() => {
                        if (bikeStatus) {
                            const updatedBike = { bikeNumber: selectedBike, status: bikeStatus, studentId: null, studentName: '' };
                            handleUpdateBike(updatedBike);
                            setBikeStatus('');
                            closeModal();
                        }
                    }}
                    loading={false}
                >
                    <AuthSelect
                        label='Status'
                        value={bikeStatus}
                        options={[
                            { value: 'available', label: 'Disponível' },
                            //{value: 'in_use', label: 'Em Uso'},
                            { value: 'maintenance', label: 'Em Manutenção' },
                        ]}
                        changeValue={setBikeStatus}
                        edit={edit}
                        required
                    />
                </Modal>
            )}

            {modalType === 'removeStudent' && (
                <Modal
                    title={`Remover o aluno - Bike ${selectedBike}`}
                    btnClose={true}
                    setShowModal={closeModal}
                    showModal={!!modalType}
                    hasFooter={true}
                    edit={true}
                    customButtonText={["Cancelar", "Confirmar"]}
                    onSubmit={() => {
                        const currentBike = bikes.find((b: any) => b.bikeNumber === selectedBike);
                        if (currentBike) {
                            if (!searchParams?.slug) return;

                            handleRemoveStudent(+searchParams?.slug, currentBike.studentId, currentBike.id);
                            setBikeStatus('');
                            closeModal();
                        }

                    }}
                    loading={false}
                    customStyle={{ height: 'auto' }}
                >
                    <div className="text-center p-4">
                        <p className="text-gray-700 mb-4">
                            Tem certeza que deseja remover o aluno <strong>{bikes.find((b: any) => b.bikeNumber === selectedBike)?.studentName}</strong> da bike {selectedBike}?
                        </p>
                        <p className="text-sm text-gray-500">
                            Esta ação irá liberar a bike para uso de outros alunos.
                        </p>
                    </div>
                </Modal>
            )}

            {modalType === 'checkin' && (
                <Modal
                    title={`Confirmar o Check-in - Bike ${selectedBike}`}
                    btnClose={true}
                    setShowModal={closeModal}
                    showModal={!!modalType}
                    hasFooter={true}
                    edit={true}
                    customButtonText={["Cancelar", "Confirmar"]}
                    onSubmit={() => {
                        if (selectedBike) {
                            const currentBike = bikes.find((b: any) => b.bikeNumber === selectedBike);
                            if (currentBike) {
                                if (!searchParams?.slug) return;
                                handleCheckin(+searchParams?.slug, currentBike.studentId);
                                setBikeStatus('');
                                closeModal();
                            }
                        }
                    }}
                    loading={false}
                    customStyle={{ height: 'auto' }}
                >
                    <div className="text-center p-4">
                        <p className="text-gray-700 mb-4">
                            Confirmar o check-in do aluno <strong>{bikes.find((b: any) => b.bikeNumber === selectedBike)?.studentName}</strong> na bike {selectedBike}?
                        </p>
                        <p className="text-sm text-gray-500">
                            Esta ação confirma a presença do aluno na aula de hoje.
                        </p>
                    </div>
                </Modal>
            )}

        </div>
    );
};

export default BikeView;
