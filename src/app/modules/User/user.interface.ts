import { User, UserProfile } from "@prisma/client";

export type TCreateUserPayload = Pick<User, "email" | "password"> & {
  profile: Pick<UserProfile, "contactNo" | "name">;
};
