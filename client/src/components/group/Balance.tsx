interface BalanceProps {
  member: string;
  balance?: number;
  currency: string;
}

const Balance = ({ member, balance, currency }: BalanceProps) => {
  let color = "text-base-content";
  if (balance) {
    if (balance < 0) color = "text-error";
    if (balance > 0) color = "text-success";
  }
  return (
    <li className="py-2 sm:py-3 ">
      <div className="flex items-center justify-between gap-8">
        <div className="inline-flex items-center  font-semibold ">
          {member}
        </div>
        <div
          className={`inline-flex items-center font-semibold ${color}`}
        >
          {balance && balance > 0 ?  `+${balance} ${currency}` : `${balance} ${currency}`}
        </div>
      </div>
    </li>
  );
};

export default Balance;
