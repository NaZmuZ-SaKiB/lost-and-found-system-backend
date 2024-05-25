import { z } from "zod";

const updateProfile = z.object({
  email: z
    .string({
      invalid_type_error: "Email must be a string.",
    })
    .email({ message: "Invalid Email" })
    .optional(),

  profile: z.object({
    contactNo: z
      .string({
        invalid_type_error: "Contact No must be a string.",
      })
      .optional(),
    name: z
      .string({
        invalid_type_error: "Name must be a string.",
      })
      .optional(),
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
  }),
});

export const ProfileValidation = {
  updateProfile,
};
