import ky, { Options } from 'ky';
import { createClientHttpPrivate } from './@httpClient';
import { createServerHttpPrivate } from './@httpServer';
import { env } from './env';

export interface OptionsWithTypedJson<TJson> extends Options {
    json: TJson;
}

export interface OptionsWithTypedBody<TBody extends BodyInit | null | undefined> extends Options {
    body: TBody;
}

// TODO: The API error messages should be aligned with BE engineers
// NOTE: Should be used like `HTTPError<BaseErrorData>`
export type BaseErrorData<TData = unknown> = { message: string } & TData;

export const http = ky.create({
    prefixUrl: env.NEXT_PUBLIC_API_URL,
    timeout: false,
    retry: 0,
});

export const httpPrivate =
    typeof window === 'undefined' ? createServerHttpPrivate(http) : createClientHttpPrivate(http);
