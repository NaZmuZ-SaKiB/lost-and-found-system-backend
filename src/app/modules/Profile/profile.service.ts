import prisma from "../../utils/prisma";

const updateProfile = async (
  userId: string,
  payload: Record<string, unknown>
) => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const updateProfile = await transactionClient.userProfile.update({
      where: {
        userId,
      },
      data: payload.profile as any,
      include: {
        user: true,
      },
    });

    delete (updateProfile as any).user.password;

    await transactionClient.user.update({
      where: {
        id: userId,
      },
      data: {
        email: payload.email as string,
      },
    });

    return updateProfile;
  });

  return result;
};

export const ProfileService = {
  updateProfile,
};
