import { scrapeAndStoreProduct } from "@/lib/actions";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import prismadb from "@/lib/prisma";
import { getEmailNotifType } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prismadb.product.findMany();

    if (!products) throw new Error("No Product found");

    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        const updatedProduct = await scrapeAndStoreProduct(currentProduct.url);

        if (!updatedProduct) throw new Error("Error in Product Update");

        const emailNotifType = getEmailNotifType(
          updatedProduct,
          currentProduct
        );

        if (emailNotifType && updatedProduct.users.length > 0) {
          const productInfo = {
            title: updatedProduct.title,
            url: updatedProduct.url,
          };
          const emailContent = await generateEmailBody(
            productInfo,
            emailNotifType
          );

          await sendEmail(emailContent, updatedProduct.users);
        }
        return updatedProduct;
      })
    );
    return NextResponse.json({
      message: "ok",
      data: updatedProducts,
    });
  } catch (error) {
    throw new Error(`Error while running CRON job:- ${error}`);
  }
}
