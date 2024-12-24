import React, { useState, useEffect, useRef, ReactNode } from 'react';

import styles from '../../styles/dropdown.module.css';

interface DropDownProps {
    children: ReactNode,
    style: string,
}

const DropDown = ({ children, style }: DropDownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [head, ...tail] = React.Children.toArray(children);

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
            className={`${styles.menu} `}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className={`flex items-center justify-center font-medium ${styles.styleHeader}`} style={{ fontSize: "1.375rem" }}>
                {head}
            </div>
            {isOpen &&
                <div className={`${styles.open} ${style}`}>
                    <>
                        {tail?.map((cItem: any, index: number) => {
                            return (
                                <div key={index} className={`${styles.item}`} onClick={cItem.onClick}>
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