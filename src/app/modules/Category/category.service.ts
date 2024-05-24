import prisma from "../../utils/prisma";

const createCategory = async (payload: { name: string }) => {
  const result = await prisma.foundItemCategory.create({
    data: payload,
  });

  return result;
};

export const CategoryService = {
  createCategory,
};
