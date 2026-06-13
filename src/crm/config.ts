type ApiCall = (path: string, method: string, body?: unknown) => Promise<any>;
type ToastFn = (opts: { title?: string; description?: string; variant?: 'default' | 'destructive' }) => void;

let _apiCall: ApiCall | null = null;
let _toast: ToastFn = (opts) => console.warn('[crm-frontend] toast not configured:', opts.title);

export function configureCrmApi(fn: ApiCall): void {
  _apiCall = fn;
}

export function configureCrmToast(fn: ToastFn): void {
  _toast = fn;
}

export function callApi(path: string, method: string, body?: unknown): Promise<any> {
  if (!_apiCall) throw new Error('@avera/crm-frontend: call configureCrmApi() before using the CRM');
  return _apiCall(path, method, body);
}

export function toast(opts: Parameters<ToastFn>[0]): void {
  _toast(opts);
}
