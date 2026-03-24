import type { Options } from 'ky';
import ky from 'ky';
import { ONE_SECOND } from './constants';
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
    timeout: 30 * ONE_SECOND,
    retry: 0,
});

export const httpPrivate =
    typeof window === 'undefined' ? createServerHttpPrivate(http) : createClientHttpPrivate(http);
