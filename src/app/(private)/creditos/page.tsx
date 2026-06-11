'use client'

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageDefault from "@/components/template/default";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ProductCollection from "../../../../core/Product";
import DropDownsCollection from "../../../../core/DropDowns";
import { convertArrayType } from "@/utils/convertArray";

export default function Credit() {
    const repo = useMemo(() => new ProductCollection(), []);
    const repoDrop = useMemo(() => new DropDownsCollection(), []);
    const router = useRouter();

    const [typeProduct, setTypeProduct] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [productList, setProductList] = useState<any[]>([]);
    const [dropdownType, setDropdownType] = useState<any[]>([]);

    const listProducts = () => {
        setLoading(true);
        repo.listFiltered(1, typeProduct).then((result: any) => {
            if (!(result instanceof Error)) setProductList(result.data ?? []);
        }).finally(() => setLoading(false));
    };

    useEffect(() => {
        repoDrop.dropdown('productTypes/dropdown').then(setDropdownType);
        listProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (typeProduct === null) listProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [typeProduct]);

    const handleSelect = (product: any) => {
        localStorage.setItem('selectedProduct', JSON.stringify([
            { productId: product.id, quantity: 1, name: product.name, value: product.value }
        ]));
        router.push('/checkout');
    };

    return (
        <PageDefault>
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="mb-6">
                <h3 className="text-foreground">Créditos</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Selecione um pacote para vender ao aluno</p>
            </div>

            {/* ── Filtro ─────────────────────────────────────────── */}
            <Card className="mb-6">
                <CardContent className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Filtro</p>
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex flex-col gap-1 min-w-[200px]">
                            <Label>Tipo de Produto</Label>
                            <select
                                value={typeProduct ?? ''}
                                onChange={(e) => setTypeProduct(e.target.value || null)}
                                className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                            >
                                <option value="">Todos os tipos</option>
                                {(convertArrayType(dropdownType) || []).map((opt: any) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2 pb-0.5">
                            <Button variant="outline" size="sm" onClick={() => setTypeProduct(null)}>
                                Limpar
                            </Button>
                            <Button size="sm" onClick={listProducts}>
                                Pesquisar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── Grid de produtos ───────────────────────────────── */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-border bg-card p-5 animate-pulse">
                            <div className="h-3 bg-muted rounded w-1/2 mb-4" />
                            <div className="h-4 bg-muted rounded w-3/4 mb-5" />
                            <div className="h-12 bg-muted rounded w-1/3 mb-1 mx-auto" />
                            <div className="h-3 bg-muted rounded w-1/4 mb-5 mx-auto" />
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="h-12 bg-muted rounded-lg" />
                                <div className="h-12 bg-muted rounded-lg" />
                            </div>
                            <div className="h-9 bg-muted rounded-full" />
                        </div>
                    ))}
                </div>
            ) : productList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                    </svg>
                    <p className="text-sm">Nenhum produto encontrado.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {productList.map((product: any) => (
                        <div
                            key={product.id}
                            className="rounded-xl border border-border bg-card p-5 flex flex-col hover:shadow-md hover:border-primary/30 transition-all duration-200"
                        >
                            {/* Tipo */}
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                {product.productType?.name ?? "—"}
                            </p>

                            {/* Nome */}
                            <p className="text-sm font-semibold text-foreground mb-4 leading-snug">
                                {product.name}
                            </p>

                            {/* Créditos — destaque visual */}
                            <div className="text-center my-2">
                                <span className="text-5xl font-extrabold text-primary leading-none">
                                    {String(product.credit).padStart(2, "0")}
                                </span>
                                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">créditos</p>
                            </div>

                            {/* Validade / Valor */}
                            <div className="grid grid-cols-2 gap-2 mt-4 mb-5">
                                <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Validade</p>
                                    <p className="text-sm font-semibold text-foreground">{product.validateDate} dias</p>
                                </div>
                                <div className="bg-muted/50 rounded-lg p-2.5 text-center">
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">Valor</p>
                                    <p className="text-sm font-semibold text-foreground">
                                        {Number(product.value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                    </p>
                                </div>
                            </div>

                            <Button className="w-full mt-auto" onClick={() => handleSelect(product)}>
                                Selecionar
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </PageDefault>
    );
}
