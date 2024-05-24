import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prisma";

const createCategory = async (payload: { name: string }) => {
  const category = await prisma.category.findFirst({
    where: { name: payload.name.toLowerCase() },
  });

  if (category) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category already exists");
  }

  const result = await prisma.category.create({
    data: { name: payload.name.toLowerCase() },
  });

  return result;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany();

  return result;
};

export const CategoryService = {
  createCategory,
  getAllCategories,
};
