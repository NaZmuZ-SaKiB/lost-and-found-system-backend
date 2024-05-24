import { User, UserProfile } from "@prisma/client";

export type TCreateUserPayload = Pick<User, "email" | "password" | "name"> & {
  profile: Pick<UserProfile, "contactNo">;
};
