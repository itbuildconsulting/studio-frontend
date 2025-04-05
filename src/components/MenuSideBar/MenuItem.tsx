import Cookies from 'js-cookie'
import Link from 'next/link'
import React, { ReactElement, useEffect, useState } from 'react'

interface MenuItensProps {
    url?: string,
    text: string,
    icon: ReactElement,
    className?: string,
    onClick?: () => void
}

const MenuItem = (props: MenuItensProps) => {
    function renderContentIten() {
        return (
            <>
                {props.icon}
                <span className={`ml-3`}>
                    {props.text}
                </span>
            </>
        )
    }

    /* const [userData, setUserData] = useState({});

    const dataUser = Cookies.get('admin-user-sci-info')

    useEffect(() => {
        if (dataUser !== undefined) {
            setUserData(JSON.parse(dataUser));
        }
    }, [dataUser])
 */
    return (
        <li onClick={props.onClick} className={`${props.className}`}>
            {props.url ? (
                <Link href={props.url}
                    className={``}>
                    {renderContentIten()}
                </Link>

            ) :
                <Link href={"/"}
                    className={``}
                    style={{ color: "#949494" }}
                    >
                    {renderContentIten()}
                </Link>
                /* (
                    <div className={`${props.className}`}>
                        <p>{userData.name}</p>
                        <small>{userData.responsibility}</small>
                    </div>
                ) */}
        </li>


    )
}

export default MenuItem