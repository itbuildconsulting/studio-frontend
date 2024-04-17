import styles from '../../styles/card.module.css';

interface TitleProps {
    title?: string,
    children: any,
    hasButton?: boolean,
    setShowModal?: any
}

export default function Card(props: TitleProps) {
    return (
        <div className={`${styles.bg_card}`}>
            <div className='flex justify-between'>
                {props.title && <h4 style={{ marginBottom: "32px" }}>{props.title}</h4>}

                {props.hasButton && <button className="btn-outline-primary" onClick={() => props.setShowModal(true)}><p>Adicionar</p></button>}
            </div>
            {props.children}
        </div>
    )
}