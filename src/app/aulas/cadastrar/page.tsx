'use client'

import Card from "@/components/Card/Card";
import AuthInput from "@/components/auth/AuthInput";
import AuthSelect from "@/components/auth/AuthSelect";
import SingleCalendar from "@/components/date/SingleCalendar";
import TimePickerCalendar from "@/components/date/TimePickerCalendar";
import PageDefault from "@/components/template/default";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import DropDownsCollection from "../../../../core/DropDowns";

export default function AddClass() {

    const repoDrop = useMemo(() => new DropDownsCollection(), []);
    const router = useRouter();

    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [typeProduct, setTypeProduct] = useState<string | null>(null);
    const [product, setProduct] = useState<string>("");
    const [teacher, setTeacher] = useState<string>("");
    const [qtdStudents, setQtdStudents] = useState<string>("");
    const [canCommission, setCanCommission] = useState<string>("");
    const [students, setStudents] = useState<string>("");
    const [commissionRules, setCommissionRules] = useState<string>("");
    const [commissionValue, setCommissionValue] = useState<string>("");
    const [edit, setEdit] = useState<boolean>(false);

    const [dropdownType, setDropdownType] = useState<string[]>([]);
    const [dropdownEmployee, setDropdownEmployee] = useState<string[]>([]);
    const [dropdownStudent, setDropdownStudent] = useState<string[]>([]);
    const [dropdownProduct, setDropdownProduct] = useState<string[]>([]);

    useEffect(() => {
            repoDrop.dropdown('productTypes/dropdown').then(setDropdownType);
            repoDrop.dropdown('persons/employee/dropdown').then(setDropdownEmployee);
            repoDrop.dropdown('persons/student/dropdown').then(setDropdownStudent);
      
    }, []);

    useEffect(() => {
        repoDrop.dropdown(`products/dropdown/${typeProduct}`).then(setDropdownProduct);
  
}, [typeProduct]);

    const clear = () => {
        router.push("/aulas");
    }

    const onSubmit = () => {
        console.log("Cadastrei");
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

    function convertArrayType(array: any) {
        return array.map((item: any) => {
            const { name, id, place, ...rest } = item;
            return { label: `${name} - ${place?.name}`, value: id, ...rest };
        });
    }

    function convertArrayType2(array: any) {
        return array.map((item: any) => {
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
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <SingleCalendar
                                    label="Data"
                                    date={date}
                                    setValue={setDate}
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4 xl:grid-rows-4">
                                <TimePickerCalendar
                                    label="Hora"
                                    value={time}
                                    changeValue={setTime}
                                    />
                                
                            </div>
                            <div className="hidden xl:flex xl:grid-rows-4"></div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthSelect
                                    label='Tipo de Produto'
                                    value={typeProduct}
                                    options={convertArrayType(dropdownType)}
                                    changeValue={setTypeProduct}
                                    edit={edit}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                
                                {dropdownProduct.length > 0 
                                ? 
                                <AuthSelect
                                    label='Produto'
                                    value={product}
                                    options={convertArrayType2(dropdownProduct)}
                                    changeValue={setProduct}
                                    edit={edit}
                                    required
                                />
                                :
                                <AuthInput
                                    label="Produto"
                                    value={product}
                                    type='text'
                                    disabled
                                    changeValue={setProduct}
                                    required
                                />
                                }
                                
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                

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
                        </div>
                        <hr className="mt-3 mb-5 pb-3" style={{ borderColor: "#F4F5F6" }} />
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                
                                <AuthSelect
                                    label="Quantidade de alunos"
                                    value={qtdStudents}
                                    options={[{label: '1', value: 1}, {label: '2', value: 2}, {label: '3', value: 3}, {label: '4', value: 4}, {label: '5', value: 5}, {label: '6', value: 6}, {label: '7', value: 7}, {label: '8', value: 8}, {label: '9', value: 9}, {label: '10', value: 10}]}
                                    changeValue={setQtdStudents}
                                    edit={edit}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthSelect
                                    label="Possiu comissão?"
                                    value={canCommission}
                                    options={[{label: 'Sim', value: true}, {label: 'Não', value: false}]}
                                    changeValue={setCanCommission}
                                    edit={edit}
                                    required
                                />
                            </div>
                            <div className="hidden xl:flex xl:grid-rows-4"></div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">                                
                                {dropdownStudent.length > 0 
                                    ? 
                                    <AuthSelect
                                        label='Alunos'
                                        value={students}
                                        options={convertArrayType2(dropdownStudent)}
                                        changeValue={setStudents}
                                        edit={edit}
                                        required
                                    />
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
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Regra de Comissão"
                                    value={commissionRules}
                                    type='text'
                                    changeValue={setCommissionRules}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Valor da Comissão"
                                    value={commissionValue}
                                    type='number'
                                    changeValue={setCommissionValue}
                                    required
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </PageDefault>
    )
}