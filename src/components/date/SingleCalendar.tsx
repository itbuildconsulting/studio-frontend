import React, { useState } from 'react';
import DatePicker from "react-multi-date-picker";
import Icon from "react-multi-date-picker/components/icon";

const CustomMultipleInput = ({ openCalendar, value, date, setValue, errors, startTimeLocal, label }: any) => {

    // Quando o valor do input mudar, atualiza o estado com o novo valor da data
    const handleChange = (e: any) => {
        if (e.target.value.length <= 10) {
            setValue(e.target.value); // Atualiza o valor da data
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            {label && <label>{label}</label>}
            <input
                className="w-full px-4 py-2 rounded-md mt-1 border border-slate-400 bg-white focus:outline-none"
                //value={date} 
                value={date ?? ''} // Exibe o valor atual da data
                id={'singleCalendarId'}
                placeholder="dd/mm/aaaa"
                autoComplete="off"
                onClick={openCalendar}  // Abre o calendário quando clicado
                onChange={handleChange}
                onKeyPress={(e) => !/[0-9/]/.test(e.key) && e.preventDefault()} // Apenas números e '/' permitidos
            />
            <Icon style={{ position: 'absolute', top: 'calc((120px - 40px) / 2)', right: '1rem' }} />
        </div>
    );
};

const SingleCalendar = ({
    date,
    setValue = () => {},
    errors = undefined,
    startTimeLocal = undefined,
    disableFutureDates = false,
    disablePastDates = false,
    label = false
}: any) => {

    const [calendarOpen, setCalendarOpen] = useState(false);  // Estado para controlar se o calendário está aberto ou não
    const maxDate: any = new Date();

    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    return (
        <DatePicker
            format={"DD/MM/YYYY"}
            weekDays={weekDays}
            months={months}
            calendarPosition="bottom"
            maxDate={disableFutureDates ? maxDate : undefined}  // Desabilita datas futuras
            minDate={disablePastDates ? maxDate : undefined}    // Desabilita datas passadas
            render={<CustomMultipleInput date={date} setValue={setValue} errors={errors} label={label} startTimeLocal={startTimeLocal} openCalendar={() => setCalendarOpen(!calendarOpen)} />}
            onChange={(e: any) => setValue(new Date(e).toJSON().slice(0, 10).split('-').reverse().join('/'))}
            value={date} // Passa o valor para o DatePicker
            //onBlur={() => setCalendarOpen(false)} // Fecha o calendário quando o campo perde foco
        />
    );
};

export default SingleCalendar;
