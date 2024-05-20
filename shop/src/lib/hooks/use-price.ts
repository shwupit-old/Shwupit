import { useSettings } from '@/data/settings';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export function formatPrice({
  amount,
  currencyCode,
  locale,
}: {
  amount: number;
  currencyCode: string;
  locale: string;
}) {
  const formatCurrency = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  });

  return formatCurrency.format(amount);
}

export default function usePrice(
  data?: {
    amount: number;
    currencyCode?: string;
  } | null
) {
  const { settings } = useSettings();
  const { locale: currentLocale } = useRouter();
  const { amount, currencyCode = settings?.currency ?? 'USD' } = data ?? {};
  const value = useMemo(() => {
    if (typeof amount !== 'number' || !currencyCode) return '';
    const locale = currentLocale ?? 'en';
    return formatPrice({ amount, currencyCode, locale });
  }, [amount, currencyCode, currentLocale]);
  return { price: value };
}