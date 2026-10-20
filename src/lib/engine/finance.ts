/**
 * Cost of paying a dental bill over time. Two cases, no lender named:
 *  - an installment loan or card balance repaid in equal monthly payments at a fixed APR;
 *  - a deferred-interest promotion: no interest if the whole balance is paid within the promotion, otherwise
 *    the interest that accrued on the balance since the purchase date is charged at once (Consumer Financial
 *    Protection Bureau, "What is deferred interest?"). Interest accrues monthly on the balance still owed.
 */
export interface Loan { monthly: number; totalInterest: number; total: number }

export function amortize(amount: number, aprPct: number, months: number): Loan {
  const P = Math.max(0, amount), n = Math.max(1, Math.round(months)), r = Math.max(0, aprPct) / 100 / 12;
  if (P === 0) return { monthly: 0, totalInterest: 0, total: 0 };
  const monthly = r === 0 ? P / n : (P * r) / (1 - (1 + r) ** -n);
  return { monthly, totalInterest: monthly * n - P, total: monthly * n };
}

export interface Deferred {
  /** Equal payment that clears the balance inside the promotion. */
  payoffMonthly: number;
  /** Balance left when the promotion ends if only `paidMonthly` is paid each month. */
  leftAtEnd: number;
  /** Interest charged back at the end of the promotion when a balance is left (0 otherwise). */
  backInterest: number;
}

export function deferred(amount: number, aprPct: number, promoMonths: number, paidMonthly: number): Deferred {
  const P = Math.max(0, amount), n = Math.max(1, Math.round(promoMonths)), r = Math.max(0, aprPct) / 100 / 12;
  let bal = P, accrued = 0;
  for (let m = 0; m < n && bal > 0; m++) {
    accrued += bal * r;
    bal = Math.max(0, bal - Math.max(0, paidMonthly));
  }
  return { payoffMonthly: P / n, leftAtEnd: bal, backInterest: bal > 0.005 ? accrued : 0 };
}
