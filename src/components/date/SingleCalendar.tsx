import React from 'react';
import DatePicker from "react-multi-date-picker";
import Icon from "react-multi-date-picker/components/icon"

const CustomMultipleInput = ({ openCalendar, value, date, setValue, errors, startTimeLocal }: any) => {

    setValue(date);

    return (
        <>
            <div style={{ position: 'relative' }}>

                <input
                    className={`w-full px-4 py-2 rounded-md mt-1 border border-slate-400 bg-white focus: outline-none`}
                    //onFocus={openCalendar}
                    value={date}
                    id={'singleCalendarId'}
                    placeholder={"dd/mm/aaaa"}
                    autoComplete='off'
                    onChange={(e: any) => { if (e.target.value.length <= 10) { setValue(e.target.value) } }}
                    //onPaste={(e: any) => {console.log(e)}}
                    onKeyPress={(e) => !/[0-9/]/.test(e.key) && e.preventDefault()}
                />
                <Icon onClick={openCalendar} style={{ position: 'absolute', top: '8px', right: '5px' }} />
            </div>
        </>
    )
}

const SingleCalendar = ({ date, setValue = () => { }, errors = undefined, startTimeLocal = undefined, disableFutureDates = false, disablePastDates = false }: any) => {
    const maxDate: any = new Date();

    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ];
    return (
        <DatePicker
            format={"DD/MM/YYYY"}
            weekDays={weekDays}
            months={months}
            calendarPosition={`top`}
            maxDate={disableFutureDates === true ? maxDate : ''}
            minDate={disablePastDates === true ? maxDate : ''}
            render={<CustomMultipleInput date={date} setValue={setValue} errors={errors} startTimeLocal={startTimeLocal} />}
            onChange={(e: any) => { setValue(new Date(e).toJSON().slice(0, 10).split('-').reverse().join('/')) }}
        />
    )
}

export default SingleCalendar;