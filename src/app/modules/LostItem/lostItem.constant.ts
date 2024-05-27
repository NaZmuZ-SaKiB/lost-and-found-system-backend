import { LostItem } from "@prisma/client";
import { TSortOrder } from "../../interfaces";

const searchableFields: (keyof LostItem)[] = [
  "lostItemName",
  "location",
  "description",
  "brand",
  "contactNo",
];

const sortableFields: string[] = ["lostItemName", "category", "lostDate"];
const validSortOrders: TSortOrder[] = ["asc", "desc"];

export const LostItemConstants = {
  searchableFields,
  sortableFields,
  validSortOrders,
};
