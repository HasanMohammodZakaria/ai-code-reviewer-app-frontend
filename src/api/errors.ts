import axios from "axios";
import type {
  ApiErrorBody,
  ApiErrorDetail,
  NormalizedError,
} from "../types/api";

const NETWORK_MESSAGE =
  "Cannot reach the server. Check your connection and try again.";
const TIMEOUT_MESSAGE = "The request took too long. Please try again.";
const UNKNOWN_MESSAGE = "Something went wrong. Please try again.";

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof (value as { message: unknown }).message === "string"
  );
}

export function isNormalizedError(value: unknown): value is NormalizedError {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    "message" in value &&
    typeof (value as { status: unknown }).status === "number" &&
    typeof (value as { message: unknown }).message === "string"
  );
}

export function normalizeError(error: unknown): NormalizedError {
  if (isNormalizedError(error)) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    if (error.response) {
      const { status, data } = error.response;

      if (isApiErrorBody(data)) {
        return {
          status,
          message: data.message,
          details: Array.isArray(data.details) ? data.details : undefined,
        };
      }

      if (status === 413) {
        return {
          status,
          message:
            "The code is too large to send. Remove some files or shorten them.",
        };
      }

      return { status, message: UNKNOWN_MESSAGE };
    }

    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return { status: 0, message: TIMEOUT_MESSAGE };
    }

    return { status: 0, message: NETWORK_MESSAGE };
  }

  if (error instanceof Error && error.message) {
    return { status: 0, message: error.message };
  }

  return { status: 0, message: UNKNOWN_MESSAGE };
}

/** "body.email" -> "email", "query.ids" -> "ids", "body.files.0.path" -> "files.0.path" */
export function getFieldName(field: string): string {
  return field.replace(/^(body|query|params)\./, "");
}

/** Map details to { email: "message", ... } (first message per field wins) */
export function getFieldErrors(error: NormalizedError): Record<string, string> {
  const result: Record<string, string> = {};
  (error.details ?? []).forEach((detail: ApiErrorDetail) => {
    const name = getFieldName(detail.field);
    if (!(name in result)) {
      result[name] = detail.message;
    }
  });
  return result;
}
