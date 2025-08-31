'use client'

import AuthInput from "@/components/auth/AuthInput";
import Card from "@/components/Card/Card";
import PageDefault from "@/components/template/default";
import { useEffect, useMemo, useState, useCallback, use } from "react";
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
import { ConfigSection } from "@/components/ConfigSection/ConfigSection";

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
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [log, setLog] = useState(0);

  const [listLevels, setListLevels] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [infoPage, setInfoPage] = useState<PaginationModel>(pageDefault);

  const [listLevelsConfig, setListLevelsConfig] = useState<string[]>([]);

  const [description, setDescription] = useState("");
  const [configKey, setConfigKey] = useState("");
  const [configValue, setConfigValue] = useState("");

  const [multiSelectValues, setMultiSelectValues] = useState<string[]>([]);

  const [productTypes, setProductTypes] = useState<{ label: string, value: string }[]>([]);

  const [appProductEnabled, setAppProductEnabled] = useState<boolean>(false);
  const [appCheckinEnabled, setAppCheckinEnabled] = useState<boolean>(false);
  const [appCancelClass, setAppCancelClass] = useState<boolean>(false);
  const [appCancelPurchase, setAppCancelPurchase] = useState<boolean>(false);
  const [appProductTypes, setAppProductTypes] = useState<number>(0);
  const [appCancelPurchaseValue, setAppCancelPurchaseValue] = useState<string>('');
  const [appCancelClassValue, setAppCancelClassValue] = useState<string>('');

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
        setModalMessage("Nível criado com sucesso!");
        // handleListLevel(page);
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
    setModalMessage(null);

    if(appCancelClass && !appCancelClassValue){
      setModalMessage("Favor preencher o Valor do campo 'Gerenciar Cancelamento de aula'!");
      setModalSuccess(true);
      setLoading(false);
      setLog(1);

      return;
    }
    
    if(appCancelPurchase && !appCancelPurchaseValue){
      setModalMessage("Favor preencher o Valor do campo 'Gerenciar Cancelamento de Compra'!");
      setModalSuccess(true);
      setLoading(false);
      setLog(1);

      return;
    }

    const upsertConfig = async (key: string, value: string) => {
      const existing: any = listLevelsConfig.find((elem: any) => elem.configKey === key);
      const promise = existing
        ? repoConfig?.edit(key, value, '', existing.id)
        : repoConfig?.create(key, value, '');

      const result: any = await promise;
      if (result instanceof Error) {
        const message: any = JSON.parse(result.message);
        throw new Error(message.message || 'Erro ao salvar configuração');
      }
    };


    try {
      if (appProductEnabled) {
        await upsertConfig('app_product', `${appProductTypes}`);
      } else {
        repoConfig?.delete('app_product');
      }

      if (appCheckinEnabled) {
        await upsertConfig('checkin_class', '');
      } else {
        repoConfig?.delete('checkin_class');
      }

      if (appCancelClass) {
        await upsertConfig('cancel_class', appCancelClassValue);
      } else {
        repoConfig?.delete('cancel_class');
      }

      if (appCancelPurchase) {
        await upsertConfig('pusrchase_class', appCancelPurchaseValue);
      } else {
        repoConfig?.delete('pusrchase_class');
      }

      setModalSuccess(true);
      setLoading(false);
      setModalMessage("Configurações salvas com sucesso!");
      setLog(0);

    } catch (error: any) {
      setModalMessage(error.message);
      setModalSuccess(true);
      setLoading(false);
      setLog(1);
      setTimeout(() => {
        setModalMessage(null);
      }, 2500);
      return;
    }
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

  const handleListLevel = (page: number) => {
    setLoading(true);

    /*repo.list(page).then((result: any) => {
      setLoading(false);

      if (result instanceof Error) {
        setListLevels([]);
      } else {
        setListLevels(result?.data);
      }
    }).catch(() => {
      setListLevels([]);
    });*/
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
  }, []);

  useEffect(() => {
    if (listLevelsConfig?.length > 0) {
      let app_product: any = listLevelsConfig.find((elem: any) => { return (elem.configKey === "app_product") });
      
      if (app_product) {
        setAppProductEnabled(true);
        setAppProductTypes(Number(app_product.configValue))
      }

      let checkin_class: any = listLevelsConfig.find((elem: any) => { return (elem.configKey === "checkin_class") });

      if (checkin_class) {
        setAppCheckinEnabled(true);
      }

      let cancel_class: any = listLevelsConfig.find((elem: any) => { return (elem.configKey === "cancel_class") });

      if (cancel_class) {
        setAppCancelClass(true);
        setAppCancelClassValue(cancel_class.configValue);
      }

      let pusrchase_class: any = listLevelsConfig.find((elem: any) => { return (elem.configKey === "pusrchase_class") });

      if (cancel_class) {
        setAppCancelPurchase(true);
        setAppCancelPurchaseValue(pusrchase_class.configValue);
      }

    }
  }, [listLevelsConfig]);

  useEffect(() => {
    repoDrop.dropdown('productTypes/dropdown').then((result) => {
      setProductTypes(result);
    });
  }, []);

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

        <h5 className="text-gray-700">{modalMessage}</h5>

        <button className="btn-outline-primary px-5 mt-5" onClick={() => handleClosed()}>
          Fechar
        </button>

      </div>
    )
  };

  useEffect(()=>{
    console.log(appProductTypes)
  },[appProductTypes])

  const handleToogleCheckin = (type: any) => {
    console.log(type)
    setAppCheckinEnabled(!appCheckinEnabled);
     // Criar a configuração
    repoConfig?.upsertConfig('checkinSpinGo', '', description, appCheckinEnabled === true ? 0 : 1).then((result: any) => {
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
        //setSuccessMessage("Configuração criada com sucesso!");
        //handleListLevel(page); // ou outra função para listar configs
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
    
  }

  return (
    <PageDefault title={"Configurações"}>

      <div className="grid grid-cols-12 mt-8 mb-8">
        <div className="col-span-12">
          <AccordionCard title="Configurações do Sistema">
            <ConfigSection
              label="Gerenciar Produtos do App Sping'Go"
              isEnabled={appProductEnabled}
              onToggleChange={setAppProductEnabled}
              inputType="select"
              selectOptions={convertArray(productTypes)}
              selectValue={appProductTypes}
              onSelectChange={(vals: number) => {
                setAppProductTypes(vals);
              }}
            />

            <ConfigSection
              label="Habilitar Checkin do App Sping'Go"
              isEnabled={appCheckinEnabled}
              onToggleChange={(e) => handleToogleCheckin(e)}
            />

            <ConfigSection
              label="Gerenciar Cancelamento de aula"
              isEnabled={appCancelClass}
              onToggleChange={setAppCancelClass}
              inputType="input"
              inputValue={appCancelClassValue}
              onInputChange={setAppCancelClassValue}
              placeholder={"Valor"}
            />

            <ConfigSection
              label="Gerenciar Cancelamento de Compra"
              isEnabled={appCancelPurchase}
              onToggleChange={setAppCancelPurchase}
              inputType="input"
              inputValue={appCancelPurchaseValue}
              onInputChange={setAppCancelPurchaseValue}
              placeholder={"Valor"}
            />

            <div className="flex justify-end mt-6">
              <button className="btn-primary" onClick={() => { handleSubmitConfig() }}>Salvar</button>
            </div>
          </AccordionCard>
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