import { ClaimStatus } from "@prisma/client";
import { z } from "zod";

const create = z.object({
  foundItemId: z
    .string({
      invalid_type_error: "Found Item ID must be a string.",
      required_error: "Found Item ID is required.",
    })
    .min(1, { message: "Found Item ID can't be empty." }),
  distinguishingFeatures: z.string({
    invalid_type_error: "Distinguishing Features must be a string.",
    required_error: "Distinguishing Features is required.",
  }),
  lostDate: z
    .string({
      invalid_type_error: "Lost Date must be a string.",
      required_error: "Lost Date is required.",
    })
    .datetime({ message: "Invalid Date Time - Lost Date." }),
});

const updateStatus = z.object({
  status: z.enum([...Object.values(ClaimStatus)] as [string, ...string[]]),
});

export const ClaimValidation = { create, updateStatus };
