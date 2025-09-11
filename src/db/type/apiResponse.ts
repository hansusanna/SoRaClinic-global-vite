// src/db/type/api-types.ts
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

  // 사용할때 
  // import type { ApiResponse } from "@/db/type/api-types";