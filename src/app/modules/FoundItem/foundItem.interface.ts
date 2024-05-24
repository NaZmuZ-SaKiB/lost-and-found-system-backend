import { FoundItem } from "@prisma/client";

export type TReportFoundItemPayload = Pick<
  FoundItem,
  | "categoryId"
  | "foundItemName"
  | "description"
  | "location"
  | "foundDate"
  | "contactNo"
  | "brand"
  | "image"
>;
