import React from "react";

import { Token, Balances } from "@/lib/utils";

import Card from "../atoms/Card";
import Tab from "../atoms/Tab";

const Portfolio = ({ balances }: { balances: Balances }): JSX.Element => {
  let activeTab = 1;

  const TokenList = ({ items }: { items: Token[] }): JSX.Element => (
    <div className="flex flex-col mt-4 text-gray-200 space-y-0 overflow-scroll max-h-40 divide-y">
      {items[0] ? (
        items.map((item) => (
          <span className="p-4">
            <b>{item.label}</b>
            <b className="float-right">{item.id ? ` (${item.id})` : ""}</b>
            <p>{item.address}</p>
          </span>
        ))
      ) : (
        <i>No tokens</i>
      )}
    </div>
  );

  return (
    <Card className="space-y-2">
      <div className="flex pb-2">
        <Tab
          active={activeTab === 1}
          text="Fungibles"
          onClick={() => {
            activeTab = 1;
          }}
        />
        <Tab
          active={activeTab === 2}
          text="NFTs"
          onClick={() => {
            activeTab = 2;
          }}
        />
        <Tab
          active={activeTab === 3}
          text="Multitokens"
          onClick={() => {
            activeTab = 3;
          }}
        />
      </div>

      {activeTab === 1 && <TokenList items={balances.erc20} />}
      {activeTab === 2 && <TokenList items={balances.erc721} />}
      {activeTab === 3 && <TokenList items={balances.erc1155} />}
    </Card>
  );
};

export default Portfolio;
