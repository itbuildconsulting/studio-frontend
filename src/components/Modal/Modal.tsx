import { ReactNode } from 'react';
import styles from '../../styles/modal.module.css';

interface ModalProps {
    title?: string,
    children?: ReactNode,
    setShowModal?: (r: boolean) => void,
    showModal?: boolean,
    modalPosition?: string,
    isModalStatus?: boolean,
    hasFooter?: boolean,
    loading?: boolean,
    onSubmit?: () => void,
    edit?: boolean,
    btnClose?: boolean,
    hrefClose?: string
}

export default function Modal({
    title, children, setShowModal, showModal, modalPosition, isModalStatus, hasFooter, loading, onSubmit, edit, btnClose, hrefClose
}: ModalProps) {
    return (
        <>
            {showModal ? (
                <>
                    <div
                        className={`${styles.modal_fade} ${modalPosition === "top" ? "justify-start pt-24" : "justify-center"} items-center flex flex-col overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none`}
                    >
                        <div className={!isModalStatus ? `${styles.modal}` : `${styles.modalStatus}`} >
                            <div>
                                {
                                    !isModalStatus
                                    &&
                                    <div className={`${styles.header_modal} flex justify-between w-full`}>
                                        {title && <h4>{title}</h4>}
                                        {btnClose === true && setShowModal && (
                                            <div
                                                className={`${styles.modal_close}`}
                                                onClick={() => setShowModal(false)}
                                            ></div>
                                        )}
                                    </div>
                                }
                                <div>
                                    {children}
                                </div>
                            </div>
                            {
                                hasFooter &&
                                <div className={`${styles.footer_modal}`}>
                                     {setShowModal && (
                                        <button
                                            className='btn-outline-primary'
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                    {
                                        loading
                                            ?
                                            <button className="btn-primary">
                                                <div className="load" />
                                            </button>
                                            :
                                            <button
                                                className='btn-primary'
                                                onClick={() => onSubmit?.()}
                                            >
                                                {edit ? "Atualizar" : "Cadastrar"}
                                            </button>
                                    }
                                   
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