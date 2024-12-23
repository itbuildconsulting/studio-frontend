interface TimeProps {
    label: string,
    value: string,
    setValue: (e: string) => void
}

export default function Time({ label, value, setValue }: TimeProps) {
    return (
        <>
            <div style={{ position: 'relative' }}>
                {label ? <label>{label}</label> : <></>}
                <input
                    className={`w-full px-4 py-2 rounded-md mt-1 border border-slate-400 bg-white focus: outline-none`}
                    type="time"
                    value={value}
                    placeholder={"00:00"}
                    autoComplete='off'
                    onChange={(e: any) => setValue(e.target.value)}
                />
            </div>
        </>
    )
}