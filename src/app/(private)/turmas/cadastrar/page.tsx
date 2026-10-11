"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageDefault from "@/components/template/default";
import Card from "@/components/Card/Card";
import AuthInput from "@/components/auth/AuthInput";
import AuthSelect from "@/components/auth/AuthSelect";
import Modal from "@/components/Modal/Modal";
import Loading from "@/components/loading/Loading";
import { ValidationForm } from "@/components/formValidation/validation";
import { EventBtn } from "@/types/btn";
import { convertArray, convertArrayType } from "@/utils/convertArray";
import { DIAS_SEMANA, TurmaSlotType } from "@/types/turmas";
import TurmasRepository from "../../../../../core/Turmas";
import DropDownsCollection from "../../../../../core/DropDowns";

const TIMES = Array.from({ length: 28 }, (_, i) => {
  const h = Math.floor(i / 2) + 6;
  const m = i % 2 === 0 ? "00" : "30";
  const value = `${String(h).padStart(2, "0")}:${m}`;
  return { value, label: value };
});

function SlotRow({
  slot, index, onUpdate, onRemove, showRemove,
}: {
  slot: TurmaSlotType;
  index: number;
  onUpdate: (index: number, field: keyof TurmaSlotType, value: any) => void;
  onRemove: (index: number) => void;
  showRemove: boolean;
}) {
  return (
    <div className="grid grid-cols-12 gap-x-4 items-end mb-2">
      <div className="col-span-5">
        <AuthSelect
          label={index === 0 ? "Dia da semana*" : ""}
          value={slot.diaSemana}
          options={DIAS_SEMANA}
          changeValue={(v) => onUpdate(index, "diaSemana", Number(v))}
        />
      </div>
      <div className="col-span-3">
        <AuthSelect
          label={index === 0 ? "Início*" : ""}
          value={slot.horarioInicio}
          options={TIMES}
          changeValue={(v) => onUpdate(index, "horarioInicio", v)}
        />
      </div>
      <div className="col-span-3">
        <AuthSelect
          label={index === 0 ? "Fim*" : ""}
          value={slot.horarioFim}
          options={TIMES}
          changeValue={(v) => onUpdate(index, "horarioFim", v)}
        />
      </div>
      <div className="col-span-1 flex justify-center pb-3">
        {showRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="h-8 w-8 rounded-full border border-border text-destructive hover:bg-destructive/10 flex items-center justify-center text-lg leading-none transition-colors"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export default function CadastrarTurma() {
  const repo = useMemo(() => new TurmasRepository(), []);
  const repoDrop = useMemo(() => new DropDownsCollection(), []);
  const router = useRouter();

  const [name, setName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [productTypeId, setProductTypeId] = useState("");
  const [limit, setLimit] = useState<number | null>(null);
  const [slots, setSlots] = useState<TurmaSlotType[]>([
    { diaSemana: 1, horarioInicio: "08:00", horarioFim: "09:00" },
  ]);

  const [dropdownTeacher, setDropdownTeacher] = useState<any[]>([]);
  const [dropdownType, setDropdownType] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [log, setLog] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    repoDrop.dropdown("persons/employee/dropdown").then(setDropdownTeacher);
    repoDrop.dropdown("productTypes/dropdown").then(setDropdownType);
  }, []);

  const updateSlot = (index: number, field: keyof TurmaSlotType, value: any) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const addSlot = () => {
    setSlots((prev) => [...prev, { diaSemana: 1, horarioInicio: "08:00", horarioFim: "09:00" }]);
  };

  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!name) return setErrorMessage("Nome é obrigatório.");
    if (!teacherId) return setErrorMessage("Professor é obrigatório.");
    if (!productTypeId) return setErrorMessage("Tipo de produto é obrigatório.");
    if (!limit || limit <= 0) return setErrorMessage("Limite de alunos é obrigatório.");

    setLoading(true);
    setErrorMessage(null);

    repo.create({ name, teacherId, productTypeId, limit, active: true, slots }).then((result: any) => {
      setLoading(false);
      if (result instanceof Error) {
        try {
          const msg = JSON.parse(result.message);
          setErrorMessage(msg.message || msg.error || "Erro ao cadastrar turma.");
        } catch {
          setErrorMessage("Erro ao cadastrar turma.");
        }
        setLog(1);
        setModalOpen(true);
      } else {
        setLog(0);
        setSuccessMessage("Turma cadastrada com sucesso!");
        setModalOpen(true);
      }
    });
  };

  const handleClosed = () => {
    if (log === 0) {
      router.push("/turmas");
    } else {
      setModalOpen(false);
    }
  };

  const eventButton: EventBtn[] = [
    { name: "Cancelar", function: () => router.push("/turmas"), class: "btn-outline-primary" },
    { name: "Cadastrar", function: handleSubmit, class: "btn-primary" },
  ];

  return (
    <PageDefault title="Cadastrar Turma">
      <div className="grid grid-cols-12">
        <div className="col-span-12">
          <Card hasFooter eventsButton={eventButton} loading={loading}>
            <div className="grid grid-cols-12 gap-x-8">
              <div className="col-span-12 md:col-span-7">
                <div className="grid grid-cols-12 gap-x-4 mb-4">
                  <div className="col-span-12">
                    <AuthInput label="Nome da turma*" value={name} type="text" changeValue={setName} />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-x-4 mb-4">
                  <div className="col-span-12 sm:col-span-6">
                    <AuthSelect
                      label="Professor*"
                      value={teacherId}
                      options={convertArray(dropdownTeacher)}
                      changeValue={setTeacherId}
                    />
                  </div>
                  <div className="col-span-12 sm:col-span-6">
                    <AuthSelect
                      label="Tipo de Produto*"
                      value={productTypeId}
                      options={convertArrayType(dropdownType)}
                      changeValue={setProductTypeId}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-x-4 mb-6">
                  <div className="col-span-12 sm:col-span-4">
                    <AuthInput
                      label="Limite de alunos*"
                      value={limit}
                      type="number"
                      changeValue={setLimit}
                    />
                  </div>
                </div>

                <hr className="mb-5" style={{ borderColor: "#F4F5F6" }} />

                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Horários
                </p>

                {slots.map((slot, i) => (
                  <SlotRow
                    key={i}
                    slot={slot}
                    index={i}
                    onUpdate={updateSlot}
                    onRemove={removeSlot}
                    showRemove={slots.length > 1}
                  />
                ))}

                <button
                  type="button"
                  onClick={addSlot}
                  className="mt-2 text-sm text-primary hover:underline flex items-center gap-1"
                >
                  <span className="text-lg leading-none">+</span> Adicionar horário
                </button>

                <div className="mt-4">
                  <ValidationForm errorMessage={errorMessage} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Modal btnClose={false} showModal={modalOpen} setShowModal={setModalOpen} isModalStatus>
        <div className="rounded-lg bg-white w-full py-10 px-10 flex flex-col m-auto">
          {loading ? (
            <div className="flex flex-col items-center gap-4">
              <Loading />
              <h5>Carregando...</h5>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              {log === 0 ? (
                <svg className="mt-4 pb-2" width="135" height="135" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="var(--primary)">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="mt-4 pb-2" width="135" height="135" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="var(--primary)">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              )}
              <h5 className="text-gray-700">{log === 0 ? successMessage : errorMessage}</h5>
              <button className="btn-outline-primary px-5 mt-5" onClick={handleClosed}>
                Fechar
              </button>
            </div>
          )}
        </div>
      </Modal>
    </PageDefault>
  );
}
