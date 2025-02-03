// Função para gerar todas as datas que caem no dia da semana especificado durante um ano
// No arquivo onde a função é definida
import { addWeeks, startOfYear, isSameDay, format, getDay } from 'date-fns';

// Função para gerar todas as datas que caem no dia da semana especificado durante um ano
export const getDatesForWeekday = (weekDay: string, year: number): Date[] => {
  // Inicializa a data de início como 1º de janeiro do ano fornecido
  let currentDate = startOfYear(new Date(year, 0, 1)); // 1º de janeiro do ano
  
  // Mapeia os dias da semana para números (0 - Sunday, 1 - Monday, ..., 6 - Saturday)
  const weekDaysMap: any = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  const targetDay: any = weekDaysMap[weekDay]; // Converte o dia da semana para o número correspondente
  
  // Ajusta a data para o primeiro dia do ano que corresponde ao 'weekDay'
  let dayOfWeek = getDay(currentDate);
  let daysToAdd = targetDay - dayOfWeek;
  if (daysToAdd <= 0) {
    daysToAdd += 7; // Se o dia do ano for anterior ao 'weekDay', pula para a próxima semana
  }
  
  currentDate = addWeeks(currentDate, 0); // Ajusta a data para o primeiro dia da semana correspondente
  
  // Avança até o primeiro dia desejado da semana
  currentDate.setDate(currentDate.getDate() + daysToAdd); 

  const resultDates: Date[] = [];
  // Itera sobre as semanas do ano (52 semanas)
  for (let i = 0; i < 104; i++) {
    resultDates.push(currentDate);
    
    // Avança para a próxima semana
    currentDate = addWeeks(currentDate, 1);
  }

  return resultDates;
};



