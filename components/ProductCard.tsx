import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link href={`/products/${product.id}`} className="product-card">
      <div className="product-card_img-container">
        <Image
          src={product.image}
          alt={product.title}
          width={200}
          height={200}
          className="product-card_image"
        />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="product-title">{product.title}</h3>
        <div className="flex justify-between">
          <p className="text-black opacity-50 text-lg capitalize">
            {product.category}
          </p>
          <p className="text-black text-lg font-semibold">
            <span>{product.currency}</span>
            <span>{product.currentPrice}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
