"use server";

import { revalidatePath } from "next/cache";
import prismadb from "../prisma";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { Product } from "@prisma/client";
export async function scrapeAndStoreProduct(url: string) {
  if (!url) return;

  try {
    const scrapedProduct = await scrapeAmazonProduct(url);

    if (!scrapedProduct) return;

    const existingProduct = await prismadb.product.findFirst({
      where: {
        url: scrapedProduct.url,
      },
    });

    let product: Product;
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
    revalidatePath(`/products/${product.id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product:- ${error.message}`);
  }
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
