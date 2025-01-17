import { PMT } from "@/utils/mortgageFormulae";
import {
  deleteQueryParams,
  getQueryParameter,
  indexToLetter,
} from "@/utils/urlQueryParams";

export function calculateStampDuty(scenarioIndex: number) {
  const housePrice = Number(getQueryParameter(`hp${scenarioIndex}`));
  if (housePrice <= 250000) return 0;
  const lowerTier = Math.max(0, Math.min(925000, housePrice) - 125000) * 0.05;
  const middleTier = Math.max(0, Math.min(1500000, housePrice) - 925000) * 0.1;
  const upperTier = Math.max(0, housePrice - 1500000) * 0.12;
  const newValue = lowerTier + middleTier + upperTier;
  return newValue;
}
export function calculateLTV(scenarioIndex: number) {
  const housePrice = Number(getQueryParameter(`hp${scenarioIndex}`));
  const principal =
    Number(getQueryParameter(`p${scenarioIndex}`)) ||
    calculatePrincipal(scenarioIndex);

  return Math.round((100 * principal) / housePrice);
}
export function calculateAgentFees(scenarioIndex: number) {
  const salePrice = Number(getQueryParameter(`sp${scenarioIndex}`));
  const agentFees =
    salePrice * (Number(getQueryParameter(`af${scenarioIndex}`)) * 0.01);

  return agentFees;
}

export function calculatePrincipal(scenarioIndex: number) {
  deleteQueryParams(`p${scenarioIndex}`);
  const deposit =
    Number(getQueryParameter(`d${scenarioIndex}`)) ||
    calculateDeposit(scenarioIndex);
  const extraCapital = Number(getQueryParameter(`ec${scenarioIndex}`));
  const housePrice = Number(getQueryParameter(`hp${scenarioIndex}`));
  const solicitorFees = Number(getQueryParameter(`sf${scenarioIndex}`));
  const stampDuty = calculateStampDuty(scenarioIndex);
  const newValue =
    housePrice + solicitorFees + stampDuty - extraCapital - deposit;
  // if (newValue) updateQueryParams(`p${scenarioIndex}`, `${newValue}`);
  return newValue;
}
export function calculateDeposit(scenarioIndex: number) {
  deleteQueryParams(`d${scenarioIndex}`);
  deleteQueryParams(`p${scenarioIndex}`);
  const salePrice = Number(getQueryParameter(`sp${scenarioIndex}`));
  const agentFees =
    salePrice * (Number(getQueryParameter(`af${scenarioIndex}`)) * 0.01);
  const conveyanceFees = Number(getQueryParameter(`cf${scenarioIndex}`));
  const mortgage = Number(getQueryParameter(`cm${scenarioIndex}`));
  const newValue = salePrice - agentFees - mortgage - conveyanceFees;
  // if (newValue) updateQueryParams(`d${scenarioIndex}`, `${newValue}`);
  return newValue;
}
export function calculatePayment(scenarioIndex: number, mortgageIndex: number) {
  const mortgageLetter = indexToLetter(mortgageIndex);
  const mortgageSuffix = `${scenarioIndex}${mortgageLetter}`;

  const principal =
    Number(getQueryParameter(`p${scenarioIndex}`)) ||
    calculatePrincipal(scenarioIndex);
  const rate = Number(getQueryParameter(`r${mortgageSuffix}`));
  const term = Number(getQueryParameter(`t${scenarioIndex}`));
  const fixedTerm = Number(getQueryParameter(`ft${mortgageSuffix}`));
  const productFee = Number(getQueryParameter(`f${mortgageSuffix}`));
  const monthlyProductFee = productFee / fixedTerm / 12;
  const overPayment = Number(getQueryParameter(`op${mortgageSuffix}`));
  const pmt = PMT(rate * 0.01, term, principal);
  const newValue = Math.round(monthlyProductFee + pmt + overPayment);
  // if (newValue) updateQueryParams(`d${scenarioIndex}`, `${newValue}`);
  return newValue;
}
export function calculateSellingFees(scenarioIndex: number) {
  return (
    calculateAgentFees(scenarioIndex) +
    Number(getQueryParameter(`cf${scenarioIndex}`))
  );
}

export function calculateBuyingFees(scenarioIndex: number) {
  return (
    calculateStampDuty(scenarioIndex) +
    Number(getQueryParameter(`sf${scenarioIndex}`))
  );
}

export function calculateAllFees(scenarioIndex: number) {
  return (
    calculateBuyingFees(scenarioIndex) + calculateSellingFees(scenarioIndex)
  );
}
