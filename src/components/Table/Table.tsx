import useWindowSize from '@/data/hooks/useWindowSize';
import styles from '../../styles/table.module.css';
import { Pagination } from '../pagination/pagination';
import { PaginationModel } from '@/types/pagination';

interface TableProps {
    data: any,
    columns: any,
    class?: any,
    rowClasses?: any,
    loading?: boolean,
    setPage?: (page: number) => void,
    infoPage?: PaginationModel,
    onRowClick?: (row: any) => void; // ✅ NOVA PROP
}

export default function Table(props: TableProps) {
    const size: any = useWindowSize();
    if (size?.width > 1200) {
        return (
            <>
                <table className={`${styles.bg_table} ${props.class || ""} w-full`}>
                    <tbody>
                        {props?.data?.length > 0 && props.loading === false ? (
                        props.data.map((item: any, index: number) => (
                            <tr 
                                key={index} 
                                className={`${props?.rowClasses?.(item) || ""} ${props.onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                                onClick={() => props.onRowClick?.(item)}
                                style={props.onRowClick ? { cursor: 'pointer' } : undefined}
                            >
                            {props.columns.map((col: any, i: number) => (
                                <td key={i}>
                                <div className="flex flex-col justify-center">
                                    {col.text && <small>{col.text}</small>}
                                    {!col.formatter ? (
                                    <p>{item[col.dataField]}</p>
                                    ) : (
                                    col.formatter(item[col.dataField], item)
                                    )}
                                </div>
                                </td>
                            ))}
                            </tr>
                        ))
                        ) : props.loading ? (
                        <tr>
                            <td colSpan={Math.max(1, props.columns?.length || 1)}>
                            <div className="flex flex-col gap-4">
                                {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="animated-background"
                                    style={{ height: "73px", borderRadius: "16px" }}
                                />
                                ))}
                            </div>
                            </td>
                        </tr>
                        ) : (
                        <tr>
                            <td colSpan={Math.max(1, props.columns?.length || 1)}>
                            <div className="flex justify-center items-center" style={{ height: "73px" }}>
                                Não foram encontrados itens a serem listados
                            </div>
                            </td>
                        </tr>
                        )}
                    </tbody>
                    </table>

                {props?.infoPage && <Pagination infoPage={props?.infoPage} setPage={props.setPage} />}
            </>
        )
    } else {
        return (
            <>
                <div className={`${styles.bg_table} ${props.class || ""} w-full`}>
                    <div>
                        {
                            props?.data?.length > 0 ? props?.data?.map((item: any, index: number) => {
                                return (
                                    <div 
                                        key={index} 
                                        className={`${styles.bg_table_card} grid grid-cols-12 gap-8 ${props.onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                                        onClick={() => props.onRowClick?.(item)}
                                        style={props.onRowClick ? { cursor: 'pointer' } : undefined}
                                    >
                                        {
                                            props.columns.map((col: any, indexHeader: number) => {
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
                                :
                                props.loading === true
                                    ?
                                    <div className='flex flex-col gap-4'>
                                        <div className='animated-background' style={{ height: "73px", borderRadius: "16px" }}></div>
                                        <div className='animated-background' style={{ height: "73px", borderRadius: "16px" }}></div>
                                        <div className='animated-background' style={{ height: "73px", borderRadius: "16px" }}></div>
                                        <div className='animated-background' style={{ height: "73px", borderRadius: "16px" }}></div>
                                        <div className='animated-background' style={{ height: "73px", borderRadius: "16px" }}></div>
                                    </div>
                                    :
                                    <div className="flex justify-center items-center" style={{ height: "73px" }}>
                                        Não foram encontrados items há serem listados
                                    </div>
                        }
                    </div>
                </div>
            </>
        )
    }
}