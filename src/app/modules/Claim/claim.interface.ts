import { Claim } from "@prisma/client";

export type TCreateClaimPayload = Pick<
  Claim,
  "foundItemId" | "distinguishingFeatures" | "lostDate"
>;
