import React from 'react';
import Image from '@/components/ui/image';
import placeholder from '@/assets/images/placeholders/product.svg';
import { useRemoveFromWishlist } from '@/data/wishlist';
import usePrice from '@/lib/hooks/use-price';
import { isFree } from '@/lib/is-free';
import AddToCart from '@/components/cart/add-to-cart';
import FreeDownloadButton from '@/components/product/free-download-button';
import classNames from 'classnames';
import { HeartFillIcon } from '@/components/icons/heart-fill';
import Link from '@/components/ui/link';
import type { Product } from '@/types';

export function WishlistItem({ product }: { product: Product }) {
  const { removeFromWishlist, isLoading } = useRemoveFromWishlist();
  const { id, slug, name, image, price: main_price, sale_price, shop } = product ?? {};

  const { price } = usePrice({
    amount: sale_price ? sale_price : main_price,
  });
  const productSingleUrl =
    product?.language !== process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE
      ? `${product?.language}/products/${product?.slug}`
      : `/products/${product?.slug}`;

  const isFreeItem = isFree(product?.sale_price ?? product?.price);

  return (
    <div className="flex items-start gap-4 border-b border-light-400 py-4 last:border-b-0 dark:border-dark-400 sm:gap-5">
      <div className="relative aspect-[5/3.4] w-28 flex-shrink-0 border border-light-300 dark:border-0 sm:w-32 md:w-36">
        <Image
          alt={name}
          fill
          quality={100}
          src={image?.thumbnail ?? placeholder}
          className="bg-light-400 object-cover dark:bg-dark-400"
        />
      </div>
      <div className="sm:flex-start flex flex-1 flex-col gap-3 sm:flex-row sm:justify-between md:gap-0">
        <div className="border-b border-light-400 pb-4 dark:border-dark-600 sm:border-b-0 sm:pb-0">
          <Link
            href={`${productSingleUrl}`}
            className="font-medium text-dark dark:text-light sm:mb-1.5"
            locale={product?.language}
          >
            {name}
          </Link>
          <p className="pt-0.5 font-medium text-gray-500 dark:text-gray-400 sm:pt-0">
            {shop?.name}
          </p>
          <div className="mt-2 sm:mt-3">
            <span className="rounded-full bg-light-500 px-1.5 py-1 text-13px font-semibold uppercase text-brand dark:bg-dark-500 dark:text-brand-dark">
              {isFreeItem ? 'Free' : price}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5 xs:pb-4 xs:pt-8 md:flex-nowrap md:gap-3.5 lg:gap-4">
          {!isFreeItem ? (
            <AddToCart
              item={product}
              withPrice={false}
              toastClassName="-mt-10 xs:mt-0"
              className="w-full flex-1 shrink-0 rounded border border-light-200 bg-brand text-brand hover:bg-transparent hover:text-light-200 dark:border-dark-600 dark:bg-dark-250 dark:text-brand dark:hover:text-brand-dark"
            />
          ) : (
            <FreeDownloadButton
              productId={id}
              productSlug={slug}
              productName={name}
              className="w-full flex-1 text-brand"
            />
          )}

          <button
            type="button"
            className={classNames(
              'flex min-h-[46px] w-12 shrink-0 items-center justify-center rounded border border-brand  transition-colors hover:bg-transparent hover:text-light-200 dark:border-dark-600 sm:h-12',
              {
                '!border-accent': true,
              }
            )}
            disabled={isLoading}
            onClick={() => {
              removeFromWishlist(product?.id);
            }}
          >
            <HeartFillIcon className="text-accent h-5 w-5 text-brand dark:text-brand dark:hover:text-brand-dark " />
          </button>
        </div>
      </div>
    </div>
  );
}