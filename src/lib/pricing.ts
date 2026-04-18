export const ADMIN_FEE_RATE = 0.1;

export const roundMoney = (value: number) => Number((Number(value) || 0).toFixed(2));

export const calculateAdminFeeAmount = (baseAmount: number) =>
  roundMoney((Number(baseAmount) || 0) * ADMIN_FEE_RATE);

export const calculateClientPaymentAmount = (baseAmount: number) =>
  roundMoney((Number(baseAmount) || 0) + calculateAdminFeeAmount(baseAmount));
