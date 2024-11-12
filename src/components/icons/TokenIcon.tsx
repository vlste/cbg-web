import { ETHIcon } from "./ETHIcon";
import { TONIcon } from "./TONIcon";
import { USDTIcon } from "./USDTIcon";

export const TokenIcon = (
  { token, bg = true }: { token: string; bg: boolean },
) => {
  if (token.toUpperCase() === "USDT") {
    return bg
      ? (
        <div className="bg-[#009393] rounded-full p-[2px] text-white">
          <USDTIcon />
        </div>
      )
      : (
        <div className="text-white">
          <USDTIcon />
        </div>
      );
  }
  if (token.toUpperCase() === "TON") {
    return bg
      ? (
        <div className="bg-[#35AFF1] rounded-full p-[1px] text-white">
          <TONIcon />
        </div>
      )
      : (
        <div className="text-white">
          <TONIcon />
        </div>
      );
  }
  if (token.toUpperCase() === "ETH") {
    return bg
      ? (
        <div className="bg-[#627EEA] rounded-full p-[2px] text-white">
          <ETHIcon />
        </div>
      )
      : (
        <div className="text-white">
          <ETHIcon />
        </div>
      );
  }
};
