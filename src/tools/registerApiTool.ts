import { randomUUID } from "node:crypto";
import { FastMCP, UserError } from "fastmcp";
import { z } from "zod";
import { ApiError, QueryParams, WmbApiClient } from "../services/apiClient.js";

type ApiToolSpec<TSchema extends z.ZodTypeAny> = {
  name: string;
  title?: string;
  description: string;
  whenToUse: string;
  triggerWords?: string[];
  schema: TSchema;
  request: (args: z.output<TSchema>) => { path: string; query?: QueryParams };
};

function buildDescription(spec: Pick<ApiToolSpec<z.ZodTypeAny>, "description" | "whenToUse" | "triggerWords">): string {
  const lines = [spec.description, `When to use: ${spec.whenToUse}`];

  if (spec.triggerWords?.length) {
    lines.push(`Trigger words: ${spec.triggerWords.join(", ")}`);
  }

  return lines.join("\n");
}

export function addApiTool<TSchema extends z.ZodTypeAny>(
  server: FastMCP,
  client: WmbApiClient,
  spec: ApiToolSpec<TSchema>
): void {
  server.addTool({
    name: spec.name,
    description: buildDescription(spec),
    annotations: {
      title: spec.title ?? spec.name,
      readOnlyHint: true,
      openWorldHint: true,
    },
    parameters: spec.schema,
    execute: async (args) => {
      try {
        const txId = randomUUID();
        const request = spec.request(args as z.output<TSchema>);
        const { data, transactionId } = await client.get(request.path, request.query, txId);
        return JSON.stringify(
          {
            requestTransactionId: txId,
            responseTransactionId: transactionId,
            data,
          },
          null,
          2
        );
      } catch (error) {
        if (error instanceof ApiError) {
          throw new UserError(
            JSON.stringify(
              {
                message: error.message,
                status: error.status,
                body: error.body,
                responseTransactionId: error.transactionId,
              },
              null,
              2
            )
          );
        }

        const message = error instanceof Error ? error.message : "Unknown error";
        throw new UserError(message);
      }
    },
  });
}



