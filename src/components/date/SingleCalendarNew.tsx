import DatePicker from "react-multi-date-picker"

export default function Example() {
  return (
    <DatePicker
      multiple
      render={<CustomMultipleInput onFocus={undefined} value={undefined} />}
    />
  )
}

function CustomMultipleInput({onFocus, value, label, date, setValue,}: any) {
  return (
    <input
      onFocus={onFocus}
      value={value}
      readOnly
    />
  )
}