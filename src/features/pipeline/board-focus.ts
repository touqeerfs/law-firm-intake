import type { z } from 'zod';
import { listViewSchema } from '@/features/contacts/contact-rules';

export const boardFocusSchema = listViewSchema.extract(['due', 'not-contacted']);
export type BoardFocus = z.infer<typeof boardFocusSchema>;
