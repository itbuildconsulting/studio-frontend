'use client'

import { useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { configureCrmApi, configureCrmToast, CRMPage, TemplateEditorPage } from "@avera/crm-frontend";
import PageDefault from "@/components/template/default";

configureCrmToast(({ title, description, variant }) => {
    if (variant === "destructive") {
        toast.error(title, { description });
    } else {
        toast.success(title, { description });
    }
});

export default function CrmPage() {
    useEffect(() => {
        const token = Cookies.get("admin-user-sci-auth");
        configureCrmApi(async (path, method, body) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL_API}${path}`, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                ...(body ? { body: JSON.stringify(body) } : {}),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        });
    }, []);

    return (
        <PageDefault title="">
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="/" element={<CRMPage />} />
                    <Route path="/templates/new" element={<TemplateEditorPage />} />
                    <Route path="/templates/:templateId" element={<TemplateEditorPage />} />
                </Routes>
            </MemoryRouter>
        </PageDefault>
    );
}
