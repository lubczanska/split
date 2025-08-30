/*
Greedy algorithm for calculating close-to-optimal reimbursement scheme.
*/
function simplifyTransactions(balances: Map<string, number>) {
  const transfers: [string, string, number][] = [];
  const owing: { value: number; key: string }[] = [];
  const owed: { value: number; key: string }[] = [];

  balances.forEach((value, key) => {
    if (value > 0) owed.push({ value, key });
    else if (value < 0) owing.push({ value: -1 * value, key });
  });
  while (owing && owed) {
    owing.sort();
    owed.sort();
    const maxOwed = owed.shift();
    const maxOwing = owing.shift();
    if (!maxOwed || !maxOwing) {
      return transfers;
    }
    const min = Math.min(maxOwing.value, maxOwed.value);

    transfers.push([maxOwing.key, maxOwed.key, min]);
    if (maxOwing.value < maxOwed.value) {
      owed.push({
        value:
          Math.round((maxOwed.value - maxOwing.value + Number.EPSILON) * 100) /
          100,
        key: maxOwed.key,
      });
    } else if (maxOwing.value > maxOwed.value) {
      owing.push({
        value:
          Math.round((maxOwing.value - maxOwed.value + Number.EPSILON) * 100) /
          100,
        key: maxOwing.key,
      });
    }
  }
  return transfers;
}

export default simplifyTransactions;
