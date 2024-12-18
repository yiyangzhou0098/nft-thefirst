import { useState } from "react";
import { parseEther } from "viem";
import { Collectible } from "./MyHoldings";
import { Address, AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

export const NFTCard = ({ nft }: { nft: Collectible }) => {
  const [transferToAddress, setTransferToAddress] = useState("");
  const [thisBidValue, setThisBidValue] = useState(nft.highestBid);

  const { writeContractAsync } = useScaffoldWriteContract("EnglishAuction");

  const bidIt = async () => { 
    try {
      const newBid = BigInt(thisBidValue) + BigInt(1);
      await writeContractAsync({
        functionName: "bid",
        args: [nft.auctionId],
        value: newBid
      })
      setThisBidValue(newBid);
        } catch (err) {
        console.error("Error Bidding Auction");
      }
    }

  const endAuction = async () => {
    try {
      await writeContractAsync({
        functionName: "endAuction",
        args: [nft.auctionId]
      })
    } catch (err) {
      console.error("Error Ending Auction");
    }
  }

  const EndAuctionBtn = () => (
    <button onClick={endAuction} className="btn btn-secondary btn-md px-8 tracking-wide">
      End Auction
    </button>
  );

  return (
    <div className="card card-compact bg-base-100 shadow-lg w-[300px] shadow-secondary">
      <figure className="relative">
        {/* eslint-disable-next-line  */}
        <img src={nft.image} alt="NFT Image" className="h-60 min-w-full" />
        <figcaption className="glass absolute bottom-4 left-4 p-4 w-25 rounded-xl">
          <span className="text-white "># {nft.id}</span>
        </figcaption>
      </figure>
      <div className="card-body space-y-3">
        <div className="flex items-center justify-center">
          <p className="text-xl p-0 m-0 font-semibold">{nft.name}</p>
          <div className="flex flex-wrap space-x-2 mt-1">
            {nft.attributes?.map((attr, index) => (
              <span key={index} className="badge badge-primary py-3">
                {attr.value}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center mt-1">
          <p className="my-0 text-lg">{nft.description}</p>
        </div>
        <div className="flex space-x-3 mt-1 items-center">
          <span className="text-lg font-semibold">Owner : </span>
          <Address address={nft.owner} />
        </div>
        <div className="flex space-x-3 mt-1 items-center">
          <span className="text-lg font-semibold">Collection:</span>
          <Address address={nft.collectionAddress} />
        </div>
        <div className="flex flex-col my-2 space-y-1">
          <span className="text-lg font-semibold mb-1">Transfer To: </span>
          <AddressInput
            value={transferToAddress}
            placeholder="receiver address"
            onChange={newValue => setTransferToAddress(newValue)}
          />
        </div>
        <div className="card-actions justify-center">
          <button
            className="btn btn-secondary btn-md px-8 tracking-wide"
            onClick={() => {
              // try {
              //   writeContractAsync({
              //     functionName: "transferFrom",
              //     args: [nft.owner, transferToAddress, BigInt(nft.id.toString())],
              //   });
              // } catch (err) {
              //   console.error("Error calling transferFrom function");
              // }
            }}
          >
            Send
          </button>
          <button className="btn btn-secondary btn-md px-8 tracking-wide" onClick={bidIt}>
              Place Bid
            </button>
        </div>
        <div className="card-actions justify-center">
          <span className="text-lg font-semibold mb-2">Highest Bid: {Number(nft.highestBid)} </span>
        </div>
          {nft.isOwner && <EndAuctionBtn/>}
      </div>
    </div>
  );
};
