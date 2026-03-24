import { z } from 'zod';

export const exampleSchema = z.object({
    name: z.string(),
    type: z.string(),
});

export type ExampleSchema = z.infer<typeof exampleSchema>;
