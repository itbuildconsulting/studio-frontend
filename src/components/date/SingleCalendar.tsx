import React from 'react';
import DatePicker from "react-multi-date-picker";
import Icon from "react-multi-date-picker/components/icon"

const CustomMultipleInput = ({ openCalendar, value, date, setValue, errors, startTimeLocal, label }: any) => {

    setValue(date);

    return (
        <>
            <div style={{ position: 'relative' }}>
                {label ? <label>{label}</label> : <></>}
                <input
                    className={`w-full px-4 py-2 rounded-md mt-1 border border-slate-400 bg-white focus: outline-none`}
                    value={date}
                    id={'singleCalendarId'}
                    placeholder={"dd/mm/aaaa"}
                    autoComplete='off'
                    onClick={openCalendar} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.value.length <= 10) { setValue(e.target.value) } }}
                    onKeyPress={(e) => !/[0-9/]/.test(e.key) && e.preventDefault()}
                />
                <Icon style={{ position: 'absolute', top: 'calc((120px - 40px)/2)', right: '1rem' }} />
            </div>
        </>
    )
}

const SingleCalendar = ({ date, setValue = () => { }, errors = undefined, startTimeLocal = undefined, disableFutureDates = false, disablePastDates = false, label = false }: any) => {
    const maxDate: Date = new Date();
    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    return (
        <DatePicker
            format={"DD/MM/YYYY"}
            weekDays={weekDays}
            months={months}
            calendarPosition={`bottom`}
            maxDate={disableFutureDates === true ? maxDate : ''}
            minDate={disablePastDates === true ? maxDate : ''}
            render={<CustomMultipleInput date={date} setValue={setValue} errors={errors} label={label}startTimeLocal={startTimeLocal} />}
            onChange={(e: any) => {
                const date: Date = new Date(`${e.target.value}`); 
                setValue(date.toJSON().slice(0, 10).split('-').reverse().join('/'));
            }}
        />
    )
}

export default SingleCalendar;