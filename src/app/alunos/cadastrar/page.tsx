'use client'

import Card from "@/components/Card/Card";
import AuthInput from "@/components/auth/AuthInput";
import AuthSelect from "@/components/auth/AuthSelect";
import PageDefault from "@/components/template/default";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import PersonsCollecion from "../../../../core/Persons";
import Loading from "@/components/loading/Loading";
import Modal from "@/components/Modal/Modal";
import SingleCalendar from "@/components/date/SingleCalendar";

export default function Students() {
    const repo = useMemo(() => new PersonsCollecion(), []);
    const router = useRouter();

    const [name, setName] = useState<string | null>(null);
    const [document, setDocument] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [phone, setPhone] = useState<string | null>(null);
    const [birthday, setBirthday] = useState<string | null>(null);
    const [height, setHeight] = useState<number | null>(null);
    const [weight, setWeight] = useState<number | null>(null);
    const [shoes, setShoes] = useState<string | null>(null);
    const [password, setPassword] = useState<any>(null);
    const [confirmPass, setConfirmPass] = useState<string | null>(null);
    const [contract, setContract] = useState<string | null>(null);
    const [frequency, setFrequency] = useState<string | null>(null);
    const [classValue, setClassValue] = useState<string | null>(null);
    const [zipCode, setZipCode] = useState<string | null>(null);
    const [state, setState] = useState<string | null>(null);
    const [city, setCity] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [country, setCountry] = useState<string | null>(null);
    const [status, setStatus] = useState<boolean>(true);

    const [modalSuccess, setModalSuccess] = useState<any>(false);
    const [log, setLog] = useState<number | null>(null);
    const [successMessage, setSuccessMessage] = useState<any>(null);
    const [loading, setLoading] = useState<any>(false);
    const [errorMessage, setErrorMessage] = useState<any>(null);

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

    const onSubmit = () => {
        setLoading(true);
        setErrorMessage(null);

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
        } else if (!passwordValidation) {
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
            }, 2500);
        } else {
            repo?.create(name, document, email, phone, birthday, height, weight, shoes, password, contract, frequency, false, 0 , zipCode, state, city, address, country, status).then((result: any) => {
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

    return (
        <PageDefault title={"Cadastrar Alunos"}>
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
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Email"
                                    value={email}
                                    type='text'
                                    changeValue={setEmail}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <SingleCalendar
                                    label="Data de Nascimento"
                                    date={birthday}
                                    setValue={setBirthday}
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Telefone"
                                    value={phone}
                                    type='text'
                                    maskType={"telefone"}
                                    changeValue={setPhone}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthSelect
                                    label="Status"
                                    options={[
                                        {
                                            value: true,
                                            label: "Ativo"
                                        },
                                        {
                                            value: false,
                                            label: "Inativo"
                                        }
                                    ]}
                                    value={status}
                                    changeValue={setStatus}
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
                                    type='text'
                                    changeValue={setHeight}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Peso (kg)"
                                    value={weight}
                                    type='text'
                                    changeValue={setWeight}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Sapato"
                                    value={shoes}
                                    type='text'
                                    changeValue={setShoes}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Senha"
                                    value={password}
                                    type='password'
                                    changeValue={setPassword}
                                    tooltipMessage={"Use oito ou mais caracteres com uma combinação de letras, números e símbolos"}
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
                                    required
                                />
                            </div>
                        </div>
                        <hr className="mt-3 mb-5 pb-3" style={{ borderColor: "#F4F5F6" }} />
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Contrato"
                                    value={contract}
                                    type='text'
                                    changeValue={setContract}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Frequência"
                                    value={frequency}
                                    type='text'
                                    changeValue={setFrequency}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Aula"
                                    value={classValue}
                                    type='text'
                                    changeValue={setClassValue}
                                    required
                                />
                            </div>
                        </div>
                        <hr className="mt-3 mb-5 pb-3" style={{ borderColor: "#F4F5F6" }} />
                        <div className="grid grid-cols-12 gap-x-8">
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="CEP"
                                    value={zipCode}
                                    type='text'
                                    changeValue={setZipCode}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Estado"
                                    value={state}
                                    type='text'
                                    changeValue={setState}
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Cidade"
                                    value={city}
                                    type='text'
                                    changeValue={setCity}
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
                                    required
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                                <AuthInput
                                    label="Pais"
                                    value={country}
                                    type='text'
                                    changeValue={setCountry}
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
                    </Card>
                </div>
            </div >

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
        </PageDefault >
    )
}