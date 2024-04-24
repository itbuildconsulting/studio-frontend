import styles from '../../styles/table.module.css';

interface TableProps {
    data: any,
    columns: any,
    class?: any,
    rowClasses?: any
}

export default function Table(props: TableProps) {
    return (
        <>
            <table className={`${styles.bg_table} ${props.class || ""} w-full`}>
                <tbody>
                    {
                        props.data.map((item: any, index: any) => {
                            return (
                                <tr key={index} className={`${props?.rowClasses && props?.rowClasses(item)}`}>
                                    {
                                        props.columns.map((col: any, indexHeader: any) => {
                                            return (
                                                <td key={indexHeader}>
                                                    <div className='flex flex-col justify-center'>
                                                        {col.text && <small>{col.text}</small>}
                                                        {!col.formatter ? <p>{item[col.dataField]}</p> : col.formatter(item[col.dataField], item)}
                                                    </div>
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}