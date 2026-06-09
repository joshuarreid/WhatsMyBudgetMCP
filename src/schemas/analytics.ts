import { z } from "zod";

export const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const periodSchema = z.string().trim().min(1);
export const dateSchema = z.string().regex(dateRegex, "Expected YYYY-MM-DD");
export const limitTopCategoriesSchema = z.number().int().min(0).max(100).default(10);
export const limitOutliersSchema = z.number().int().min(0).max(200).default(20);

export const optionalFiltersSchema = z.object({
  paymentMethod: z.string().trim().min(1).optional(),
  account: z.string().trim().min(1).optional(),
});

export const noArgsSchema = z.object({});

export const periodOnlySchema = z.object({ period: periodSchema });

export const periodFilterSchema = z.object({
  period: periodSchema,
  paymentMethod: z.string().trim().min(1).optional(),
  account: z.string().trim().min(1).optional(),
});

export const periodAccountSchema = z.object({
  period: periodSchema,
  paymentMethod: z.string().trim().min(1).optional(),
});

export const periodPaymentMethodSchema = z.object({
  period: periodSchema,
  account: z.string().trim().min(1).optional(),
});

export const periodWithTopCategoryLimitSchema = z.object({
  period: periodSchema,
  limit: limitTopCategoriesSchema,
  paymentMethod: z.string().trim().min(1).optional(),
  account: z.string().trim().min(1).optional(),
});

export const periodWithOutlierLimitSchema = z.object({
  period: periodSchema,
  limit: limitOutliersSchema,
});

export const rangeOnlySchema = z.object({
  startDate: dateSchema,
  endDate: dateSchema,
});

export const rangeFilterSchema = z.object({
  startDate: dateSchema,
  endDate: dateSchema,
  paymentMethod: z.string().trim().min(1).optional(),
  account: z.string().trim().min(1).optional(),
});

export const rangeAccountSchema = z.object({
  startDate: dateSchema,
  endDate: dateSchema,
  paymentMethod: z.string().trim().min(1).optional(),
});

export const rangePaymentMethodSchema = z.object({
  startDate: dateSchema,
  endDate: dateSchema,
  account: z.string().trim().min(1).optional(),
});

export const rangeWithTopCategoryLimitSchema = rangeFilterSchema.extend({
  limit: limitTopCategoriesSchema,
});

export const rangeWithOutlierLimitSchema = rangeOnlySchema.extend({
  limit: limitOutliersSchema,
});

export const summariesRangeSchema = z.object({
  startPeriod: periodSchema,
  endPeriod: periodSchema,
});

