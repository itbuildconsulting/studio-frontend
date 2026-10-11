export type TurmaSlotType = {
  id?: number;
  diaSemana: number; // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sáb
  horarioInicio: string; // HH:mm
  horarioFim: string;    // HH:mm
};

export type TurmaType = {
  id?: number | null;
  name: string;
  teacherId: string | number | null;
  productTypeId: string | number | null;
  limit: number | null;
  active: boolean;
  slots: TurmaSlotType[];
  teacher?: string | null;
  productTypeName?: string | null;
};

export const DIAS_SEMANA = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda' },
  { value: 2, label: 'Terça' },
  { value: 3, label: 'Quarta' },
  { value: 4, label: 'Quinta' },
  { value: 5, label: 'Sexta' },
  { value: 6, label: 'Sábado' },
];

export const DIAS_SEMANA_ABREV = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
