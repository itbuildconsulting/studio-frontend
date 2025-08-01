'use client'

import AuthInput from "@/components/auth/AuthInput";
import Card from "@/components/Card/Card";
import PageDefault from "@/components/template/default";
import { useEffect, useMemo, useState } from "react";
import LevelRepository from "../../../core/Level";
import Table from "@/components/Table/Table";
import { PaginationModel } from "@/types/pagination";
import pageDefault from "@/utils/pageDetault";
import styles from '../../styles/products.module.css';
import AuthSelect from "@/components/auth/AuthSelect";
import Modal from "@/components/Modal/Modal";
import Loading from "@/components/loading/Loading";
import AccordionCard from "@/components/Card/AccordionCard";
import configRepository from "../../../core/Config";
import DropDownsCollection from "../../../core/DropDowns";
import AuthSelectMulti from "@/components/auth/AuthSelectMulti";
import { convertArray } from "@/utils/convertArray";
import ValidationFields from "@/validators/fields";
import { ValidationForm } from "@/components/formValidation/validation";

export default function Configuracao() {

  // Repositório de Níveis
  const repo = useMemo(() => new LevelRepository(), []);
  const repoConfig = useMemo(() => new configRepository(), []);
  const repoDrop = useMemo(() => new DropDownsCollection(), []);

  const [name, setName] = useState("");
  const [numberOfClasses, setNumberOfClasses] = useState(50);
  const [title, setTitle] = useState("");
  const [benefit, setBenefit] = useState("");
  const [color, setColor] = useState('1'); // Padrão verde
  const [antecedence, setAntecedence] = useState(0); // Novo estado para antecedência
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorMessageConfig, setErrorMessageConfig] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [log, setLog] = useState(0);

  const [listLevels, setListLevels] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [infoPage, setInfoPage] = useState<PaginationModel>(pageDefault);

  const [listLevelsConfig, setListLevelsConfig] = useState<string[]>([]);
  const [pageConfig, setPageConfig] = useState<number>(1);
  const [infoPageConfig, setInfoPageConfig] = useState<PaginationModel>(pageDefault);

  const [description, setDescription] = useState("");
  const [configKey, setConfigKey] = useState("");
  const [configValue, setConfigValue] = useState("");

  const [multiSelectValues, setMultiSelectValues] = useState<string[]>([]);

  const [productTypes, setProductTypes] = useState<{ label: string, value: string }[]>([]);

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);

    const validationError = ValidationFields({
      "Nome do Nível": name,
      "Número de Aulas": `${numberOfClasses}`,
      "Título": title,
      "Benefício": benefit,
      "Status": color,
      "Antecedência": `${antecedence}`,
    });

    if (validationError) {
      setErrorMessage(validationError);
      setLoading(false);
      return;
    }

    // Dados a serem enviados para o backend
    const data = {
      name,
      numberOfClasses,
      title,
      benefit,
      color,
      antecedence,
    };

    // Usando o repositório para criar o nível
    repo?.create(name, numberOfClasses, title, benefit, color, antecedence).then((result: any) => {
      if (result instanceof Error) {
        // Se ocorrer um erro
        const message: any = JSON.parse(result.message);
        setErrorMessage(message.message);
        setLoading(false);
        setModalSuccess(true);
        setLog(1);
        setTimeout(() => {
          setErrorMessage(null);
        }, 2500);
      } else {  
        // Se o nível foi criado com sucesso
        setModalSuccess(true);
        setLoading(false);
        setSuccessMessage("Nível criado com sucesso!");
        handleListLevel(page);
        setLog(0);
      }
    }).catch((error) => {
      // Se houver erro na requisição
      setErrorMessage(error.message);
      setModalSuccess(true);
      setLoading(false);
      setTimeout(() => {
        setErrorMessage(null);
      }, 2500);
      setLog(1);
      setLoading(false);
    });
  };

  const handleSubmitConfig = async () => {
    setLoading(true);
    setErrorMessageConfig(null);

    const validationError = ValidationFields({
      "Chaves de Configurações": configKey,
      "Descrição": description,
      "Produtos Permitidos": configKey !== 'app_product' || multiSelectValues.length > 0 ? 'passou' : '',
      "Valor": configKey === 'app_product' ? 'passou' : configValue
    });

    if (validationError) {
      setErrorMessageConfig(validationError);
      setLoading(false);
      return;
    }

    // Criar a configuração
    repoConfig?.create(configKey, configValue, description).then((result: any) => {
      if (result instanceof Error) {
        const message: any = JSON.parse(result.message);
        setErrorMessageConfig(message.message);
        setLoading(false);
        setModalSuccess(true);
        setLog(1);
        setTimeout(() => {
          setErrorMessageConfig(null);
        }, 2500);
      } else {
        setModalSuccess(true);
        setLoading(false);
        setSuccessMessage("Configuração criada com sucesso!");
        handleListLevel(page); // ou outra função para listar configs
        setLog(0);
      }
    }).catch((error) => {
      setErrorMessageConfig(error.message);
      setModalSuccess(true);
      setLoading(false);
      setTimeout(() => {
        setErrorMessageConfig(null);
      }, 2500);
      setLog(1);
      setLoading(false);
    });
  };

  const eventButton = [
    {
      name: "Cancelar",
      function: () => {

      },
      class: "btn-outline-primary",
    },
    {
      name: "Finalizar",
      function: handleSubmit,
      class: "btn-primary",
    },
  ];

  const eventHandle = [
    {
      name: "Cancelar",
      function: () => {
        setConfigKey("")
        setConfigValue("")
        setDescription("")
      },
      class: "btn-outline-primary",
    },
    {
      name: "Cadastrar",
      function: handleSubmitConfig,
      class: "btn-primary",
    },
  ];

  const handleListLevel = (page: number) => {
    setLoading(true);

    repo.list(page).then((result: any) => {
      setLoading(false);

      if (result instanceof Error) {
        setListLevels([]);
      } else {
        setListLevels(result?.data);
      }
    }).catch(() => {
      setListLevels([]);
    });

    repoConfig.list().then((result: any) => {
      setLoading(false);

      if (result instanceof Error) {
        setListLevelsConfig([]);
      } else {
        setListLevelsConfig(result?.data);
      }
    }).catch(() => {
      setListLevelsConfig([]);
    });


  }

  useEffect(() => {
    handleListLevel(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (configKey === 'app_product') {
      repoDrop.dropdown('productTypes/dropdown').then((result) => {
        setProductTypes(result);
      });
    }
  }, [configKey]);

  const changeValueSelect = (configKey: string): void => {
    setConfigKey(configKey);

    if (configKey === 'app_product') {
      repoDrop.dropdown('productTypes/dropdown').then((result) => {
        setProductTypes(result);
      });
    }
  };

  const columns = [
    {
      dataField: 'name',
      text: `Nome`,
    },
    {
      dataField: 'numberOfClasses',
      text: `Número de Aulas`,
    },
    {
      dataField: 'title',
      text: `Título`,
    },
    {
      dataField: 'benefit',
      text: `Benefício`,
    },
    {
      dataField: 'antecedence',
      text: `Antecedência de Aulas`,
    },

  ];

  const columnsConfig = [
    {
      dataField: 'id',
      text: `ID`,
    },
    {
      dataField: 'configKey',
      text: `Chaves de Configuração`,
    },
    {
      dataField: 'configValue',
      text: `Valor`,
    },
    {
      dataField: 'description',
      text: `Descrição`,
    }
  ];

  const handleClosed = () => {
    setModalSuccess(false);
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

  return (
    <PageDefault title={"Configurações"}>

      <div className="grid grid-cols-12 mt-8 mb-8">
        <div className="col-span-12">
          <AccordionCard title="Configurações do Sistema" hasFooter={true} eventsButton={eventHandle}>
            <div className="grid grid-cols-12 gap-x-8">
              <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                <AuthSelect
                  label="Chaves de Configurações*"
                  options={[
                    { value: 'app_product', label: "Produtos do App Sping'Go" },
                    { value: 'cancel_class', label: "Cancelamento de Aula" },
                    { value: 'pusrchase_class', label: "Cancelamento de Compra" },
                  ]}
                  value={configKey}
                  changeValue={(e) => changeValueSelect(e)}
                  required
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                <AuthInput
                  label="Descrição*"
                  value={description}
                  type="text"
                  changeValue={setDescription}
                  required
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                {configKey === 'app_product' && productTypes.length > 0 ? (
                  <AuthSelectMulti
                    label="Produtos Permitidos*"
                    value={multiSelectValues}
                    options={convertArray(productTypes)}
                    changeValue={(vals: string[]) => {
                      setMultiSelectValues(vals);
                      setConfigValue(vals.join(','));
                    }}
                  />
                ) : (
                  <AuthInput
                    label="Valor*"
                    value={configValue}
                    type="text"
                    changeValue={setConfigValue}
                    required
                  />
                )}
              </div>
              <ValidationForm errorMessage={errorMessageConfig} />
            </div>

            <div className="col-span-12">
              <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                <Table
                  data={listLevelsConfig}
                  columns={columnsConfig}
                  class={styles.table_locale_adm}
                  loading={loading}
                  setPage={setPage}
                  infoPage={infoPage}
                />
              </div>
            </div>
          </AccordionCard>
        </div>
      </div>


      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <Card title="Cadastrar Nível" hasFooter={true} eventsButton={eventButton} loading={loading}>
            <div className="grid grid-cols-12 gap-x-8">
              <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                <AuthInput
                  label="Nome do Nível*"
                  value={name}
                  type="text"
                  changeValue={setName}
                  required
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                <AuthInput
                  label="Número de Aulas*"
                  value={numberOfClasses}
                  type="number"
                  maxLength={14}
                  changeValue={setNumberOfClasses}
                  maskType="positivo"
                  required
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                <AuthInput
                  label="Título*"
                  value={title}
                  type="text"
                  maxLength={14}
                  changeValue={setTitle}
                  required
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                <AuthInput
                  label="Benefício*"
                  value={benefit}
                  type="text"
                  maxLength={14}
                  changeValue={setBenefit}
                  required
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                <AuthSelect
                  label="Status*"
                  options={[
                    { value: '1', colors: "#00FF00", label: "Verde" },
                    { value: '2', colors: "#FFFF00", label: "Amarelo" },
                    { value: '3', colors: "#FFA500", label: "Laranja" },
                    { value: '4', colors: "#0000FF", label: "Azul" },
                    { value: '5', colors: "#A020F0", label: "Roxo" },
                    { value: '6', colors: "#FF0000", label: "Vermelho" },
                    { value: '7', colors: "#000000", label: "Preto" },
                    { value: '8', colors: "#FFFFFF #FF0000", label: "Branco e Vermelho" },
                    { value: '9', colors: "#000000 #FFFFFF", label: "Preto e Branco" },
                    { value: '10', colors: "#000000 #FF0000 #FFFFFF", label: "Preto / Vermelho / Branco" },
                  ]}
                  value={color}
                  changeValue={setColor}
                  required
                  showColorIcon={true}
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                <AuthInput
                  label="Antecedência*"
                  value={antecedence}
                  type="number"
                  changeValue={setAntecedence}
                  required
                  maskType="positivo"
                />
              </div>
              <ValidationForm errorMessage={errorMessage} />
            </div>



          </Card>

          <Card>
            <Table
              data={listLevels}
              columns={columns}
              class={styles.table_locale_adm}
              loading={loading}
              setPage={setPage}
              infoPage={infoPage}
            />
          </Card>
        </div>
      </div>



      <Modal
        btnClose={false}
        showModal={modalSuccess}
        setShowModal={setModalSuccess}
        hrefClose={'/proprietarios'}
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
  );
}
