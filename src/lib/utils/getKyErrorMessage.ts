import type { RequestWithErrorResponse } from '@/lib/types';
import { HTTPError } from 'ky';

export const getKyErrorMessage = async (error: unknown, fallbackMessage: string) => {
    if (error instanceof HTTPError) {
        try {
            const httpErrorMessage = (await error?.response?.json()) as RequestWithErrorResponse & { error?: string };
            // Debug: Log the full error response
            // eslint-disable-next-line no-console
            console.log('🔍 [getKyErrorMessage] Error response:', httpErrorMessage);
            return httpErrorMessage?.message ?? httpErrorMessage?.error ?? fallbackMessage;
        } catch {
            // Response body is not valid JSON, try to get text
            try {
                const textError = await error?.response?.text();
                // eslint-disable-next-line no-console
                console.log('🔍 [getKyErrorMessage] Text error response:', textError);
                return textError || fallbackMessage;
            } catch {
                return fallbackMessage;
            }
        }
    }

    return (error as Error)?.message ?? fallbackMessage;
};
