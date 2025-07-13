export default function CurrencyFormat(amt :number ,currency:string) {
    return Intl.NumberFormat("en-us", {
        style: "currency",
        currency:currency,
    }).format(amt);

}