'use client'

import AuthInput from "@/components/auth/AuthInput";
import Card from "@/components/Card/Card";
import Modal from "@/components/Modal/Modal";
import { useEffect, useMemo, useState } from "react";
import LevelRepository from "../../../core/Level";
import Table from "@/components/Table/Table";
import { PaginationModel } from "@/types/pagination";
import pageDefault from "@/utils/pageDetault";
import styles from '../../styles/products.module.css';
import AuthSelect from "@/components/auth/AuthSelect";
import DropDown from "@/components/dropdown/DropDown";
import Link from "next/link";
import Loading from "@/components/loading/Loading";
import { ValidationForm } from "@/components/formValidation/validation";
import ValidationFields from "@/validators/fields";

interface LevelManagerProps {
  className?: string;
}

export default function LevelManager({ className = "" }: LevelManagerProps) {
  const repo = useMemo(() => new LevelRepository(), []);

  const [modalLevelAdd, setModalLevelAdd] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [numberOfClasses, setNumberOfClasses] = useState(50);
  const [title, setTitle] = useState("");
  const [benefit, setBenefit] = useState("");
  const [color, setColor] = useState('1');
  const [antecedence, setAntecedence] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [log, setLog] = useState(0);
  const [edit, setEdit] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [listLevels, setListLevels] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [infoPage, setInfoPage] = useState<PaginationModel>(pageDefault);

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

  const actionButtonLevel = (cell: any, row: any) => {
    return (
      <DropDown style={'bg-white'}>
        <>...</>
        <Link href={"#"} onClick={() => handleEdit(row)}>
          Editar
        </Link>
        <Link href={'#'} onClick={() => handleDeleteConfirm(row.id)}>
          Excluir
        </Link>
      </DropDown>
    )
  }

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
    {
      dataField: 'id',
      text: '',
      formatter: actionButtonLevel
    }
  ];

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);

    const validationError = ValidationFields({ 
      "Nome": name,
      "Número de Aulas": `${numberOfClasses}`,
      "Título": title,
      "Benefício": benefit,
      "Cor": color,
      "Antecedência": `${antecedence}`
    });

    if (validationError) {
      setErrorMessage(validationError);
      setLoading(false);
      return;
    }

    if (numberOfClasses && numberOfClasses < 0) {
      setErrorMessage('Número de aulas deve ser maior que zero');
      setLoading(false);
      return;
    }

    if (antecedence && antecedence < 0) {
      setErrorMessage('Antecedência deve ser maior ou igual a zero');
      setLoading(false);
      return;
    }

    const action = edit 
      ? repo?.edit(id!, name, numberOfClasses, title, benefit, color, antecedence)
      : repo?.create(name, numberOfClasses, title, benefit, color, antecedence);

    action.then((result: any) => {
      if (result instanceof Error) {
        const message: any = JSON.parse(result.message);
        setErrorMessage(message.error);
        setLoading(false);
        setLog(1);
        setTimeout(() => {
          setErrorMessage(null);
        }, 2500);
      } else {
        setModalLevelAdd(false);
        setSuccessMessage(edit ? "Nível atualizado com sucesso!" : "Nível criado com sucesso!");
        setModalSuccess(true);
        setLoading(false);
        setLog(0);
        resetForm();
        handleListLevel(page);
      }
    }).catch((error) => {
      setErrorMessage(error.message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 2500);
      setLog(1);
      setLoading(false);
    });
  };

  const handleEdit = (row: any) => {
    setEdit(true);
    setId(row.id);
    setName(row.name);
    setNumberOfClasses(row.numberOfClasses);
    setTitle(row.title);
    setBenefit(row.benefit);
    setColor(row.color || '1');
    setAntecedence(row.antecedence);
    setModalLevelAdd(true);
  };

  const handleDeleteConfirm = (levelId: number) => {
    setDeleteId(levelId);
    setModalDelete(true);
  };

  const handleDelete = () => {
    if (!deleteId) return;

    setLoading(true);
    repo?.delete(deleteId).then((result: any) => {
      if (result instanceof Error) {
        const message: any = JSON.parse(result.message);
        setErrorMessage(message.error);
        setLoading(false);
        setLog(1);
      } else {
        setSuccessMessage("Nível excluído com sucesso!");
        setModalDelete(false);
        setDeleteId(null);
        setModalSuccess(true);
        setLoading(false);
        setLog(0);
        handleListLevel(page);
      }
    }).catch((error: any) => {
      setErrorMessage(error.message);
      setLog(1);
      setLoading(false);
    });
  };

  const resetForm = () => {
    setEdit(false);
    setId(null);
    setName("");
    setNumberOfClasses(50);
    setTitle("");
    setBenefit("");
    setColor('1');
    setAntecedence(0);
  };

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
  }, [page]);

  useEffect(() => {
    if (!modalLevelAdd) {
      resetForm();
    }
  }, [modalLevelAdd]);

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
    <div className={className}>
      {/* Card Principal com Tabela */}
      <Card
        title="Gerenciar Níveis"
        hasButton={true}
        setShowModal={setModalLevelAdd}
      >
        <Table
          data={listLevels}
          columns={columns}
          class={styles.table_locale_adm}
          loading={loading}
          setPage={setPage}
          infoPage={infoPage}
        />
      </Card>

      {/* Modal Adicionar/Editar */}
      <Modal
        title={edit ? "Editar Nível" : "Adicionar Nível"}
        btnClose={true}
        setShowModal={setModalLevelAdd}
        showModal={modalLevelAdd}
        hasFooter={true}
        onSubmit={handleSubmit}
        loading={loading}
        edit={edit}
      >
        <div className="grid grid-cols-12 gap-x-6 gap-y-4">
          <div className="col-span-12 sm:col-span-6">
            <AuthInput
              label="Nome do Nível*"
              value={name}
              type="text"
              changeValue={setName}
              edit={edit}
              placeholder="Ex: Iniciante, Intermediário, Avançado"
              required
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <AuthInput
              label="Número de Aulas (a partir de)*"
              value={numberOfClasses}
              type="number"
              changeValue={setNumberOfClasses}
              edit={edit}
              placeholder="Ex: 50, 100, 200"
              required
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <AuthInput
              label="Título*"
              value={title}
              type="text"
              changeValue={setTitle}
              edit={edit}
              placeholder="Ex: SPIN'GO ROOKIE"
              required
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <AuthInput
              label="Antecedência (dias)*"
              value={antecedence}
              type="number"
              changeValue={setAntecedence}
              edit={edit}
              placeholder="Ex: 0, 1, 3, 7"
              required
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <AuthInput
              label="Benefício*"
              value={benefit}
              type="text"
              changeValue={setBenefit}
              edit={edit}
              placeholder="Ex: Agende com 7 dias de antecedência"
              required
            />
          </div>

          <div className="col-span-12 sm:col-span-6">
            <AuthSelect
              label="Cor*"
              options={colorOptions}
              value={color}
              changeValue={setColor}
              edit={edit}
              required
              showColorIcon={true}
            />
          </div>

          <ValidationForm errorMessage={errorMessage} />
        </div>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        title="Confirmar Exclusão"
        btnClose={true}
        setShowModal={setModalDelete}
        showModal={modalDelete}
        hasFooter={false}
      >
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tem certeza?</h3>
              <p className="text-sm text-gray-600">Esta ação não pode ser desfeita.</p>
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-6">
            Ao excluir este nível, ele será removido permanentemente do sistema. 
            Alunos que possuem este nível podem ser afetados.
          </p>

          <div className="flex gap-3 justify-end">
            <button 
              onClick={() => setModalDelete(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Excluindo...' : 'Sim, excluir'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Sucesso/Erro */}
      <Modal
        btnClose={false}
        showModal={modalSuccess}
        setShowModal={setModalSuccess}
        hrefClose={''}
        isModalStatus={true}
      >
        <div className={`rounded-lg bg-white w-full py-10 px-10 flex flex-col m-auto`}>
          {loading ? <LoadingStatus /> : <SuccessStatus />}
        </div>
      </Modal>
    </div>
  );
}