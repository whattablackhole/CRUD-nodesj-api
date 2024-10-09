import { UUID } from "node:crypto";

export interface DBRequest {
  method: "hSet" | "hGet" | "scan" | "delete" | "update";
  id: UUID;
  key: string;
  value?: unknown;
}

export interface DBResponse {
  id: UUID;
  method: "hSet" | "hGet" | "scan" | "delete" | "update";
  status: "success" | "failure";
  data: unknown;
}
