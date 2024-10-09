import { UUID } from "node:crypto";

export interface DBRequest {
  method: "hSet" | "hGet" | "scan";
  id: UUID;
  key: string;
  value?: unknown;
}

export interface DBResponse {
  id: UUID;
  method: "hSet" | "hGet" | "scan";
  status: "success" | "failure";
  data: unknown;
}
