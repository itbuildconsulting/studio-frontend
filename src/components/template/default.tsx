'use client'

import Header from "../Header/Header"
import MenuSideBar from "../MenuSideBar/MenuSideBar"

export default function PageDefault(props: any) {
    return (
        <main>
            <div className="flex">
                <MenuSideBar />
                <div className="w-full">
                    <Header />
                    <div className="container-content">
                        <h3 style={{ marginBottom: "64px" }}>{props.title}</h3>

                        <div>
                            {props.children}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}