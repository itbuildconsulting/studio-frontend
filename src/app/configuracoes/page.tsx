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

export default function Configuracao() {

  // Repositório de Níveis
  const repo = useMemo(() => new LevelRepository(), []);

  const [name, setName] = useState("");
  const [numberOfClasses, setNumberOfClasses] = useState(50);
  const [title, setTitle] = useState("");
  const [benefit, setBenefit] = useState("");
  const [color, setColor] = useState('1'); // Padrão verde
  const [antecedence, setAntecedence] = useState(0); // Novo estado para antecedência
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [log, setLog] = useState(0);

  const [listLevels, setListLevels] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [infoPage, setInfoPage] = useState<PaginationModel>(pageDefault);

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);

    // Validar se todos os campos obrigatórios estão preenchidos
    if (!name || !numberOfClasses || !title || !benefit || !color || !antecedence) {
      setErrorMessage("Todos os campos são obrigatórios!");
      setLoading(false);
      return; // Impede o envio caso algum campo esteja vazio
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

  const eventButton = [
    {
      name: "Cancelar",
      function: () => { },
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
  }

  useEffect(() => {
    handleListLevel(page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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

  return (
    <PageDefault title={"Configurações"}>
      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <Card title="Cadastrar Nível" hasFooter={true} eventsButton={eventButton} loading={loading}>
            <div className="grid grid-cols-12 gap-x-8">
              <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                <AuthInput
                  label="Nome do Nível"
                  value={name}
                  type="text"
                  changeValue={setName}
                  required
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                <AuthInput
                  label="Número de Aulas"
                  value={numberOfClasses}
                  type="number"
                  maxLength={14}
                  changeValue={setNumberOfClasses}
                  required
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                <AuthInput
                  label="Título"
                  value={title}
                  type="text"
                  maxLength={14}
                  changeValue={setTitle}
                  required
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                <AuthInput
                  label="Benefício"
                  value={benefit}
                  type="text"
                  maxLength={14}
                  changeValue={setBenefit}
                  required
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-4">
                <AuthSelect
                  label="Status"
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
                  label="Antecedência"
                  value={antecedence}
                  type="number"
                  changeValue={setAntecedence}
                  required
                />
              </div>
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
