interface DebtProps {
  debt?: number;
  currency?: string;
  onClick: () => void;
  showButton: boolean;
}

const DebtStat = ({ debt, currency, onClick, showButton }: DebtProps) => {
  let smallText = "You are all good";
  let btnText = "see all debts";
  let bg = "bg-neutral"
  if (debt && debt < 0) {
    smallText = "You owe";
    btnText = "show your debts";
    bg="bg-secondary"

  } else if (debt && debt > 0) {
    smallText = "You are owed";
    btnText = "show who owes you";
    bg="bg-primary"
  }
  return (
    <div className={"stats text-primary-content mb-4 " + bg}>
      <div className="stat">
        <p className="stat-title text-black">{smallText}</p>
         <p className="stat-value">
          {debt ? Math.abs(debt) : 0} {currency}
        </p>
        {showButton && (
          <div className="stat-actions">
            <button className="btn btn-success btn-sm" onClick={onClick}>
              {btnText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebtStat;
