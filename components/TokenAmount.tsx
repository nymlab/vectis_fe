import { Coin } from "@cosmjs/stargate";
import { convertFromMicroDenom, convertMicroDenomToDenom } from "utils/conversion";

type TokenAmountProps = {
  token?: Coin;
};
function TokenAmount({ token }: TokenAmountProps) {
  return (
    <span>
      {convertMicroDenomToDenom(token?.amount ?? 0)} {convertFromMicroDenom(token?.denom ?? "")}
    </span>
  );
}

export default TokenAmount;
