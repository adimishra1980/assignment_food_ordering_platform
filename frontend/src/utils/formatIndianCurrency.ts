
export function formatIndianCurrency(amount: number) {
  if (typeof amount !== "number") {
    amount = Number(amount);
    if (isNaN(amount)) return ""; // Return empty if not a number
  }

  return (
    "₹" +
    amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}
