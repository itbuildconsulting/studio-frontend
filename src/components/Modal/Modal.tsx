import styles from '../../styles/modal.module.css';

export default function Modal(props: any) {
    return (
        <>
            {props.showModal ? (
                <>
                    <div
                        className={`${styles.modal_fade} ${props.modalPosition === "top" ? "justify-start pt-24" : "justify-center"} items-center flex flex-col overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none`}
                    >
                        <div className={!props.isModalStatus ? `${styles.modal}` : `${styles.modalStatus}`} >
                            <div>
                                {
                                    !props.isModalStatus
                                    &&
                                    <div className={`${styles.header_modal} flex justify-between w-full`}>
                                        {props.title && <h4>{props.title}</h4>}
                                        {props.btnClose === true ? <div className={`${styles.modal_close}`} onClick={() => props.setShowModal(false)}></div> : <></>}
                                    </div>
                                }
                                <div>
                                    {props.children}
                                </div>
                            </div>
                            {
                                props.hasFooter &&
                                <div className={`${styles.footer_modal}`}>
                                    <button className='btn-primary' onClick={() => props.onSubmit()}>Cadastrar</button>
                                    <button className='btn-outline-primary' onClick={() => props.setShowModal(false)}>Cancelar</button>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="opacity-50 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
}