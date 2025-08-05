import { currencyOption, TCurrencyKey } from '@/lib/utils';

export default function CurrencyFormat(
  amt: number,
  currency: string,
  forPDF: boolean = false
): string {
  if (forPDF) {
    const symbol = currencyOption[currency.toUpperCase() as TCurrencyKey] || currency + " ";
    return `${symbol} ${Number(amt).toFixed(2)}`;
  }

  return Intl.NumberFormat("en-us", {
    style: "currency",
    currency: currency,
  }).format(amt);
}
