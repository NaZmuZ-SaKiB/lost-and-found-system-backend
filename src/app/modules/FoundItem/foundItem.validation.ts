import z from "zod";

const reportFoundItem = z.object({
  categoryId: z
    .string({
      invalid_type_error: "Category ID must be a string.",
      required_error: "Category ID is required.",
    })
    .min(1, { message: "Category ID can't be empty." }),
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
});

export const FoundItemValidation = {
  reportFoundItem,
};
