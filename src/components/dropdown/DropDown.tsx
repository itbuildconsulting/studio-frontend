import React, { useState, useEffect, useRef } from 'react';

import style from '../../styles/dropdown.module.css';

const DropDown = (props: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [head, ...tail] = React.Children.toArray(props.children);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div
            ref={dropdownRef}
            className={`${style.menu} `}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className={`flex items-center justify-center font-medium ${style.styleHeader}`} style={{ fontSize: "1.375rem" }}>
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
                            );
                        })}
                    </>
                </div>
            }
        </div>
    );
};

export default DropDown;