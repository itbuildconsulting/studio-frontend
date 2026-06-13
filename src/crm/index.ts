// Configuration (must be called before using CRM)
export { configureCrmApi, configureCrmToast } from './config';

// Page
export { default as CRMPage } from './pages/CRM';

// Components (for individual use)
export { default as TemplatesPanel }   from './components/TemplatesPanel';
export { default as RegrasPanel }      from './components/RegrasPanelView';
export { default as RuleFormDialog }   from './components/RuleFormDialog';
export { default as TemplateFormDialog } from './components/TemplateFormDialog';
export { default as LogDetailDialog }  from './components/LogDetailDialog';
export { default as PushPanel }        from './components/PushPanel';

// API functions
export * from './api/crm';

// Types & data
export * from './data/crm';
