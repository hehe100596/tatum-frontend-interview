import { AddressBalance } from "@tatumio/tatum";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export interface Token {
  label: string;
  address: string;
  id: string;
}

export interface Balances {
  erc20: Token[];
  erc721: Token[];
  erc1155: Token[];
}

/* Merge classes with tailwind-merge with clsx full feature */
export const clsxm = (...classes: ClassValue[]) => twMerge(clsx(...classes));

/* Process wallet balances in the desired format */
export const doSthWithData = (data: AddressBalance[]) => {
  const balances: Balances = {
    erc20: [],
    erc721: [],
    erc1155: [],
  };

  for (const bal of data) {
    if (bal.type === "fungible")
      balances.erc20.push({
        label: `${bal.asset || "Unknown"}${
          bal.balance ? `: ${bal.balance}` : ""
        }`,
        address: bal.tokenAddress || "?",
      });
    else if (bal.type === "nft")
      balances.erc721.push({
        label: `${bal.asset || "Unknown"}`,
        address: bal.tokenAddress || "?",
        id: bal.tokenId || "",
      });
    else
      balances.erc1155.push({
        label: `${bal.asset || "Unknown"}${
          bal.balance ? `: ${bal.balance}` : ""
        }`,
        address: bal.tokenAddress || "?",
        id: bal.tokenId || "",
      });
  }

  return balances;
};
