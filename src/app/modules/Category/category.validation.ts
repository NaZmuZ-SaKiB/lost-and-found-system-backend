import z from "zod";

const create = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be a string.",
      required_error: "Name is required.",
    })
    .min(3, { message: "Name must be at least 3 char long." }),
});

export const CategoryValidation = {
  create,
};
