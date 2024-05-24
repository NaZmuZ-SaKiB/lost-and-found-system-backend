import { z } from "zod";

const reportLostItem = z.object({
  categoryId: z.string({
    invalid_type_error: "Category ID must be a string.",
    required_error: "Category ID is required.",
  }),
  lostItemName: z.string({
    invalid_type_error: "Found Item Name must be a string.",
    required_error: "Found Item Name is required.",
  }),
  brand: z
    .string({
      invalid_type_error: "Brand must be a string.",
    })
    .optional(),

  description: z.string({
    invalid_type_error: "Description must be a string.",
    required_error: "Description is required.",
  }),
  location: z.string({
    invalid_type_error: "Location must be a string.",
    required_error: "Location is required.",
  }),
  lostDate: z
    .string({
      invalid_type_error: "Lost Date must be a string.",
    })
    .optional(),

  contactNo: z
    .string({
      invalid_type_error: "Contact No must be a string.",
    })
    .optional(),
});

export const LostItemValidation = {
  reportLostItem,
};
