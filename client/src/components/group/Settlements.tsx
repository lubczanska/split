interface SettlementsProps {
    settlements: [string, string, number][];
    currency?: string;
    settleDebt: (from: string, to: string, amt: number) => void;
}

const Settlements = ({settlements, currency, settleDebt}: SettlementsProps) => {
return (
    <div className="flex flex-col gap-2">
    <span className="card-title">Suggested Reimbursements</span>
    {settlements.map(([from, to, amt]) => (
      <div className="flex flex-wrap justify-around items-center gap-2 py-1">
        <div className="flex gap-2">
          <p className="font-semibold">{from}</p>
          <p>owes</p>
          <p className="font-semibold">{to} </p>
        </div>
        <p className="text-lg font-semibold">
          {amt} {currency}{" "}
        </p>
        <button
          className="btn btn-secondary btn-xs"
          onClick={(e: { stopPropagation: () => void }) => {
            e.stopPropagation();
            settleDebt(from, to, amt);
          }}
        >
          Settle{" "}
        </button>
      </div>
    ))}
    {/* <Button label="Balances" onClick={() => setSettlements(null)} /> */}
  </div>
)
} 
export default Settlements;