import { LostItem } from "@prisma/client";

export type TReportLostItemPayload = Pick<
  LostItem,
  | "categoryId"
  | "lostItemName"
  | "description"
  | "location"
  | "lostDate"
  | "contactNo"
  | "brand"
  | "image"
>;
