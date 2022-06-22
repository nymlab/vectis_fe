import { Coin } from "@cosmjs/stargate";
import { convertFromMicroDenom, convertMicroDenomToDenom } from "utils/conversion";

type TokenAmountProps = {
  token: Coin;
  fixedLength?: number;
};

const TokenAmount: React.FC<TokenAmountProps> = ({ token, fixedLength }) => {
  const amount = convertMicroDenomToDenom(token.amount);
  return (
    <span>
      {fixedLength ? amount.toFixed(fixedLength) : amount} {convertFromMicroDenom(token.denom)}
    </span>
  );
};

export default TokenAmount;
