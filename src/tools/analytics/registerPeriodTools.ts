import { FastMCP } from "fastmcp";
import {
  optionalFiltersSchema,
  periodAccountSchema,
  periodFilterSchema,
  periodOnlySchema,
  periodPaymentMethodSchema,
  periodWithOutlierLimitSchema,
  periodWithTopCategoryLimitSchema,
} from "../../schemas/analytics.js";
import { WmbApiClient } from "../../services/apiClient.js";
import { addApiTool } from "../registerApiTool.js";

export function registerPeriodTools(server: FastMCP, client: WmbApiClient): void {
  addApiTool(server, client, {
    name: "analytics_period_overview",
    description: "Get statement period totals and transaction count.",
    schema: periodFilterSchema,
    request: (args) => ({
      path: `/periods/${encodeURIComponent(args.period)}/overview`,
      query: optionalFiltersSchema.parse(args),
    }),
  });

  addApiTool(server, client, {
    name: "analytics_period_categories",
    description: "Get category breakdown for a statement period.",
    schema: periodFilterSchema,
    request: (args) => ({
      path: `/periods/${encodeURIComponent(args.period)}/categories`,
      query: optionalFiltersSchema.parse(args),
    }),
  });

  addApiTool(server, client, {
    name: "analytics_period_categories_distinct",
    description: "List distinct categories in a statement period.",
    schema: periodOnlySchema,
    request: (args) => ({
      path: `/periods/${encodeURIComponent(args.period)}/categories/distinct`,
    }),
  });

  addApiTool(server, client, {
    name: "analytics_period_categories_top",
    description: "Get top categories for a statement period.",
    schema: periodWithTopCategoryLimitSchema,
    request: (args) => ({
      path: `/periods/${encodeURIComponent(args.period)}/categories/top`,
      query: {
        limit: args.limit,
        paymentMethod: args.paymentMethod,
        account: args.account,
      },
    }),
  });

  addApiTool(server, client, {
    name: "analytics_period_accounts",
    description: "Get account breakdown for a statement period.",
    schema: periodAccountSchema,
    request: (args) => ({
      path: `/periods/${encodeURIComponent(args.period)}/accounts`,
      query: { paymentMethod: args.paymentMethod },
    }),
  });

  addApiTool(server, client, {
    name: "analytics_period_payment_methods",
    description: "Get payment method breakdown for a statement period.",
    schema: periodPaymentMethodSchema,
    request: (args) => ({
      path: `/periods/${encodeURIComponent(args.period)}/payment-methods`,
      query: { account: args.account },
    }),
  });

  addApiTool(server, client, {
    name: "analytics_period_criticality",
    description: "Get criticality breakdown for a statement period.",
    schema: periodFilterSchema,
    request: (args) => ({
      path: `/periods/${encodeURIComponent(args.period)}/criticality`,
      query: optionalFiltersSchema.parse(args),
    }),
  });

  addApiTool(server, client, {
    name: "analytics_period_daily",
    description: "Get daily totals for a statement period.",
    schema: periodFilterSchema,
    request: (args) => ({
      path: `/periods/${encodeURIComponent(args.period)}/daily`,
      query: optionalFiltersSchema.parse(args),
    }),
  });

  addApiTool(server, client, {
    name: "analytics_period_duplicates",
    description: "Find duplicate row hash groups for a statement period.",
    schema: periodOnlySchema,
    request: (args) => ({ path: `/periods/${encodeURIComponent(args.period)}/duplicates` }),
  });

  addApiTool(server, client, {
    name: "analytics_period_uncategorized",
    description: "Get uncategorized transactions for a statement period.",
    schema: periodOnlySchema,
    request: (args) => ({ path: `/periods/${encodeURIComponent(args.period)}/uncategorized` }),
  });

  addApiTool(server, client, {
    name: "analytics_period_outliers",
    description: "Get largest transactions in a statement period.",
    schema: periodWithOutlierLimitSchema,
    request: (args) => ({
      path: `/periods/${encodeURIComponent(args.period)}/outliers`,
      query: { limit: args.limit },
    }),
  });
}

