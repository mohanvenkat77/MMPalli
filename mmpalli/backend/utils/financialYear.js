// backend/utils/financialYear.js
const getFinancialYear = (date) => {
  const d = new Date(date);
  const month = d.getMonth() + 1; // 1-12
  const year = d.getFullYear();

  if (month >= 4) {
    return `${year}-${String(year + 1).slice(2)}`;
  } else {
    return `${year - 1}-${String(year).slice(2)}`;
  }
};

const getCurrentFinancialYear = () => {
  return getFinancialYear(new Date());
};

const getFinancialYearOptions = () => {
  const currentFY = getCurrentFinancialYear();
  const startYear = 2023;
  const currentYear = new Date().getFullYear();
  const options = [];

  for (let y = startYear; y <= currentYear + 1; y++) {
    options.push(`${y}-${String(y + 1).slice(2)}`);
  }
  return options;
};

module.exports = { getFinancialYear, getCurrentFinancialYear, getFinancialYearOptions };