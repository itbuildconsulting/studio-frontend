import React, { useState } from 'react';
import DatePicker from "react-multi-date-picker";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const CustomMultipleInput = ({ openCalendar, date, setValue, label }: any) => {
  const handleChange = (e: any) => {
    if (e.target.value.length <= 10) setValue(e.target.value);
  };

  return (
    <div className="flex flex-col mb-4">
      {label && <Label>{label}</Label>}
      <div className="relative">
        <input
          id="singleCalendarId"
          value={date ?? ''}
          placeholder="dd/mm/aaaa"
          autoComplete="off"
          onClick={openCalendar}
          onChange={handleChange}
          onKeyPress={(e) => !/[0-9/]/.test(e.key) && e.preventDefault()}
          className={cn(
            "flex h-10 w-full rounded-full border border-input bg-background px-3 py-2 pr-10 text-sm text-foreground",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "cursor-pointer"
          )}
        />
        {/* Calendar icon */}
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
        </span>
      </div>
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
  label = false,
}: any) => {
  const maxDate: any = new Date();
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  return (
    <DatePicker
      format="DD/MM/YYYY"
      weekDays={weekDays}
      months={months}
      calendarPosition="bottom"
      maxDate={disableFutureDates ? maxDate : undefined}
      minDate={disablePastDates ? maxDate : undefined}
      render={
        <CustomMultipleInput
          date={date}
          setValue={setValue}
          errors={errors}
          label={label}
          startTimeLocal={startTimeLocal}
        />
      }
      onChange={(e: any) =>
        setValue(new Date(e).toJSON().slice(0, 10).split('-').reverse().join('/'))
      }
      value={date}
    />
  );
};

export default SingleCalendar;
