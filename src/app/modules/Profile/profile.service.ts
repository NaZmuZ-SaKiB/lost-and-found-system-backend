import prisma from "../../utils/prisma";

const updateProfile = async (
  userId: string,
  payload: { bio?: string; age?: number }
) => {
  const result = await prisma.userProfile.update({
    where: {
      userId,
    },
    data: payload,
    include: {
      user: true,
    },
  });

  delete (result as any).user.password;

  return result;
};

export const ProfileService = {
  updateProfile,
};
