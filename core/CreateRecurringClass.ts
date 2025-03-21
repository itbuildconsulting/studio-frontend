import { addWeeks, startOfYear, getDay, format } from 'date-fns';

// Função para gerar todas as datas que caem nos dias da semana especificados durante um ano
export const getDatesForWeekdays = (weekDays: string[], year: number, date2: string, weekNumbers: number): Date[] => {
  // Inicializa a data de início como 1º de janeiro do ano fornecido

    const resultDates: Date[] = [];
  
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
  
    // Para cada dia da semana fornecido
    weekDays.forEach(weekDay => {
      // Cria uma nova data de início para cada iteração

      // Separar a string em partes (dia, mês, ano)
        let [day, month, year2]: any = date2.split("/");

        // Reformatar para o formato "YYYY-MM-DD", que é interpretado corretamente
        let formattedDateString = `${year2}-${month}-${day}`;

        // Criar um objeto Date a partir da string reformulada
        let date = new Date(formattedDateString);
        console.log(date)
      
      
      const targetDay = weekDaysMap[weekDay]; // Converte o dia da semana para o número correspondente
      
      let dayOfWeek = getDay(date); // Pega o dia da semana de 1º de janeiro
      let daysToAdd = targetDay - dayOfWeek;
  
      if (daysToAdd < 0) {
        daysToAdd += 7; // Se o dia do ano for anterior ao 'weekDay', pula para a próxima semana
      }
  
      // Ajusta a data inicial para o primeiro 'weekDay' encontrado
      date.setDate(date.getDate() + daysToAdd);
  
      // Agora, avançamos para a próxima semana de acordo com o dia da semana desejado
      for (let i = 0; i < weekNumbers; i++) { // 104 semanas cobrem 2 anos
        resultDates.push(date);
        date = addWeeks(date, 1); // Avança para a próxima semana
      }
    });
  
     // Ordena as datas em ordem crescente
  resultDates.sort((a, b) => a.getTime() - b.getTime()); // Ordena as datas pelo valor de tempo

  return resultDates;
  };

