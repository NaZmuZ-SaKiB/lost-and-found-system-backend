import { FoundItem } from "@prisma/client";
import { TSortOrder } from "../../interfaces";

const searchableFields: (keyof FoundItem)[] = [
  "foundItemName",
  "location",
  "description",
];

const sortableFields: string[] = ["foundItemName", "category", "foundDate"];
const validSortOrders: TSortOrder[] = ["asc", "desc"];

export const FoundItemConstants = {
  searchableFields,
  sortableFields,
  validSortOrders,
};
