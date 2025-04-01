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

export default function Configuracao() {

  // Repositório de Níveis
  const repo = useMemo(() => new LevelRepository(), []);

  const [name, setName] = useState("");
  const [numberOfClasses, setNumberOfClasses] = useState(50);
  const [title, setTitle] = useState("");
  const [benefit, setBenefit] = useState("");
  const [color, setColor] = useState("#00FF00"); // Padrão verde
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
        setErrorMessage(message.error);
        setLoading(false);
        setLog(1);
        setTimeout(() => {
          setErrorMessage(null);
        }, 2500);
      } else {
        // Se o nível foi criado com sucesso
        setModalSuccess(true);
        setLoading(false);
        setSuccessMessage("Nível criado com sucesso!");
        setLog(0);
      }
    }).catch((error) => {
      // Se houver erro na requisição
      setErrorMessage(error.message);
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
                    { value: "#00FF00", label: "Verde" },
                    { value: "#FFFF00", label: "Amarelo" },
                    { value: "#FFA500", label: "Laranja" },
                    { value: "#0000FF", label: "Azul" },
                    { value: "#A020F0", label: "Roxo" },
                    { value: "#FF0000", label: "Vermelho" },
                    { value: "#000000", label: "Preto" },
                    { value: "#FFFFFF #FF0000", label: "Branco e Vermelho" },
                    { value: "#000000 #FFFFFF", label: "Preto e Branco" },
                    { value: "#000000 #FF0000 #FFFFFF", label: "Preto / Vermelho / Branco" },
                  ]}
                  value={color}
                  changeValue={setColor}
                  required
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
    </PageDefault>
  );
}
