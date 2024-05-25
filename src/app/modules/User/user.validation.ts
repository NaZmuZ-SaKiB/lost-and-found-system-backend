import z from "zod";

const create = z.object({
  email: z
    .string({
      required_error: "Email is required.",
      invalid_type_error: "Email must be a string.",
    })
    .email({ message: "Invalid Email" }),
  password: z
    .string({
      required_error: "Password is required.",
      invalid_type_error: "Password must be a string.",
    })
    .min(6, { message: "Password must be minimum 8 chars." }),

  profile: z.object({
    contactNo: z.string({
      required_error: "Contact No is required.",
      invalid_type_error: "Contact No must be a string.",
    }),
    name: z.string({
      required_error: "Name is required.",
      invalid_type_error: "Name must be a string.",
    }),
  }),
});

const login = z.object({
  email: z
    .string({
      required_error: "Email is required.",
      invalid_type_error: "Email must be a string.",
    })
    .email({ message: "Invalid Email" }),
  password: z.string({
    required_error: "Password is required.",
    invalid_type_error: "Password must be a string.",
  }),
});

export const changePassword = z.object({
  oldPassword: z.string({
    required_error: "Old Password is required.",
    invalid_type_error: "Old Password must be a string.",
  }),
  newPassword: z
    .string({
      required_error: "New Password is required.",
      invalid_type_error: "New Password must be a string.",
    })
    .min(6, { message: "Password must be minimum 6 chars." }),
});

export const UserValidation = {
  create,
  login,
  changePassword,
};
