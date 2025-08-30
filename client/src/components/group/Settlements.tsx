interface SettlementsProps {
  settlements: [string, string, number][];
  currency?: string;
  settleDebt: (from: string, to: string, amt: number) => void;
  loggedIn: boolean;
}

const Settlements = ({
  settlements,
  currency,
  settleDebt,
  loggedIn,
}: SettlementsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="card-title pb-4">Suggested Reimbursements</span>
      {settlements.map(([from, to, amt]) => (
        <div className="bg-base-200 px-4 py-4 rounded-lg flex flex-col justify-around items-center gap-2">
          <div className="flex gap-2">
            <p className="font-semibold">{from}</p>
            <p>owes</p>
            <p className="font-semibold">{to} </p>
          </div>
          <div className="flex gap-6 items-center">
            <p className="text-lg font-semibold">
              {amt} {currency}
            </p>
            {loggedIn && (
              <button
                className="btn btn-secondary btn-xs"
                onClick={(e: { stopPropagation: () => void }) => {
                  e.stopPropagation();
                  settleDebt(from, to, amt);
                }}
              >
                Settle
              </button>
            )}
          </div>
        </div>
      ))}
      {/* <Button label="Balances" onClick={() => setSettlements(null)} /> */}
    </div>
  );
};
export default Settlements;
