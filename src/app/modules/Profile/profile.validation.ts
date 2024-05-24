import { z } from "zod";

const updateProfile = z
  .object({
    bio: z
      .string({
        invalid_type_error: "Bio must be a string.",
      })
      .optional(),

    age: z
      .number({
        invalid_type_error: "Age must be a number.",
      })
      .optional(),
  })
  .refine(
    (body) => {
      if (!body.age && !body.bio) return false;
      return true;
    },
    { message: "No data provided. You can update your bio and age." }
  );

export const ProfileValidation = {
  updateProfile,
};
