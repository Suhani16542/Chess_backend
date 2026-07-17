export const API_PREFIX = "/api";

export const LEAD_STATUS = {
  NEW: "New",
  CONTACTED: "Contacted",
  CONVERTED: "Converted",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};