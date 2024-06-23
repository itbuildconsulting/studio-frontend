import React, { useState } from 'react'

import style from '../../styles/dropdown.module.css';

const DropDown = (props: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [head, ...tail] = React.Children.toArray(props.children);
    return (
        <div
            className={`${style.menu} `}
            onClick={() => setIsOpen(!isOpen)}
            //onMouseLeave={() => setIsOpen(false)}
        >
            <div className={`flex items-center text-base font-medium ${props?.styleHeader}`}>
            {head}
            </div>
            {isOpen &&
                <div className={`${style.open} ${props?.style}`}>
                    <>
                        {tail.map((cItem: any, index: any) => {
                            return (
                                <div key={index} className={`${style.item}`} onClick={cItem.onClick}>
                                    {cItem}
                                </div>
                            )
                        })
                        }
                    </>

                </div>
            }
            
        </div>
    )
}

export default DropDown