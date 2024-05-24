import { FoundItem } from "@prisma/client";

export type TSortOrder = "asc" | "desc";

export type TReportFoundItemPayload = Pick<
  FoundItem,
  "categoryId" | "foundItemName" | "description" | "location"
>;
