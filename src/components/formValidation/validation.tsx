interface ValidationProps {
    errorMessage: string | string[] | null
}

export function ValidationForm({ errorMessage }: ValidationProps) {
    if(errorMessage) {
        return (
            <div className={` 
                bg-red-400 text-white py-1 px-2
                border border-red-500 rounded-md
                flex flex-row items-center col-span-12 w-1/2
                `}>
                    {/* {IconWarning} */}
                    <span className='ml-2 text-sm'>{errorMessage}</span>
                </div>
        )
    } else {
        return <></>
    }
}