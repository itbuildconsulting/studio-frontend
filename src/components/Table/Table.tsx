import styles from '../../styles/table.module.css';

interface TableProps {
    data: any,
    columns: any,
    class?: any
}

export default function Table(props: TableProps) {

    return (
        <>
            <table className={`${styles.bg_table} ${props.class} w-full`}>
                <tbody>
                    {
                        props.data.map((item: any, index: any) => {
                            return (
                                <tr key={index}>
                                    {
                                        props.columns.map((col: any, indexHeader: any) => {
                                            return (
                                                <td key={indexHeader}>
                                                    <small>{col.text}</small>
                                                    <p>{!col.formatter ? item[col.dataField] : col.formatter(item[col.dataField], item)}</p>
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