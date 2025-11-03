'use client'

import AuthInput from "@/components/auth/AuthInput";
import Card from "@/components/Card/Card";
import PageDefault from "@/components/template/default";
import { useEffect, useMemo, useState, useCallback } from "react";
import LevelRepository from "../../../../core/Level";
import Table from "@/components/Table/Table";
import { PaginationModel } from "@/types/pagination";
import pageDefault from "@/utils/pageDetault";
import styles from '../../styles/products.module.css';
import AuthSelect from "@/components/auth/AuthSelect";
import Modal from "@/components/Modal/Modal";
import Loading from "@/components/loading/Loading";
import AccordionCard from "@/components/Card/AccordionCard";
import configRepository from "../../../../core/Config";
import DropDownsCollection from "../../../../core/DropDowns";
import AuthSelectMulti from "@/components/auth/AuthSelectMulti";
import { convertArray } from "@/utils/convertArray";
import ValidationFields from "@/validators/fields";
import { ValidationForm } from "@/components/formValidation/validation";
import { ConfigSection } from "@/components/ConfigSection/ConfigSection";
import LevelManager from "@/components/LevelManager/LevelManager";

type LocalConfig = {
  configKey: string;
  configValue?: any;
  description?: string;
  active: 0 | 1; // 0/1 como no backend
};

const parseActive = (item: any) => Number(item?.active ?? item?.enabled ?? 0) === 1;
const parseValueArray = (val: any): number[] => {
  if (Array.isArray(val)) return val.map(Number).filter(Number.isFinite);
  if (typeof val === "string") {
    try {
      const arr = JSON.parse(val);
      return Array.isArray(arr) ? arr.map(Number).filter(Number.isFinite) : [];
    } catch {
      return [];
    }
  }
  return [];
};

// converte o que vier da API para número de horas (aceita "2h", "120", 24, etc.)
const parseHours = (val: any): number => {
  if (typeof val === 'number' && Number.isFinite(val)) return val;
  if (typeof val === 'string') {
    const m = val.match(/\d+/);
    if (m) return Number(m[0]);
  }
  return 0; // default quando vazio/inesperado
};

// chaves das configs
const KEY_CHECKIN = "checkinSpinGo";
const KEY_APP_PRODUCTS = "appProductsSpinGo";
const KEY_CANCEL_CLASS = 'cancelClassSpinGo';
const KEY_CANCEL_PURCHASE = 'cancelPurchaseSpinGo';

// opções fixas em horas
const HOURS = [1, 2, 4, 8, 12, 24, 48, 72, 96, 120];
const HOURS_OPTIONS = HOURS.map((h) => ({ value: h, label: `${h}h` }));

export default function Configuracao() {
  const repoConfig = useMemo(() => new configRepository(), []);
  const repoDrop = useMemo(() => new DropDownsCollection(), []);
  const [loading, setLoading] = useState(false);

  // dicionário de configs por key
  const [configs, setConfigs] = useState<Record<string, LocalConfig>>({});
  // chaves alteradas (a salvar)
  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set());
  // opções do select (tipos de produto)
  const [productTypes, setProductTypes] = useState<any[]>([]);

  const toOptions = (src: any): Array<{ value: number; label: string }> => {
  const arr = Array.isArray(src) ? src : (Array.isArray(src?.data) ? src.data : []);
  return arr
    .map((p: any) => ({
      value: Number(p.id ?? p.value ?? p.key),
      label: String(p.name ?? p.label ?? p.description ?? p.title ?? p.id),
    }))
    .filter((o: any) => Number.isFinite(o.value) && o.label);
    };

    const productOptions = useMemo(() => toOptions(productTypes), [productTypes]);

  // carregar configs da API e normalizar
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result: any = await repoConfig.list();
        // suporta { data: [...] } ou [...] direto
        const data: any[] = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
          ? result
          : [];

        const next: Record<string, LocalConfig> = {};

        for (const item of data) {
          const key = String(item?.configKey ?? "").trim();
          if (!key) continue;

          // para a chave de produtos, tentamos parsear array
          const value =
            key === KEY_APP_PRODUCTS
              ? parseValueArray(item?.configValue)
              : item?.configValue ?? "";

          next[key] = {
            configKey: key,
            configValue: value,
            description: item?.description ?? "",
            active: parseActive(item) ? 1 : 0,
          };
        }

        // garante chaves padrão mesmo se não vierem da API
        if (!next[KEY_CHECKIN]) {
          next[KEY_CHECKIN] = {
            configKey: KEY_CHECKIN,
            configValue: "",
            description: "",
            active: 0,
          };
        }
        if (!next[KEY_APP_PRODUCTS]) {
          next[KEY_APP_PRODUCTS] = {
            configKey: KEY_APP_PRODUCTS,
            configValue: [], // array de ids
            description: "",
            active: 0,
          };
        }
        if (!next[KEY_CANCEL_PURCHASE]) {
            next[KEY_CANCEL_PURCHASE] = {
                configKey: KEY_CANCEL_PURCHASE,
                configValue: '',   // string (ex.: "120" minutos, "2h", etc.)
                description: '',
                active: 0,
            };
        }
        if (!next[KEY_CANCEL_CLASS]) {
            next[KEY_CANCEL_CLASS] = {
                configKey: KEY_CANCEL_CLASS,
                configValue: '',   // string (ex.: "2h" ou "120" etc.)
                description: '',
                active: 0,
            };
        }

        setConfigs(next);
        setDirtyKeys(new Set()); // nada pendente após carregar
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [repoConfig]);

  // carregar tipos de produto (ajuste o método real do seu repoDrop)
  useEffect(() => {
        repoDrop.dropdown('productTypes/dropdown').then(setProductTypes);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  // helpers
  const markDirty = useCallback((key: string) => {
    setDirtyKeys((prev) => {
      const copy = new Set(prev);
      copy.add(key);
      return copy;
    });
  }, []);

  // toggle genérico (sem parâmetro, inverte)
  const handleToggle = useCallback(
    (key: string) => {
      setConfigs((prev) => {
        const current =
          prev[key] ?? { configKey: key, active: 0, configValue: "", description: "" };
        const next: LocalConfig = { ...current, active: current.active === 1 ? 0 : 1 };
        return { ...prev, [key]: next };
      });
      markDirty(key);
    },
    [markDirty]
  );

  // toggle com valor explícito vindo do componente
  const handleToggleExplicit = useCallback(
    (key: string, nextEnabled: boolean) => {
      setConfigs((prev) => {
        const cur =
          prev[key] ?? { configKey: key, active: 0, configValue: [], description: "" };
        return { ...prev, [key]: { ...cur, active: nextEnabled ? 1 : 0 } };
      });
      markDirty(key);
    },
    [markDirty]
  );

  // mudança de campos de texto
  const handleFieldChange = useCallback(
    (key: string, field: "description" | "configValue", value: any) => {
      setConfigs((prev) => {
        const current =
          prev[key] ?? { configKey: key, active: 0, configValue: "", description: "" };
        const next: LocalConfig = { ...current, [field]: value };
        return { ...prev, [key]: next };
      });
      markDirty(key);
    },
    [markDirty]
  );

  // select (array de ids)
  const handleSelectChangeArray = useCallback(
    (key: string, vals: number | number[]) => {
      const arr = Array.isArray(vals) ? vals : [vals];
      setConfigs((prev) => {
        const cur =
          prev[key] ?? { configKey: key, active: 0, configValue: [], description: "" };
        return { ...prev, [key]: { ...cur, configValue: arr } };
      });
      markDirty(key);
    },
    [markDirty]
  );

  // salvar APENAS o que mudou (um upsert por item)
  const handleSubmitConfig = useCallback(async () => {
    if (dirtyKeys.size === 0) return;

    setLoading(true);
    const keys = Array.from(dirtyKeys);

    try {
      await Promise.all(
        keys.map((key) => {
          const cfg = configs[key];
          if (!cfg) return Promise.resolve();

          // se o backend precisar de string no configValue, faça JSON.stringify(cfg.configValue)
          return repoConfig.upsertConfig(
            cfg.configKey,
            cfg.configValue ?? "",
            cfg.description ?? "",
            cfg.active // 0/1
          );
        })
      );

      setDirtyKeys(new Set());
    } catch (err) {
      console.error("Erro ao salvar configs:", err);
    } finally {
      setLoading(false);
    }
  }, [configs, dirtyKeys, repoConfig]);

  // derived para UI
  const isCheckinEnabled = configs[KEY_CHECKIN]?.active === 1;
  const isAppProductsEnabled = configs[KEY_APP_PRODUCTS]?.active === 1;
  const appProductsValues: number[] = configs[KEY_APP_PRODUCTS]?.configValue ?? [];

  return (
    <PageDefault title={"Configurações"}>
      <div className="grid grid-cols-12 mt-8 mb-8">
        <div className="col-span-12">
          <AccordionCard title="Configurações do Sistema">
            {/* Toggle: checkin do app */}
            <ConfigSection
              label="Habilitar Checkin do App Sping'Go"
              isEnabled={isCheckinEnabled}
              onToggleChange={(_: boolean) => handleToggle(KEY_CHECKIN)}
            />

            {/* Toggle + Select: produtos habilitados no app */}
            <ConfigSection
                label="Gerenciar Produtos do App Sping'Go"
                isEnabled={configs[KEY_APP_PRODUCTS]?.active === 1}
                onToggleChange={(next) => {
                    // toggle explícito (marca dirty)
                    setConfigs((prev) => {
                    const cur = prev[KEY_APP_PRODUCTS] ?? { configKey: KEY_APP_PRODUCTS, active: 0, configValue: [], description: "" };
                    return { ...prev, [KEY_APP_PRODUCTS]: { ...cur, active: next ? 1 : 0 } };
                    });
                    setDirtyKeys((prev) => new Set(prev).add(KEY_APP_PRODUCTS));
                }}
                inputType="select-multi"
                selectOptions={productOptions}
                selectValue={(configs[KEY_APP_PRODUCTS]?.configValue as number[]) ?? []}
                onSelectChange={(vals) => {
                    const arr = Array.isArray(vals) ? vals : [vals];
                    setConfigs((prev) => {
                    const cur = prev[KEY_APP_PRODUCTS] ?? { configKey: KEY_APP_PRODUCTS, active: 0, configValue: [], description: "" };
                    return { ...prev, [KEY_APP_PRODUCTS]: { ...cur, configValue: arr } };
                    });
                    setDirtyKeys((prev) => new Set(prev).add(KEY_APP_PRODUCTS));
                }}
            />

            <ConfigSection
                label="Gerenciar Cancelamento de aula"
                isEnabled={configs[KEY_CANCEL_CLASS]?.active === 1}
                onToggleChange={(next) => handleToggleExplicit(KEY_CANCEL_CLASS, next)}
                inputType="select"
                selectOptions={HOURS_OPTIONS}
                selectValue={
                    Number(configs[KEY_CANCEL_CLASS]?.configValue ?? 0) || undefined
                } // number
                onSelectChange={(val) =>
                    handleFieldChange(KEY_CANCEL_CLASS, 'configValue', val as number)
                }
                placeholder="Valor"
            />

            {/* Cancelamento de compra: toggle + select (single) */}
            <ConfigSection
                label="Gerenciar Cancelamento de Compra"
                isEnabled={configs[KEY_CANCEL_PURCHASE]?.active === 1}
                onToggleChange={(next) => handleToggleExplicit(KEY_CANCEL_PURCHASE, next)}
                inputType="select"
                selectOptions={HOURS_OPTIONS}
                selectValue={
                    Number(configs[KEY_CANCEL_PURCHASE]?.configValue ?? 0) || undefined
                } // number
                onSelectChange={(val) =>
                    handleFieldChange(KEY_CANCEL_PURCHASE, 'configValue', val as number)
                }
                placeholder="Valor"
            />

             <div className="flex col-span-12 justify-end mt-6 gap-2">
              <button
                className="btn-primary disabled:opacity-50"
                style={{ padding: "5px 20px" }}
                disabled={loading || dirtyKeys.size === 0}
                onClick={handleSubmitConfig}
              >
                {loading ? "Salvando..." : `Salvar`}
              </button>
            </div>

            
          </AccordionCard>
        </div>

       


        <div className="col-span-12 mt-16">
          <AccordionCard title="Configurações de Níveis">
              <LevelManager />
          </AccordionCard>
        </div>
      </div>
    </PageDefault>
  );
}
