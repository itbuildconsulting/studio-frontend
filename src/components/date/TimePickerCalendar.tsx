import React from 'react';
import DatePicker from "react-multi-date-picker";
import TimePicker from 'react-multi-date-picker/plugins/time_picker';


const CustomMultipleInput = ({ openCalendar, value, date, setValue, errors, startTimeLocal, label }: any) => {
    date = value[0]?.length === 1 ? value : value[0];

    setValue(date || "");

    return (
        <>
            <div style={{ position: 'relative' }}>
                {label ? <label>{label}</label> : <></>}
                <input
                    className={`w-full px-4 py-2 rounded-md mt-1 border border-slate-400 bg-white focus: outline-none`}
                    value={date}
                    placeholder={"00:00"}
                    autoComplete='off'
                    onClick={openCalendar}
                    onChange={(e: any) => { if (e.target.value.length <= 10) { setValue(e.target.value) } }}
                />
                
            </div>
        </>
    )
}


const TimePickerCalendar = ({ date, setValue = () => { }, errors = undefined, startTimeLocal = undefined, disableFutureDates = false, disablePastDates = false, label = false }: any) => {

    return (
        <DatePicker
        disableDayPicker
        format="HH:mm"
        render={<CustomMultipleInput date={date} setValue={setValue} errors={errors} label={label}startTimeLocal={startTimeLocal} />}
        onChange={(e: any) => { setValue(new Date(e).toJSON().slice(0, 10).split('-').reverse().join('/')) }}
        plugins={[
            <TimePicker hideSeconds />
        ]} 
        />
    )
}

export default TimePickerCalendar;