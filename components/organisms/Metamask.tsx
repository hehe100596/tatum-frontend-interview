/* Required since nextjs13 to define a client component */
"use client";

import { TatumSDK, Network, Ethereum } from "@tatumio/tatum";
import * as React from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";

import { Balances, clsxm, doSthWithData } from "@/lib/utils";

import Button from "../atoms/Button";
import Card from "../atoms/Card";
import Loading from "../atoms/Loading";
import Portfolio from "../molecules/Portfolio";

const Metamask = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  const [account, setAccount] = React.useState("");
  const [optional, setOptional] = React.useState("");
  const [balances, setBalances] = React.useState<Balances>({
    coin: "",
    erc20: [],
    erc721: [],
    erc1155: [],
  });

  const fetchBalances = async (address: string) => {
    if (!loading) setLoading(true);

    TatumSDK.init<Ethereum>({
      network: Network.ETHEREUM_SEPOLIA,
    }).then((tatum) => {
      let bal = null;

      /* https://docs.tatum.com/docs/wallet-address-operations/get-all-assets-the-wallet-holds */
      tatum.address
        .getBalance({
          addresses: [address],
        })
        .then((res) => {
          bal = res;
        });

      if (!bal) {
        toast.error("Balances failed to load");
      }

      setBalances(doSthWithData(bal?.data));

      // destroy Tatum SDK - needed for stopping background jobs
      tatum.destroy();

      setLoading(false);
    });
  };

  const connectMetamask = () => {
    setAccount(optional);
    fetchBalances(account);
  };

  return (
    <>
      <Card
        className={clsxm(
          "absolute justify-center transition-opacity duration-500 lg:inset-0",
          account ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <Image
          src="/metamask.svg"
          alt="Metamask Logo"
          width={200}
          height={50}
          priority
          className="pb-4"
        />
        <input
          type="text"
          value={optional}
          onChange={(e) => setOptional(e.target.value)}
          className="block w-[360px] text-sm text-center py-2 mt-1 border border-black rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter wallet address"
          required
        />
        <Button onClick={connectMetamask} disabled={loading}>
          {loading ? <Loading /> : "Connect"}
        </Button>
      </Card>
      <Card
        className={clsxm(
          "transition-opacity min-w-[300px] duration-500",
          account ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <Card className="text-sm text-white bg-gray-800 rounded-lg shadow-lg p-6">
          <Card className="space-y-3">
            <Image
              className="mb-3"
              src="/metamask.svg"
              alt="Metamask Logo"
              width={60}
              height={15}
              priority
            />
            <div className="text-xl">{balances.coin}</div>
            <input
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="block w-[360px] text-center py-2 mt-1 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-700"
              placeholder="Enter custom wallet address"
              required
            />
          </Card>
          <Portfolio balances={balances} />
          <Button
            className="w-full border-white"
            disabled={loading}
            onClick={() => fetchBalances(account)}
          >
            {loading ? <Loading /> : "Refresh Balances"}
          </Button>
        </Card>
      </Card>
    </>
  );
};

export default Metamask;
