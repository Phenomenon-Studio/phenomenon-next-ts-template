import { z } from 'zod';

export type ExampleSchema = z.infer<typeof exampleSchema>;

export const exampleSchema = z.object({
    name: z.string(),
    type: z.string(),
});
