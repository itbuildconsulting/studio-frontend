'use client'

import Card from "@/components/Card/Card";
import AuthInput from "@/components/auth/AuthInput";
import AuthSelect from "@/components/auth/AuthSelect";
import PageDefault from "@/components/template/default";
import { Card as UiCard, CardContent as UiCardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import PersonsCollecion from "../../../../../../core/Persons";
import DropDownsCollection from "../../../../../../core/DropDowns";
import SingleCalendar from "@/components/date/SingleCalendar";
import Loading from "@/components/loading/Loading";
import Modal from "@/components/Modal/Modal";
import { EventBtn } from "@/types/btn";
import { ValidationForm } from "@/components/formValidation/validation";
import ValidationFields from "@/validators/fields";

import listStates from '../../../../../json/states.json';
import listCountry from '../../../../../json/country.json';

function StudentKpiCard({
    value, label, iconBg, icon,
}: {
    value: number;
    label: string;
    iconBg: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className={cn("h-11 w-11 rounded-full flex items-center justify-center shrink-0", iconBg)}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
                <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </div>
        </div>
    );
}

export default function EditStudents() {
    const dropdownStates = listStates?.estados;
    const dropdownCountry = listCountry?.pais;
    
    const edit: boolean = true;
    const repo = useMemo(() => new PersonsCollecion(), []);
    const repoDrop = useMemo(() => new DropDownsCollection(), []);

    const searchParams = useParams()
    const router = useRouter();

    const [id, setId] = useState<number | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [document, setDocument] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [phone, setPhone] = useState<string | null>(null);
    const [birthday, setBirthday] = useState<string | null>(null);
    const [height, setHeight] = useState<number | null>(null);
    const [weight, setWeight] = useState<number | null>(null);
    const [shoes, setShoes] = useState<number | null>(null);
    const [password, setPassword] = useState<any>(null);
    const [confirmPass, setConfirmPass] = useState<string | null>(null);
    const [level, setLevel] = useState<string | null>('1');
    const [zipCode, setZipCode] = useState<string | null>(null);
    const [state, setState] = useState<string | null>(null);
    const [city, setCity] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [country, setCountry] = useState<string | null>(null);
    const [status, setStatus] = useState<number>(0);

    const [modalSuccess, setModalSuccess] = useState<any>(false);
    const [log, setLog] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<any>(null);
    const [loading, setLoading] = useState<any>(false);
    const [errorMessage, setErrorMessage] = useState<any>(null);

    const [isEditing, setIsEditing] = useState(false);

    const [extrato, setExtrato] = useState<any>(null);
    const [loadingExtrato, setLoadingExtrato] = useState(false);

    const creditosDisponiveis = useMemo(() => {
        return (extrato?.creditos ?? [])
            .filter((c: any) => c.status === "valid")
            .reduce((sum: number, c: any) => sum + (c.availableCredits ?? 0), 0);
    }, [extrato]);

    const aulasAgendadas = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return (extrato?.aulas ?? []).filter((a: any) => {
            if (a.checkin || !(a.status === 1 || a.status === true)) return false;
            const d = new Date(a.date);
            return d >= today;
        }).length;
    }, [extrato]);

    const aulasRealizadas = useMemo(() => {
        return (extrato?.aulas ?? []).filter((a: any) => a.checkin).length;
    }, [extrato]);

    const [modalLevelShow, setModalLevelShow] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState<any>(0);
    const [dropdownLevelStudent, setDropdownLevelStudent] = useState([]);
    const [loadingLevel, setLoadingLevel] = useState(false);

    useEffect(() => {
        if (modalLevelShow) {
            // Buscar níveis disponíveis
            repoDrop.dropdown('level').then((levels: any) => {
                const formattedLevels = levels.data.map((level: any) => ({
                    value: level.id,
                    label: level.name,
                }));
                setDropdownLevelStudent(formattedLevels);
                
            });
        }
    }, [modalLevelShow]);

    const onSubmitUpdateLevel = async () => {
        setLoadingLevel(true);
        setErrorMessage('');

        if (!selectedLevel) {
            setErrorMessage('Selecione um nível');
            setLoadingLevel(false);
            return;
        }

        try {
            const result = await repo.updateStudentLevel(
                Number(searchParams?.slug), 
                Number(selectedLevel)
            );
            
            if (result) {
                setSuccessMessage('Nível atualizado com sucesso!');
                setModalLevelShow(false);
                // Recarregar dados ou atualizar estado local
                //window.location.reload();
            }
        } catch (error: any) {
            const errorData = JSON.parse(error.message);
            setErrorMessage(errorData.error || 'Erro ao atualizar nível');
        } finally {
            setLoadingLevel(false);
        }
    };

    const [dropdownLevel] = useState<any>(
        [
            {
                label: 'Administrador',
                value: '1'
            },
            {
                label: 'Professor',
                value: '2'
            }
        ]
    );

    // Password Control
    var regex = /^(?=.*[a-z]{1})(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    var regexLetter = /^(?=.*[A-Za-z]{1})/;
    var regexNumber = /^(?=.*\d)/;
    var regexSymble = /^(?=.*[@$!%*#?&])/;

    const [passwordValidation, setPasswordValidation] = useState<boolean>(false); ///usado nos atributos "isValid" e "isInvald" dos inputs

    const [passwordStr, setPasswordStr] = useState<any>(0);
    const [passwordStrColor, setPasswordStrColor] = useState<any>('#ccc');
    const [passwordStrText, setPasswordStrText] = useState<any>('');

    const clear = () => {
        router.push("/alunos");
    }

    function Validation() {
        var strength: any = 0;

        if (regexNumber.exec(password)) {
            strength += 1;
        }

        if (regexSymble.exec(password)) {
            strength += 1;
        }

        if (regexLetter.exec(password)) {
            strength += 1;
        }

        if (!regex.exec(password)) {
            setPasswordValidation(false);
        } else {
            strength = 4;
            setPasswordValidation(true);
        }

        if (strength === 0) {
            setPasswordStrColor('#ccc');
            setPasswordStrText('');
        } else if (strength === 1) {
            setPasswordStrColor('red');
            setPasswordStrText('Senha Fraca');
        } else if (strength === 2 || strength === 3) {
            setPasswordStrColor('#e0e00d');
            setPasswordStrText('Senha Média');
        } else {
            setPasswordStrColor('green');
            setPasswordStrText('Senha Forte');
        }

        setPasswordStr(strength);

        return true;
    };

    const passwordStrength = () => {
        return (
            <div
                className={`grid grid-cols-12`}
                style={{
                    gap: "5px"
                }}
            >
                <div
                    className={`col-span-3`}
                    style={{
                        border: "2px solid #ccc",
                        borderColor: `${passwordStr >= 1 ? passwordStrColor : ''}`,
                    }}
                ></div>
                <div
                    className={`col-span-3`}
                    style={{
                        border: "2px solid #ccc",
                        borderColor: `${passwordStr >= 2 ? passwordStrColor : ''}`,
                    }}
                ></div>
                <div
                    className={`col-span-3`}
                    style={{
                        border: "2px solid #ccc",
                        borderColor: `${passwordStr >= 3 ? passwordStrColor : ''}`,
                    }}
                ></div>
                <div
                    className={`col-span-3`}
                    style={{
                        border: "2px solid #ccc",
                        borderColor: `${passwordStr >= 4 ? passwordStrColor : ''}`,
                    }}
                ></div>
            </div>
        );
    };

    useEffect(() => {
        Validation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [password])

    function removerCaracteresEspeciais(str: any) {
        if (str) {
            return str.replace(/[^a-zA-Z0-9]/g, '');
        } else {
            return str;
        }
    }

    function converterDate(str: any) {
        if (str) {
            return str.split("/").reverse().join("-");
        } else {
            return str;
        }
    }

    function validarCPF(cpf: any) {
        if (cpf) {
            cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

            if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
                return false; // Verifica se o CPF tem 11 dígitos e não é uma sequência repetida
            }

            // Função para calcular os dígitos verificadores
            const calcularDigito = (base: any) => {
                let total = 0;
                for (let i = 0; i < base.length; i++) {
                    total += base[i] * (base.length + 1 - i);
                }
                let digito = 11 - (total % 11);
                return digito > 9 ? 0 : digito;
            };

            const base = cpf.substring(0, 9);
            const digito1 = calcularDigito(base);
            const digito2 = calcularDigito(base + digito1);

            return cpf === base + digito1 + digito2;
        } else {
            return false;
        }
    }

    function validarEmail(email: any) {
        if (email) {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regex.test(email);
        } else {
            return false;
        }
    }

    function confirmarSenha(senha: any, confirmacaoSenha: any) {
        return senha === confirmacaoSenha;
    }

    const handleClosed = () => {
        if (log === 0) {
            router.push("/alunos");
        } else {
            setModalSuccess(false);
        }
    }

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

    const fetchStudentDetails = () => {
        if (!searchParams?.slug) return;
        repo?.details(+searchParams.slug).then((result: any) => {
            if (result instanceof Error) {
                const message: any = JSON.parse(result.message);
                setErrorMessage(message.error);
                setLoading(false);
                setLog(1);
                setTimeout(() => {
                    setErrorMessage(null);
                }, 2500);
            } else {
                setId(result?.id);
                setName(result.name)
                setDocument(result.identity)
                setEmail(result.email)
                setPhone(result.phone)
                setBirthday(result.birthday.split('-').reverse().join('/'))
                setHeight(result.height)
                setWeight(result.weight)
                setShoes(Number(result.other))
                setPassword('')
                setConfirmPass('')
                setLevel(result.level)
                setZipCode(result.zipCode)
                setState(result.state)
                setCity(result.city)
                setAddress(result.address)
                setCountry(result.country)
                setStatus(result.active)
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

    const cancelEdit = () => {
        setIsEditing(false);
        setErrorMessage(null);
        fetchStudentDetails();
    }

    useEffect(() => {
        if (!searchParams?.slug) return;

        setLoadingExtrato(true);
        repo.extrato(Number(searchParams.slug)).then((result: any) => {
            if (result?.data) setExtrato(result.data);
            setLoadingExtrato(false);
        });

        fetchStudentDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [repo, searchParams?.slug])

    const onSubmit = () => {
        setLoading(true);
        setErrorMessage(null);

        const validationError = ValidationFields({ "Nome": name, "Data de Nascimento": birthday, "Telefone": phone, "Status": String(status), "Cep": zipCode, "Estado": state, "Cidade": city, "Endereço": address, "Pais": country });

        if (validationError) {
            setErrorMessage(validationError);
            setLoading(false);
            setTimeout(() => setErrorMessage(null), 2500);
            return;
        }

        if (!validarCPF(document)) {
            setErrorMessage("Por favor, informe um cpf válido!");
            setLoading(false);
            setLog(1);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2500);
        } else if (!validarEmail(email)) {
            setErrorMessage("Por favor, informe um email válido!");
            setLoading(false);
            setLog(1);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2500);
        }/* else if (!passwordValidation) {
            setErrorMessage("Senha muito fraca!");
            setLoading(false);
            setLog(1);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2500);
        } else if (!confirmarSenha(password, confirmPass)) {
            setErrorMessage("Por favor, confirme a senha corretamente!");
            setLoading(false);
            setLog(1);
            setTimeout(() => {
                setErrorMessage(null);
            }, 2500); }*/
        else {
            repo?.edit(id, name, removerCaracteresEspeciais(document), email, removerCaracteresEspeciais(phone), converterDate(birthday), height, weight, String(shoes), password, '', '', true, "0", zipCode, state, city, address, country, status).then((result: any) => {
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
                    setSuccessMessage("Edição realizada com sucesso!");
                    setLog(0);
                    setIsEditing(false);
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
    }

    const eventButton: EventBtn[] = isEditing
        ? [
            {
                name: "Cancelar",
                function: cancelEdit,
                class: "btn-outline-primary"
            },
            {
                name: "Salvar",
                function: onSubmit,
                class: "btn-primary"
            },
        ]
        : [
            {
                name: "Cancelar",
                function: clear,
                class: "btn-outline-primary"
            },
            {
                name: "Editar",
                function: () => setIsEditing(true),
                class: "btn-primary"
            },
        ];

    return (
        <PageDefault title={"Editar Aluno"}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StudentKpiCard
                    value={creditosDisponiveis}
                    label="Créditos disponíveis"
                    iconBg="bg-emerald-100 text-emerald-600"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StudentKpiCard
                    value={aulasAgendadas}
                    label="Aulas agendadas"
                    iconBg="bg-blue-100 text-blue-600"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                    }
                />
                <StudentKpiCard
                    value={aulasRealizadas}
                    label="Aulas realizadas"
                    iconBg="bg-violet-100 text-violet-600"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </div>

            <button
                className="btn-primary p-3 mb-4 "
                onClick={() => setModalLevelShow(true)}
            >
                Atualizar Nível
            </button>
            <div className="grid grid-cols-12">
                <div className="col-span-12">
                    <Card
                        hasFooter={true}
                        eventsButton={eventButton}
                        loading={loading}
                    >
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Nome"
                                    value={name}
                                    type='text'
                                    changeValue={setName}
                                    edit={edit}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="CPF"
                                    value={document}
                                    type='text'
                                    maxLength={14}
                                    maskType={"cpf"}
                                    changeValue={setDocument}
                                    edit={edit}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Email"
                                    value={email}
                                    type='text'
                                    changeValue={setEmail}
                                    edit={edit}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <SingleCalendar
                                    label="Data de Nascimento"
                                    date={birthday}
                                    setValue={setBirthday}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Telefone"
                                    value={phone}
                                    type='text'
                                    maskType={"telefone"}
                                    changeValue={setPhone}
                                    edit={edit}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthSelect
                                    label="Status"
                                    options={[
                                        {
                                            value: 1,
                                            label: "Ativo"
                                        },
                                        {
                                            value: 0,
                                            label: "Inativo"
                                        }
                                    ]}
                                    value={status}
                                    changeValue={setStatus}
                                    edit={edit}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                        </div>
                        <hr className="mt-3 mb-5 pb-3" style={{ borderColor: "#F4F5F6" }} />
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Altura (cm)"
                                    value={height}
                                    type='number'
                                    changeValue={setHeight}
                                    edit={edit}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Peso (kg)"
                                    value={weight}
                                    type='number'
                                    changeValue={setWeight}
                                    edit={edit}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Sapato"
                                    value={shoes}
                                    type='number'
                                    changeValue={setShoes}
                                    edit={edit}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                            {/*<div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Senha"
                                    value={password}
                                    type='password'
                                    changeValue={setPassword}
                                    tooltipMessage={"Use oito ou mais caracteres com uma combinação de letras, números e símbolos"}
                                    edit={edit}
                                    disabled={!isEditing}
                                    required
                                />
                                {passwordStrength()}

                                <div
                                    className="flex justify-center"
                                    style={{ color: `${passwordStrColor}` }}
                                >
                                    {passwordStrText}
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Confirmar Senha"
                                    value={confirmPass}
                                    type='password'
                                    changeValue={setConfirmPass}
                                    edit={edit}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                            */}
                        </div>
                        <hr className="mt-3 mb-5 pb-3" style={{ borderColor: "#F4F5F6" }} />
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="CEP"
                                    value={zipCode}
                                    type='text'
                                    changeValue={setZipCode}
                                    edit={edit}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthSelect
                                    label="Estado"
                                    options={dropdownStates}
                                    value={state}
                                    changeValue={setState}
                                    edit={edit}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Cidade"
                                    value={city}
                                    type='text'
                                    changeValue={setCity}
                                    edit={edit}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Endereço"
                                    value={address}
                                    type='text'
                                    changeValue={setAddress}
                                    edit={edit}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Pais"
                                    value={country}
                                    type='text'
                                    changeValue={setCountry}
                                    edit={edit}
                                    disabled={!isEditing}
                                    required
                                />
                            </div>
                            <ValidationForm errorMessage={errorMessage} />
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-12 mt-6">
                <div className="col-span-12">
                    <UiCard>
                        <UiCardContent className="p-6">
                            <h2 className="text-2xl font-semibold mb-4">Extrato de Aulas e Créditos</h2>

                            {loadingExtrato ? (
                                <div className="h-32 rounded-lg bg-muted animate-pulse" />
                            ) : (
                                <Tabs defaultValue="aulas">
                                    <TabsList>
                                        <TabsTrigger value="aulas">Aulas</TabsTrigger>
                                        <TabsTrigger value="creditos">Créditos</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="aulas">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="px-3 py-2 border">Data</th>
                                                        <th className="px-3 py-2 border">Horário</th>
                                                        <th className="px-3 py-2 border">Status</th>
                                                        <th className="px-3 py-2 border">Checkin</th>
                                                        <th className="px-3 py-2 border">TransactionId</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {extrato?.aulas?.map((aula: any) => (
                                                        <tr key={aula.classStudentId} className="border-b">
                                                            <td className="px-3 py-2 border">{aula.date?.split('-').reverse().join('/')}</td>
                                                            <td className="px-3 py-2 border">{aula.time}</td>
                                                            <td className="px-3 py-2 border">
                                                                <Badge variant={aula.status ? "success" : "destructive"}>
                                                                    {aula.status ? 'Ativa' : 'Cancelada'}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-3 py-2 border">{aula.checkin ? '✅' : '—'}</td>
                                                            <td className="px-3 py-2 border text-xs text-gray-500">{aula.transactionId ?? '—'}</td>
                                                        </tr>
                                                    ))}
                                                    {!extrato?.aulas?.length && (
                                                        <tr><td colSpan={5} className="px-3 py-4 text-center text-gray-400">Nenhuma aula encontrada</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="creditos">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-100">
                                                        <th className="px-3 py-2 border">CreditBatch</th>
                                                        <th className="px-3 py-2 border">Disponível</th>
                                                        <th className="px-3 py-2 border">Usado</th>
                                                        <th className="px-3 py-2 border">Status</th>
                                                        <th className="px-3 py-2 border">Validade</th>
                                                        <th className="px-3 py-2 border">Origem</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {extrato?.creditos?.map((c: any) => (
                                                        <tr key={c.id} className="border-b">
                                                            <td className="px-3 py-2 border text-xs text-gray-500">{c.creditBatch}</td>
                                                            <td className="px-3 py-2 border">{c.availableCredits}</td>
                                                            <td className="px-3 py-2 border">{c.usedCredits}</td>
                                                            <td className="px-3 py-2 border">
                                                                <Badge variant={c.status === 'valid' ? "success" : c.status === 'expired' ? "warning" : "outline"}>
                                                                    {c.status}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-3 py-2 border">{c.expirationDate?.split('T')[0].split('-').reverse().join('/')}</td>
                                                            <td className="px-3 py-2 border">{c.origin ?? '—'}</td>
                                                        </tr>
                                                    ))}
                                                    {!extrato?.creditos?.length && (
                                                        <tr><td colSpan={6} className="px-3 py-4 text-center text-gray-400">Nenhum crédito encontrado</td></tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            )}

                            {extrato?.cancelamentos?.length > 0 && (
                                <>
                                    <h3 className="text-lg font-medium mb-2 mt-6 text-red-600">⚠️ Cancelamentos — Verificar Crédito</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left border-collapse">
                                            <thead>
                                                <tr className="bg-red-50">
                                                    <th className="px-3 py-2 border">Aula</th>
                                                    <th className="px-3 py-2 border">Lote encontrado?</th>
                                                    <th className="px-3 py-2 border">Expirado?</th>
                                                    <th className="px-3 py-2 border">Crédito devolvido?</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {extrato.cancelamentos.map((c: any, i: number) => (
                                                    <tr key={i} className="border-b">
                                                        <td className="px-3 py-2 border">{c.date?.split('-').reverse().join('/')}</td>
                                                        <td className="px-3 py-2 border">{c.loteEncontrado ? '✅' : '❌ Não'}</td>
                                                        <td className="px-3 py-2 border">{c.loteExpirado ? '⚠️ Sim' : '—'}</td>
                                                        <td className="px-3 py-2 border">
                                                            <Badge variant={c.creditoDevolvido ? "success" : "destructive"}>
                                                                {c.creditoDevolvido ? '✅ Devolvido' : '❌ Não devolvido'}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </UiCardContent>
                    </UiCard>
                </div>
            </div>

            <Modal
                btnClose={false}
                showModal={modalSuccess}
                setShowModal={setModalSuccess}
                hrefClose={'/funcionarios'}
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

            <Modal
                title="Atualizar Nível do Aluno"
                btnClose={true}
                setShowModal={setModalLevelShow}
                showModal={modalLevelShow}
                hasFooter={true}
                onSubmit={onSubmitUpdateLevel}
                loading={loadingLevel}
                edit={true}
            >
                <div>
                    <AuthSelect
                        label="Selecione o Nível"
                        value={selectedLevel}
                        options={dropdownLevelStudent}
                        changeValue={setSelectedLevel}
                        edit={true}
                        required
                    />
                    {errorMessage && (
                        <div className="text-red-500 text-sm mt-2">
                            {errorMessage}
                        </div>
                    )}
                </div>
            </Modal>
        </PageDefault>
    )
}