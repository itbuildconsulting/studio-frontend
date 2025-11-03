'use client'

import AuthInput from "@/components/auth/AuthInput";
import Card from "@/components/Card/Card";
import { useEffect, useMemo, useState } from "react";
import LevelRepository from "../../../core/Level";
import Table from "@/components/Table/Table";
import { PaginationModel } from "@/types/pagination";
import pageDefault from "@/utils/pageDetault";
import styles from '../../styles/products.module.css';
import AuthSelect from "@/components/auth/AuthSelect";

interface LevelManagerProps {
  className?: string;
}

export default function LevelManager({ className = "" }: LevelManagerProps) {
  // Repositório de Níveis
  const repo = useMemo(() => new LevelRepository(), []);

  const [name, setName] = useState("");
  const [numberOfClasses, setNumberOfClasses] = useState(50);
  const [title, setTitle] = useState("");
  const [benefit, setBenefit] = useState("");
  const [color, setColor] = useState('1'); // Padrão verde
  const [antecedence, setAntecedence] = useState(0);
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
        
        // Limpar formulário
        setName("");
        setNumberOfClasses(50);
        setTitle("");
        setBenefit("");
        setColor('1');
        setAntecedence(0);
        
        // Recarregar lista
        handleListLevel(page);
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
      function: () => {
        // Limpar campos
        setName("");
        setNumberOfClasses(50);
        setTitle("");
        setBenefit("");
        setColor('1');
        setAntecedence(0);
      },
      class: "btn-outline-primary",
    },
    {
      name: "Salvar Leveis",
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
        setInfoPage(result?.pagination || pageDefault);
      }
    }).catch(() => {
      setListLevels([]);
      setLoading(false);
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

  const colorOptions = [
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
  ];

  return (
    <div className={className}>
      <Card title="Cadastrar Nível" hasFooter={true} eventsButton={eventButton} loading={loading}>
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        
        {successMessage && modalSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

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
              label="Número de Aulas (a partir de)"
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
              label="Cor"
              options={colorOptions}
              value={color}
              changeValue={setColor}
              required
              showColorIcon={true}
            />
          </div>
          <div className="col-span-12 sm:col-span-6 xl:col-span-4">
            <AuthInput
              label="Antecedência (dias)"
              value={antecedence}
              type="number"
              changeValue={setAntecedence}
              required
            />
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Níveis Cadastrados</h3>
          <Table
            data={listLevels}
            columns={columns}
            class={styles.table_locale_adm}
            loading={loading}
            setPage={setPage}
            infoPage={infoPage}
          />
        </div>
      </Card>
    </div>
  );
}