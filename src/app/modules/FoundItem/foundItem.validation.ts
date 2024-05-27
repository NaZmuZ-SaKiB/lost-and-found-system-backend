import z from "zod";

const reportFoundItem = z.object({
  categoryId: z.string({
    invalid_type_error: "Category ID must be a string.",
    required_error: "Category ID is required.",
  }),

  foundItemName: z.string({
    invalid_type_error: "Found Item Name must be a string.",
    required_error: "Found Item Name is required.",
  }),

  description: z.string({
    invalid_type_error: "Description must be a string.",
    required_error: "Description is required.",
  }),

  location: z.string({
    invalid_type_error: "Location must be a string.",
    required_error: "Location is required.",
  }),

  foundDate: z
    .string({
      invalid_type_error: "Lost Date must be a string.",
    })
    .optional(),

  contactNo: z
    .string({
      invalid_type_error: "Contact No must be a string.",
    })
    .optional(),

  brand: z
    .string({
      invalid_type_error: "Brand must be a string.",
    })
    .optional(),

  claimProcess: z
    .string({
      invalid_type_error: "Claim Process must be a string.",
    })
    .optional(),

  image: z
    .string({
      invalid_type_error: "Image must be a string.",
    })
    .optional(),
});

export const FoundItemValidation = {
  reportFoundItem,
};
