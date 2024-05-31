import useWindowSize from '@/data/hooks/useWindowSize';
import styles from '../../styles/table.module.css';

interface TableProps {
    data: any,
    columns: any,
    class?: any,
    rowClasses?: any
}

export default function Table(props: TableProps) {
    const size: any = useWindowSize();
    console.log(size)

    if (size?.width > 1200) {
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
    } else {
        return (
            <>
                <div className={`${styles.bg_table} ${props.class || ""} w-full`}>
                    <div>
                        {
                            props.data.map((item: any, index: any) => {
                                return (
                                    <div key={index} className={`${styles.bg_table_card} grid grid-cols-12 gap-8`}>
                                        {
                                            props.columns.map((col: any, indexHeader: any) => {
                                                return (
                                                    <div key={indexHeader} className={'col-span-6 md:col-span-4'} style={{ wordBreak: 'break-word' }}>
                                                        <div className='flex flex-col justify-center'>
                                                            {col.text && <small>{col.text}</small>}
                                                            {!col.formatter ? <p>{item[col.dataField]}</p> : col.formatter(item[col.dataField], item)}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </>
        )
    }
}