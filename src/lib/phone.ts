import { z } from 'zod';

/** Bangladeshi mobile number; spaces and dashes are removed before checking (people type "017 1234 5678"). */
export const normalizePhone = (s: string) => s.replace(/[\s-]/g, '');
export const BD_PHONE = /^(\+?88)?01[3-9]\d{8}$/;
export const bdPhone = z.string().max(20).transform(normalizePhone).pipe(z.string().regex(BD_PHONE, 'Invalid mobile number'));
