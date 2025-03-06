import React, { useEffect, useMemo, useState } from 'react';
import { BikeAvalible, BikeBusy, BikeDisable } from '../icons';
import DropDown from '../dropdown/DropDown';
import Link from 'next/link';
import Modal from "@/components/Modal/Modal";
import DropDownsCollection from "../../../core/DropDowns";
import DropdownType from "@/model/Dropdown";
import AuthInput from '../auth/AuthInput';
import AuthSelect from '../auth/AuthSelect';
import { convertArray } from '@/utils/convertArray';

type Bike = {
    bikeNumber: number;
    status?: string; // "in_use" ou "disable". Ausente significa "available".
    studentName?: string;
};

type BikeStatusProps = {
    bikes: any;
    totalBikes: number; // Número total de bikes (por exemplo, 12)
    onUpdateBikes: (updatedBikes: any[]) => void; // Callback para atualizar bikes
};

const BikeView: React.FC<BikeStatusProps> = ({ bikes, totalBikes, onUpdateBikes }) => {
    const edit: boolean = false;
    const repoDrop = useMemo(() => new DropDownsCollection(), []);

    const [modalType, setModalType] = useState<'addStudent' | 'changeStatus' | null>(null);
    const [selectedBike, setSelectedBike] = useState<number | null>(null);
    const [studentName, setStudentName] = useState('');
    const [bikeStatus, setBikeStatus] = useState('');
    const [students, setStudents] = useState<string[] | null>(null);

    const [dropdownStudent, setDropdownStudent] = useState<DropdownType[]>([]);

    useEffect(() => {
            repoDrop.dropdown('persons/student/dropdown').then(setDropdownStudent);    
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

    const renderBikeStatus = (bikeNumber: number) => {
        // Procura se a bike está no array de bikes
        const bike = bikes.find((b: any) => b.bikeNumber === bikeNumber);

        if (bike) {
            if (bike.status === 'in_use') {
                return (
                    <div className="flex flex-col items-center text-red-500">
                        {BikeBusy()}
                        {/*<span className='text-xs'>{bike?.studentName.split(' ')[0]}</span>*/}
                        <span className='text-xs'>{bike?.studentName}</span>
                    </div>
                );
            } else if (bike.status === 'disable') {
                return (
                    <div className="flex flex-col items-center text-gray-500">
                        {BikeDisable()}
                    </div>
                );
            }
        }

        // Se não está no array, está disponível
        return (
            <DropDown className="flex flex-col items-center" style={'bg-white'}>
                <div >                
                    {BikeAvalible()}
                </div>

                <Link href={"#"} 
                    onClick={() => {
                        setSelectedBike(bikeNumber);
                        setModalType('addStudent');
                    }}
                >
                    Adicionar Aluno
                </Link>
                <Link href={"#"} >
                    Mudar Status
                </Link>

            </DropDown>
        );
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
                        const updatedBike = { bikeNumber: selectedBike, status: 'in_use', studentId: students, studentName: '' };
                        handleUpdateBike(updatedBike)
                        closeModal();
                    }}
                    loading={false}
                >
                    <AuthSelect
                        label='Alunos'
                        value={students}
                        options={convertArray(dropdownStudent)}
                        changeValue={setStudents}
                        edit={edit}
                        required
                    />
                </Modal>
            )}

        </div>
    );
};

export default BikeView;
