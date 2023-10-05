"use server";

import prismadb from "../prisma";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { Product } from "@prisma/client";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(url: string) {
  if (!url) return;
  let product: Product;

  try {
    const scrapedProduct = await scrapeAmazonProduct(url);

    if (!scrapedProduct) return;

    const existingProduct = await prismadb.product.findFirst({
      where: {
        url: scrapedProduct.url,
      },
    });

    if (existingProduct) {
      const updatedPriceHistory = [
        ...existingProduct.priceHistory,
        scrapedProduct.currentPrice,
      ];
      product = await prismadb.product.update({
        where: {
          url: existingProduct.url,
        },
        data: {
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        },
      });
    } else {
      product = await prismadb.product.create({
        data: {
          ...scrapedProduct,
        },
      });
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update product:- ${error.message}`);
  }
  return product;
}

export async function getProductById(productId: string) {
  try {
    const product = await prismadb.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!product) return null;

    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    const products = await prismadb.product.findMany();

    return products;
  } catch (error) {
    console.log(error);
  }
}

export async function getSimilarProducts(productId: string) {
  try {
    const product = await prismadb.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!product) return null;

    const similarProduct = await prismadb.product.findMany({
      where: {
        category: product?.category,
      },
      take: 3,
    });

    return similarProduct;
  } catch (error) {
    console.log(error);
  }
}

export async function addUserEmailToProduct(
  productId: string,
  userEmail: string
) {
  try {
    const product = await prismadb.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!product) return;

    if (!product.users.includes(userEmail)) {
      const updateUsers = [...product.users, userEmail];
      await prismadb.product.update({
        where: {
          id: productId,
        },
        data: {
          users: updateUsers,
        },
      });

      const emailContent = await generateEmailBody(product, "WELCOME");

      await sendEmail(emailContent, [userEmail]);
    }
  } catch (error) {
    console.log(error);
  }
}
