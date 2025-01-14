interface BalanceProps {
  member: string;
  balance?: number;
  currency: string;
}

const Balance = ({ member, balance, currency }: BalanceProps) => {
  let color = "text-gray-500";
  if (balance) {
    if (balance < 0) color = "text-red-600";
    if (balance > 0) color = "text-green-600";
  }
  return (
    <li className="py-3 sm:py-4 ">
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex items-center text-base font-semibold text-gray-900 ">
          {member}
        </div>
        <div
          className={`inline-flex items-center text-base font-semibold ${color}`}
        >
          {balance && balance > 0 ?  `+${balance} ${currency}` : `${balance} ${currency}`}
        </div>
      </div>
    </li>
  );
};

export default Balance;
