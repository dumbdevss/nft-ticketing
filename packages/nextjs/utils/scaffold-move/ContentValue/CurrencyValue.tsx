import React from "react";

const APTOS_DECIMALS = 8;

function trimRight(rightSide: string) {
  while (rightSide.endsWith("0")) {
    rightSide = rightSide.slice(0, -1);
  }
  return rightSide;
}


export function getFormattedBalanceStr(balance: string, decimals?: number, fixedDecimalPlaces?: number): string {
  // Validate balance
  if (!/^\d+$/.test(balance)) {
    throw new Error("Balance must be a string of digits");
  }

  // Default to 2 decimal places
  fixedDecimalPlaces = fixedDecimalPlaces ?? 2;
  decimals = Math.max(0, decimals || APTOS_DECIMALS); // Ensure non-negative

  // If balance is zero or decimals is 0, return "0"
  if (balance === "0" || decimals === 0) {
    return "0";
  }

  const len = balance.length;

  // If length is less than decimals, pad with 0s
  if (len <= decimals) {
    const padded = "0".repeat(decimals - len) + balance;
    const num = parseFloat("0." + padded);
    return num.toFixed(fixedDecimalPlaces);
  }

  // Insert decimal point at len - decimals
  const leftSide = BigInt(balance.slice(0, len - decimals)).toLocaleString("en-US");
  let rightSide = balance.slice(len - decimals);

  // Convert to number and use toFixed
  const num = parseFloat(leftSide.replace(/,/g, "") + "." + rightSide);
  let result = num.toFixed(fixedDecimalPlaces);

  // Remove trailing zeros, keep minimum fixedDecimalPlaces
  const [integerPart, decimalPart] = result.split(".");
  if (decimalPart) {
    const trimmedDecimal = trimRight(decimalPart);
    result = integerPart + (trimmedDecimal ? "." + trimmedDecimal : "");
    if (trimmedDecimal.length < fixedDecimalPlaces) {
      result += "0".repeat(fixedDecimalPlaces - trimmedDecimal.length);
    }
  }

  return result;
}

type CurrencyValueProps = {
  amount: string;
  decimals?: number;
  fixedDecimalPlaces?: number;
  currencyCode?: string | React.ReactNode;
};

export default function CurrencyValue({ amount, decimals, fixedDecimalPlaces, currencyCode }: CurrencyValueProps) {
  const number = getFormattedBalanceStr(amount, decimals, fixedDecimalPlaces);
  if (currencyCode) {
    return (
      <span>
        {number} {currencyCode}
      </span>
    );
  } else {
    return <span>{number}</span>;
  }
}

export function APTCurrencyValue({ amount: amountStr, decimals, fixedDecimalPlaces }: CurrencyValueProps) {
  // remove leading "-" when it's a negative number
  let amount = amountStr;
  if (amountStr.startsWith("-")) {
    amount = amountStr.substring(1);
  }

  return <CurrencyValue {...{ amount, decimals, fixedDecimalPlaces }} currencyCode="MOVE" />;
}
