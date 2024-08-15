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

const updateCategory = async (id: string, payload: { name: string }) => {
  const categoryWithId = await prisma.category.findFirst({
    where: { id },
  });

  if (!categoryWithId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Category not found");
  }

  const categoryWithSameName = await prisma.category.findFirst({
    where: { name: payload.name.toLowerCase() },
  });

  if (categoryWithSameName) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Category already exists with this name"
    );
  }

  const result = await prisma.category.update({
    where: { id },
    data: { name: payload.name.toLowerCase() },
  });

  return result;
};

const getAllCategories = async () => {
  const result = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          foundItem: true,
          lostItem: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return result;
};

const getCategoryById = async (id: string) => {
  const result = await prisma.category.findFirst({
    where: { id },
  });

  return result;
};

export const CategoryService = {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
};
