import { toast } from "sonner";
import { useRequest as _useRequest } from "ahooks";
import type {
  Options as _Options,
  Plugin,
  Result,
} from "ahooks/lib/useRequest/src/types";

type Request<TData, TParams extends any[]> = (
  ...args: TParams
) => Promise<TData>;

type Options<TData, TResponse, TParams extends any[]> = _Options<
  TData,
  TParams
> & {
  successMessage?: string;
  showError?: boolean;
};

type OptionsWithSelector<TData, TResponse, TParams extends any[]> = Options<
  TData,
  TResponse,
  TParams
> & {
  selector: (response: TResponse) => TData;
};

interface OptionsWithInitialValue<TData, TParams extends any[]>
  extends Options<TData, any, TParams> {
  initialValue: TData;
}

interface OptionsWithInitialValueAndSelector<
  TData,
  TResponse,
  TParams extends any[]
> extends OptionsWithSelector<TData, TResponse, TParams> {
  initialValue: TData;
}

type ResultWithInitialValue<TData, TParams extends any[]> = Result<
  TData,
  TParams
> & { data: TData };

const initialValuePlugin = () => ({});
initialValuePlugin.onInit = ({ initialValue }: any) => {
  return { data: initialValue };
};

export function useRequest<TData, TParams extends any[]>(
  request: Request<TData, TParams>,
  options?: Options<TData, any, TParams>,
  plugins?: Plugin<TData, TParams>[]
): Result<TData, TParams>;

export function useRequest<TData, TParams extends any[]>(
  request: Request<TData, TParams>,
  options: OptionsWithInitialValue<TData, TParams>,
  plugins?: Plugin<TData, TParams>[]
): ResultWithInitialValue<TData, TParams>;

export function useRequest<TData, TResponse, TParams extends any[]>(
  request: Request<TResponse, TParams>,
  options: OptionsWithSelector<TData, TResponse, TParams>,
  plugins?: Plugin<TData, TParams>[]
): Result<TData, TParams>;

export function useRequest<TData, TResponse, TParams extends any[]>(
  request: Request<TResponse, TParams>,
  options: OptionsWithInitialValueAndSelector<TData, TResponse, TParams>,
  plugins?: Plugin<TData, TParams>[]
): ResultWithInitialValue<TData, TParams>;

export function useRequest<TData, TResponse, TParams extends any[]>(
  request: Request<TResponse, TParams>,
  options?: Options<TData, TResponse, TParams>,
  plugins?: Plugin<TData, TParams>[]
): Result<TData, TParams> | ResultWithInitialValue<TData, TParams> {
  const selector: (response: TResponse) => TData =
    options && "selector" in options
      ? (options as OptionsWithSelector<TData, TResponse, TParams>).selector
      : (_: TResponse | undefined) => _ as TData;

  const showError = options?.showError !== false;

  const wrappedRequest = (...args: TParams) => {
    return request(...args).then((response) => {
      return selector(response);
    });
  };

  const onSuccess = (data: TData, params: TParams) => {
    if (options?.successMessage) toast.success(options.successMessage);
    return options?.onSuccess?.(data, params);
  };

  const onError = (error: any, params: TParams) => {
    console.log(error);
    const message =
      error.response?.data?.message || error.message || "请求失败";
    if (showError) toast.error(message);
    return options?.onError?.(error, params);
  };

  return _useRequest(wrappedRequest, { ...options, onError, onSuccess }, [
    initialValuePlugin,
    ...(plugins || []),
  ]);
}
