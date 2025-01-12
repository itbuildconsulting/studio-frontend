import React from 'react';
import { BikeAvalible, BikeBusy, BikeDisable } from '../icons';

type Bike = {
    bikeNumber: number;
    status?: string; // "in_use" ou "disable". Ausente significa "available".
    studentName?: string;
};

type BikeStatusProps = {
    bikes: any;
    totalBikes: number; // Número total de bikes (por exemplo, 12)
};

const BikeView: React.FC<BikeStatusProps> = ({ bikes, totalBikes }) => {

    const rows = [
        [0], // Primeira linha: Bike 0
        [1, 2, 3], // Segunda linha: Bike 1, 2, 3
        [4, 5, 6, 7], // Terceira linha: Bike 4, 5, 6, 7
        [8, 9, 10], // Quarta linha: Bike 8, 9, 10
        [11, 12], // Quinta linha: Bike 11, 12
    ];

    const renderBikeStatus = (bikeNumber: number) => {
        // Procura se a bike está no array de bikes
        const bike = bikes.find((b: any) => b.bikeNumber === bikeNumber);

        if (bike) {
            if (bike.status === 'in_use') {
                return (
                    <div className="flex flex-col items-center text-red-500">
                        {BikeBusy()}
                        <span className='text-xs'>{bike.studentName.split(' ')[0]}</span>
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
            <div className="flex flex-col items-center text-green-500">                
                {BikeAvalible()}
            </div>
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
        </div>
    );
};

export default BikeView;
