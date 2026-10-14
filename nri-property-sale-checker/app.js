/**
 * NRI Property Sale Checker - Interactive Client Engine
 * 100% Deterministic Client-Side Calculation Engine
 * Compliant with Income-tax Act, 2025 (TY 2026-27), CBDT Notification 121/2026,
 * backward-compatible with Income-tax Act, 1961.
 */

// Embedded Law Rules 1961 Act
const RULES_1961 = {
  "version": "1961",
  "effective_to": "2026-03-31",
  "last_verified": "2026-10-10",
  "law_name": "Income-tax Act, 1961",
  "ltcg_property": {
    "rate": 0.125,
    "indexation_nri": false,
    "section_new": "112",
    "section_old": "112",
    "source_url": "https://incometaxindia.gov.in"
  },
  "stcg_property": {
    "slab_rate_default": 0.30,
    "section_new": "Normal Slabs",
    "section_old": "Normal Slabs",
    "verify_note": "Taxed at slab rates for non-residents (no 87A rebate)."
  },
  "holding_months_long_term": 24,
  "sdv_tolerance": 1.10,
  "sdv_section": {
    "section_new": "50C",
    "section_old": "50C"
  },
  "cess": 0.04,
  "surcharge": {
    "bands": [
      [5000000, 0.10],
      [10000000, 0.15]
    ],
    "ltcg_cap": 0.15,
    "marginal_relief": true
  },
  "tds": {
    "section_new": "195",
    "section_old": "195",
    "code": "1057",
    "no_pan_min_rate": 0.20,
    "pan_based_form_from": null,
    "form_individual_huf": "27Q",
    "form_other": "27Q",
    "form_old": "27Q",
    "cbdt_notification": null
  },
  "lower_deduction": {
    "section_new": "197",
    "section_old": "197",
    "form_new": "Form 13",
    "form_old": "Form 13"
  },
  "remittance": {
    "form_declaration_new": "Form 15CA",
    "form_declaration_old": "Form 15CA",
    "form_ca_cert_new": "Form 15CB",
    "form_ca_cert_old": "Form 15CB"
  },
  "exemptions": {
    "s82": {
      "code": "54",
      "name": "Residential house to residential house",
      "section_new": "54",
      "section_old": "54",
      "cap": 100000000,
      "lockin_years": 3,
      "timing_rule": "Purchase 1 year before or 2 years after transfer, or construct within 3 years."
    },
    "s85": {
      "code": "54EC",
      "name": "Capital Gains Bonds (NHAI, REC, PFC, IRFC)",
      "section_new": "54EC",
      "section_old": "54EC",
      "cap": 5000000,
      "months": 6,
      "lockin_years": 5,
      "timing_rule": "Invest within 6 months of transfer."
    },
    "s86": {
      "code": "54F",
      "name": "Other long-term asset to residential house",
      "section_new": "54F",
      "section_old": "54F",
      "cap": 100000000,
      "lockin_years": 3,
      "timing_rule": "Purchase 1 year before or 2 years after transfer, or construct within 3 years. Reinvest full net consideration for full relief."
    }
  },
  "fema": {
    "nro_annual_limit_usd": 1000000,
    "foreign_funds_description": "Repatriable up to foreign exchange originally remitted in (up to 2 residential properties)."
  },
  "verify_flags": []
};

// Embedded Law Rules 2026-27 (Income-tax Act, 2025)
const RULES_2026_27 = {
  "version": "2026-27",
  "effective_from": "2026-04-01",
  "last_verified": "2026-10-10",
  "law_name": "Income-tax Act, 2025 (Tax Year 2026-27)",
  "ltcg_property": {
    "rate": 0.125,
    "indexation_nri": false,
    "section_new": "197(1)(b)",
    "section_old": "112",
    "source_url": "https://incometaxindia.gov.in"
  },
  "stcg_property": {
    "slab_rate_default": 0.30,
    "section_new": "197",
    "section_old": "General Slab Rates",
    "verify_note": "Taxed at slab rates for non-residents (no 87A rebate). Verify Tax Year 2026-27 slabs from Finance Act, 2026."
  },
  "holding_months_long_term": 24,
  "sdv_tolerance": 1.10,
  "sdv_section": {
    "section_new": "50C equivalent (2025 Act)",
    "section_old": "50C"
  },
  "cess": 0.04,
  "surcharge": {
    "bands": [
      [5000000, 0.10],
      [10000000, 0.15]
    ],
    "ltcg_cap": 0.15,
    "marginal_relief": true
  },
  "tds": {
    "section_new": "393(2) Sl.17",
    "section_old": "195",
    "code": "1057",
    "no_pan_min_rate": 0.20,
    "pan_based_form_from": "2026-10-01",
    "form_individual_huf": "141-ScheduleE",
    "form_other": "144",
    "form_old": "27Q",
    "cbdt_notification": "CBDT Notification 121/2026 dated 22 Sep 2026"
  },
  "lower_deduction": {
    "section_new": "395",
    "section_old": "197",
    "form_new": "Form 128",
    "form_old": "Form 13"
  },
  "remittance": {
    "form_declaration_new": "Form 145",
    "form_declaration_old": "Form 15CA",
    "form_ca_cert_new": "Form 146",
    "form_ca_cert_old": "Form 15CB"
  },
  "exemptions": {
    "s82": {
      "code": "54",
      "name": "Residential house to residential house",
      "section_new": "82",
      "section_old": "54",
      "cap": 100000000,
      "lockin_years": 3,
      "timing_rule": "Purchase 1 year before or 2 years after transfer, or construct within 3 years."
    },
    "s85": {
      "code": "54EC",
      "name": "Capital Gains Bonds (NHAI, REC, PFC, IRFC)",
      "section_new": "85",
      "section_old": "54EC",
      "cap": 5000000,
      "months": 6,
      "lockin_years": 5,
      "timing_rule": "Invest within 6 months of transfer."
    },
    "s86": {
      "code": "54F",
      "name": "Other long-term asset to residential house",
      "section_new": "86",
      "section_old": "54F",
      "cap": 100000000,
      "lockin_years": 3,
      "timing_rule": "Purchase 1 year before or 2 years after transfer, or construct within 3 years. Reinvest full net consideration for full relief."
    }
  },
  "fema": {
    "nro_annual_limit_usd": 1000000,
    "foreign_funds_description": "Freely repatriable up to foreign exchange originally remitted in (up to 2 residential properties)."
  },
  "verify_flags": [
    "stcg_slabs",
    "tds_surcharge_basis",
    "sdv_section_new",
    "no_pan_section_new"
  ]
};

// Global State
let currentCalcData = null;
let currentCalcResult = null;
let isReportUnlocked = false;

// Format Currency in Indian Rupees
function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹ 0";
  const isNeg = amount < 0;
  const absAmt = Math.abs(Math.round(amount));
  const s = absAmt.toString();
  let lastThree = s.substring(s.length - 3);
  const otherNumbers = s.substring(0, s.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return (isNeg ? "-₹ " : "₹ ") + formatted;
}

// Convert INR to readable Lakh / Crore format
function formatWordsINR(amount) {
  const num = Math.abs(Number(amount));
  if (isNaN(num) || num === 0) return "₹ 0";
  if (num >= 10000000) {
    return `₹ ${(num / 10000000).toFixed(2)} Crore`;
  } else if (num >= 100000) {
    return `₹ ${(num / 100000).toFixed(2)} Lakh`;
  } else if (num >= 1000) {
    return `₹ ${(num / 1000).toFixed(1)} Thousand`;
  }
  return formatINR(num);
}

// Law Selection
function loadRules(transferDateStr) {
  let tDate;
  try {
    if (transferDateStr && transferDateStr.length === 4 && !isNaN(transferDateStr)) {
      tDate = new Date(parseInt(transferDateStr, 10), 9, 1);
    } else if (transferDateStr) {
      const parts = transferDateStr.split('-');
      tDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } else {
      tDate = new Date();
    }
  } catch (e) {
    tDate = new Date();
  }

  const cutoffDate = new Date(2026, 3, 1); // 2026-04-01
  if (tDate < cutoffDate) {
    return RULES_1961;
  }
  return RULES_2026_27;
}

// Holding Months Calculator
function calculateHoldingPeriodMonths(acqDateStr, trnDateStr) {
  function parseD(dStr) {
    try {
      if (dStr && dStr.length === 4 && !isNaN(dStr)) {
        return new Date(parseInt(dStr, 10), 3, 1);
      }
      const parts = dStr.split('-');
      return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    } catch (e) {
      return new Date();
    }
  }

  const acq = parseD(acqDateStr);
  const trn = parseD(trnDateStr);

  let months = (trn.getFullYear() - acq.getFullYear()) * 12 + (trn.getMonth() - acq.getMonth());
  if (trn.getDate() < acq.getDate()) {
    months -= 1;
  }
  months = Math.max(0, months);
  const isLongTerm = months > 24;
  return { months, isLongTerm };
}

// Surcharge & Marginal Relief
function calculateSurchargeAndRelief(baseTax, totalIncome, taxRate, rules) {
  if (baseTax <= 0 || totalIncome <= 0) {
    return { surcharge: 0.0, surchargeRate: 0.0, marginalRelief: 0.0 };
  }

  const bands = (rules.surcharge && rules.surcharge.bands) || [[5000000, 0.10], [10000000, 0.15]];
  const ltcgCap = (rules.surcharge && rules.surcharge.ltcg_cap) !== undefined ? rules.surcharge.ltcg_cap : 0.15;

  let surchargeRate = 0.0;
  let threshold = 0;

  for (let i = 0; i < bands.length; i++) {
    const bandLimit = bands[i][0];
    const rate = bands[i][1];
    if (totalIncome > bandLimit) {
      surchargeRate = Math.min(rate, ltcgCap);
      threshold = bandLimit;
    } else {
      break;
    }
  }

  if (surchargeRate === 0.0) {
    return { surcharge: 0.0, surchargeRate: 0.0, marginalRelief: 0.0 };
  }

  const nominalSurcharge = baseTax * surchargeRate;
  let marginalRelief = 0.0;

  if (threshold === 5000000) {
    const taxAtThreshold = threshold * taxRate;
    const maxTotalLiability = taxAtThreshold + (totalIncome - threshold);
    const actualLiability = baseTax + nominalSurcharge;
    if (actualLiability > maxTotalLiability) {
      marginalRelief = actualLiability - maxTotalLiability;
    }
  } else if (threshold === 10000000) {
    const taxAtThreshold = (threshold * taxRate) * 1.10;
    const maxTotalLiability = taxAtThreshold + (totalIncome - threshold);
    const actualLiability = baseTax + nominalSurcharge;
    if (actualLiability > maxTotalLiability) {
      marginalRelief = actualLiability - maxTotalLiability;
    }
  }

  const effectiveSurcharge = Math.max(0.0, nominalSurcharge - marginalRelief);
  return {
    surcharge: effectiveSurcharge,
    surchargeRate,
    marginalRelief
  };
}

// Tax Liability Computation
function calculateTaxLiability(gain, isLongTerm, otherIncome, rules) {
  if (gain <= 0) {
    return {
      base_tax: 0.0,
      tax_rate: 0.0,
      surcharge: 0.0,
      surcharge_rate: 0.0,
      marginal_relief: 0.0,
      cess: 0.0,
      total_tax: 0.0,
      effective_tax_rate: 0.0
    };
  }

  const taxRate = isLongTerm ? rules.ltcg_property.rate : ((rules.stcg_property && rules.stcg_property.slab_rate_default) || 0.30);
  const baseTax = gain * taxRate;
  const totalIncome = gain + otherIncome;

  const sr = calculateSurchargeAndRelief(baseTax, totalIncome, taxRate, rules);
  const taxPlusSurcharge = baseTax + sr.surcharge;
  const cessRate = rules.cess || 0.04;
  const cess = taxPlusSurcharge * cessRate;
  const totalTax = taxPlusSurcharge + cess;

  return {
    base_tax: Math.round(baseTax * 100) / 100,
    tax_rate: taxRate,
    surcharge: Math.round(sr.surcharge * 100) / 100,
    surcharge_rate: sr.surchargeRate,
    marginal_relief: Math.round(sr.marginalRelief * 100) / 100,
    cess: Math.round(cess * 100) / 100,
    total_tax: Math.round(totalTax * 100) / 100,
    effective_tax_rate: gain > 0 ? Math.round((totalTax / gain) * 10000) / 100 : 0.0
  };
}

// Statutory TDS Exposure
function computeTdsExposure(saleConsideration, isLongTerm, panAvailable, rules) {
  let baseRate = isLongTerm ? rules.ltcg_property.rate : ((rules.stcg_property && rules.stcg_property.slab_rate_default) || 0.30);
  if (!panAvailable) {
    const minNoPan = (rules.tds && rules.tds.no_pan_min_rate) || 0.20;
    baseRate = Math.max(baseRate, minNoPan);
  }

  const bands = (rules.surcharge && rules.surcharge.bands) || [[5000000, 0.10], [10000000, 0.15]];
  const ltcgCap = (rules.surcharge && rules.surcharge.ltcg_cap) !== undefined ? rules.surcharge.ltcg_cap : 0.15;
  let surchargeRate = 0.0;

  for (let i = 0; i < bands.length; i++) {
    const bandLimit = bands[i][0];
    const rate = bands[i][1];
    if (saleConsideration > bandLimit) {
      surchargeRate = Math.min(rate, ltcgCap);
    } else {
      break;
    }
  }

  const cessRate = rules.cess || 0.04;
  const effectiveRate = baseRate * (1.0 + surchargeRate) * (1.0 + cessRate);
  const tdsAmount = Math.round(saleConsideration * effectiveRate * 100) / 100;

  return {
    base_rate: baseRate,
    surcharge_rate: surchargeRate,
    cess_rate: cessRate,
    effective_rate: Math.round(effectiveRate * 1000000) / 1000000,
    effective_rate_percent: Math.round(effectiveRate * 10000) / 100,
    tds_exposure: tdsAmount
  };
}

// Buyer Reporting Routing
function determineBuyerReporting(transferDateStr, buyerType, rules) {
  const tdsRules = rules.tds || {};
  const panCutoff = tdsRules.pan_based_form_from;

  let isPanBasedEligible = false;
  if (panCutoff) {
    try {
      const partsT = transferDateStr.split('-');
      const tDate = new Date(parseInt(partsT[0], 10), parseInt(partsT[1], 10) - 1, parseInt(partsT[2], 10));
      const partsC = panCutoff.split('-');
      const cDate = new Date(parseInt(partsC[0], 10), parseInt(partsC[1], 10) - 1, parseInt(partsC[2], 10));
      if (tDate >= cDate && ["resident_individual_huf", "individual", "huf"].indexOf(buyerType) !== -1) {
        isPanBasedEligible = true;
      }
    } catch (e) {}
  }

  if (isPanBasedEligible) {
    return {
      form: tdsRules.form_individual_huf || "141-ScheduleE",
      mechanism: "PAN-based payment and reporting (No TAN needed)",
      deadline: "Within 30 days from the end of the month of deduction",
      code: tdsRules.code || "1057",
      section: tdsRules.section_new || "393(2) Sl.17",
      notification: tdsRules.cbdt_notification || "CBDT Notification 121/2026",
      notes: "Resident individual and HUF buyers do not require a TAN. Payment and challan-cum-statement filed via Form 141 Schedule E on e-filing portal."
    };
  } else {
    const formName = tdsRules.form_other || "144";
    const sectionName = rules.version === "2026-27" ? (tdsRules.section_new || "393(2)") : (tdsRules.section_old || "195");
    return {
      form: formName,
      mechanism: "TAN-based quarterly return & challan deposit",
      deadline: "Deposit by 7th of subsequent month; quarterly statement in Form " + formName,
      code: tdsRules.code || "1057",
      section: sectionName,
      notification: null,
      notes: "Buyer must obtain TAN (Tax Deduction Account Number). Deposit tax via challan under code 1057 and file statement."
    };
  }
}

// Section 54 / 54EC / 54F Exemption Modeling
function calculateExemptionScenarios(gain, isLongTerm, propertyType, otherIncome, netConsideration, rules) {
  const scenarios = {};
  if (!isLongTerm || gain <= 0) {
    return scenarios;
  }

  // 1. Section 54EC
  const s85 = (rules.exemptions && rules.exemptions.s85) || {};
  const cap54ec = s85.cap || 5000000;
  const invest54ec = Math.min(gain, cap54ec);
  const gainAfter54ec = Math.max(0.0, gain - invest54ec);
  const taxAfter54ec = calculateTaxLiability(gainAfter54ec, isLongTerm, otherIncome, rules);
  const baselineTax = calculateTaxLiability(gain, isLongTerm, otherIncome, rules);
  const savings54ec = Math.round((baselineTax.total_tax - taxAfter54ec.total_tax) * 100) / 100;

  scenarios["section_54ec"] = {
    section: s85.section_new || "85",
    section_old: s85.section_old || "54EC",
    name: s85.name || "Capital Gains Bonds (54EC)",
    eligible: true,
    max_investment_cap: cap54ec,
    investment_modeled: invest54ec,
    gain_after_exemption: Math.round(gainAfter54ec * 100) / 100,
    tax_after_exemption: taxAfter54ec.total_tax,
    tax_savings: savings54ec,
    lockin_period_years: s85.lockin_years || 5,
    investment_window_months: s85.months || 6,
    eligible_bonds: ["NHAI", "REC", "PFC", "IRFC"],
    timing_rule: s85.timing_rule || "Invest within 6 months of transfer."
  };

  // 2. Section 54
  const s82 = (rules.exemptions && rules.exemptions.s82) || {};
  const isHouseSold = ["residential", "house", "flat"].indexOf(propertyType) !== -1;
  const cap54 = s82.cap || 100000000;
  const invest54Modeled = Math.min(gain, cap54);
  const gainAfter54 = Math.max(0.0, gain - invest54Modeled);
  const taxAfter54 = calculateTaxLiability(gainAfter54, isLongTerm, otherIncome, rules);

  scenarios["section_54"] = {
    section: s82.section_new || "82",
    section_old: s82.section_old || "54",
    name: s82.name || "Residential House Reinvestment (Section 54)",
    eligible: isHouseSold,
    max_investment_cap: cap54,
    investment_modeled: isHouseSold ? invest54Modeled : 0,
    gain_after_exemption: isHouseSold ? Math.round(gainAfter54 * 100) / 100 : Math.round(gain * 100) / 100,
    tax_after_exemption: isHouseSold ? taxAfter54.total_tax : baselineTax.total_tax,
    tax_savings: isHouseSold ? Math.round((baselineTax.total_tax - taxAfter54.total_tax) * 100) / 100 : 0.0,
    lockin_period_years: s82.lockin_years || 3,
    timing_rule: s82.timing_rule || "Purchase 1 yr before / 2 yrs after, or construct within 3 yrs."
  };

  // 3. Section 54F
  const s86 = (rules.exemptions && rules.exemptions.s86) || {};
  const isNonHouseSold = ["plot", "commercial"].indexOf(propertyType) !== -1;
  const cap54f = s86.cap || 100000000;
  const invest54fModeled = Math.min(netConsideration, cap54f);
  const propRelief = netConsideration > 0 ? (gain * (invest54fModeled / netConsideration)) : 0;
  const gainAfter54f = Math.max(0.0, gain - propRelief);
  const taxAfter54f = calculateTaxLiability(gainAfter54f, isLongTerm, otherIncome, rules);

  scenarios["section_54f"] = {
    section: s86.section_new || "86",
    section_old: s86.section_old || "54F",
    name: s86.name || "Plot/Commercial Reinvestment (Section 54F)",
    eligible: isNonHouseSold,
    max_investment_cap: cap54f,
    investment_modeled: isNonHouseSold ? invest54fModeled : 0,
    gain_after_exemption: isNonHouseSold ? Math.round(gainAfter54f * 100) / 100 : Math.round(gain * 100) / 100,
    tax_after_exemption: isNonHouseSold ? taxAfter54f.total_tax : baselineTax.total_tax,
    tax_savings: isNonHouseSold ? Math.round((baselineTax.total_tax - taxAfter54f.total_tax) * 100) / 100 : 0.0,
    lockin_period_years: s86.lockin_years || 3,
    timing_rule: s86.timing_rule || "Reinvest full net consideration in 1 residential house in India."
  };

  return scenarios;
}

// FEMA Repatriation Channel & Headroom
function computeRepatriation(sourceOfFunds, fyRemittancesMadeUsd, rules) {
  const limitUsd = (rules.fema && rules.fema.nro_annual_limit_usd) || 1000000;

  if (sourceOfFunds === "nre_fcnr") {
    return {
      channel: "Foreign Currency Inward Remittance / NRE / FCNR Channel",
      limit_description: "Freely repatriable up to foreign exchange originally remitted in (covers up to 2 residential properties).",
      is_usd_million_route: false,
      annual_cap_usd: null,
      remittances_made_usd: fyRemittancesMadeUsd,
      headroom_usd: null,
      forms_required: ["Form 145 (15CA)", "Form 146 (15CB CA Certificate)", "Bank Form A2", "FIRC / Inward remittance certificate"],
      guidance_label: "Guidance; your Authorized Dealer (AD) bank decides",
      notes: "Proceeds can be repatriated freely up to initial foreign exchange remitted into India, without the USD 1M cap."
    };
  } else {
    const headroom = Math.max(0.0, limitUsd - fyRemittancesMadeUsd);
    return {
      channel: "NRO Account Scheme (RBI USD 1 Million per Financial Year)",
      limit_description: "Up to USD " + limitUsd.toLocaleString() + " per financial year from NRO account, subject to taxes paid.",
      is_usd_million_route: true,
      annual_cap_usd: limitUsd,
      remittances_made_usd: fyRemittancesMadeUsd,
      headroom_usd: headroom,
      forms_required: [
        (rules.remittance && rules.remittance.form_declaration_new) || "Form 145",
        (rules.remittance && rules.remittance.form_ca_cert_new) || "Form 146",
        "Bank Form A2 & FEMA Declaration",
        "Sale Deed & Tax Computation"
      ],
      guidance_label: "Guidance; your Authorized Dealer (AD) bank decides",
      notes: "Covers all NRO remittances combined (capital gains, rental income, deposits). Amount above $1M requires prior RBI approval."
    };
  }
}

// Timeline & Required Documents
function buildTimelineAndChecklist(transferDateStr, rules, isLongTerm, buyerReporting, hasLoss) {
  const lowerDec = rules.lower_deduction || {};
  const remittance = rules.remittance || {};

  const milestones = [
    {
      stage: "Pre-Sale / Before Registration",
      action: "Apply for Lower/Nil Deduction Certificate under Section " + (lowerDec.section_new || "395") + " (" + (lowerDec.form_new || "Form 128") + ")",
      detail: "Apply on e-filing / TRACES portal before property registration. Processing takes 3 to 6 weeks. Prevents over-deduction of TDS by buyer.",
      mandatory: !hasLoss,
      priority: "Critical"
    },
    {
      stage: "Registration & Payment",
      action: "Buyer Deducts TDS and Reports via " + buyerReporting.form,
      detail: buyerReporting.mechanism + ". Due: " + buyerReporting.deadline + ". Ensure seller PAN is quoted accurately.",
      mandatory: true,
      priority: "Critical"
    },
    {
      stage: "Advance Tax (if balance tax due)",
      action: "Pay Advance Tax instalments (15 June: 15%, 15 Sept: 45%, 15 Dec: 75%, 15 Mar: 100%)",
      detail: "If net tax liability after TDS deduction exceeds ₹10,000, interest under Sections 234B/234C applies if not deposited on schedule.",
      mandatory: true,
      priority: "Important"
    },
    {
      stage: "ITR Filing & Refund Claim",
      action: "File Indian Non-Resident Income Tax Return (ITR-2)",
      detail: "Reconcile TDS credits on AIS/Form 26AS. Claim refund of any excess TDS deducted by the buyer.",
      mandatory: true,
      priority: "Critical"
    },
    {
      stage: "Fund Repatriation Abroad",
      action: "Obtain " + (remittance.form_ca_cert_new || "Form 146") + " from CA and file " + (remittance.form_declaration_new || "Form 145"),
      detail: "Submit to Authorized Dealer (AD) bank along with Form A2 and sale deed to transfer sale proceeds overseas.",
      mandatory: true,
      priority: "Essential"
    }
  ];

  const documents = [
    "Title Deed / Registered Sale Deed of the property",
    "Purchase Deed / Allotment Letter / Possession Certificate of original acquisition",
    "Bank statements showing original inflow of funds (FIRC if foreign inward remittance)",
    "Proof of improvement expenses and renovation bills (if claiming)",
    "Brokerage and transfer expense payment receipts",
    "PAN Card of Seller and Buyer",
    "Passport / OCI Card and Overseas Tax Residence Proof",
    "NRO / NRE Bank Account details with AD Bank branch IFSC/SWIFT",
    "Agreement to Sell (for Lower Deduction Certificate application)"
  ];

  return { milestones, required_documents: documents };
}

// Master Deterministic Engine Function
function calculateNRIPropertySale(inputs) {
  const resStatus = String(inputs.residential_status || "").trim().toLowerCase();
  if (resStatus !== "non_resident" && resStatus !== "nri") {
    return {
      status: "STOP",
      gate: "residential_status",
      message: "Speak to an adviser. The calculation engine is strictly configured for Non-Resident Indians (NRIs). Resident sellers in India are taxed under distinct provisions: 1% TDS under Section 393(1) (earlier s.194-IA), availability of basic tax exemption adjustments, and the optional indexation benefit for pre-23 July 2024 purchases. NRI-only logic must never be applied to a resident or RNOR individual."
    };
  }

  const propType = String(inputs.property_type || "").trim().toLowerCase();
  if (["agricultural", "agricultural_land", "plantation", "farm_house"].indexOf(propType) !== -1) {
    return {
      status: "STOP",
      gate: "property_type",
      message: "FEMA Warning: Agricultural land, plantation property, and farm houses in India are out of scope. Under FEMA regulations, non-residents are prohibited from selling agricultural land or farm houses to any person other than a resident Indian citizen. Version 1 of this tool refuses agricultural property calculations."
    };
  }

  const transferDateStr = String(inputs.transfer_date || "2026-10-15").trim();
  const rules = loadRules(transferDateStr);

  const acqDateStr = String(inputs.acquisition_date || "2016-01-01").trim();
  const hp = calculateHoldingPeriodMonths(acqDateStr, transferDateStr);
  const holdingMonths = hp.months;
  const isLongTerm = hp.isLongTerm;

  const saleConsideration = parseFloat(inputs.sale_consideration) || 0;
  const stampDutyValue = parseFloat(inputs.stamp_duty_value) || saleConsideration;
  const sdvTolerance = rules.sdv_tolerance || 1.10;

  let fullValueOfConsideration;
  let isSdvDeemed;

  if (stampDutyValue > (saleConsideration * sdvTolerance)) {
    fullValueOfConsideration = stampDutyValue;
    isSdvDeemed = true;
  } else {
    fullValueOfConsideration = saleConsideration;
    isSdvDeemed = false;
  }

  const ownershipShare = parseFloat(inputs.ownership_share) || 100.0;
  const shareFraction = ownershipShare / 100.0;

  const userSaleConsideration = Math.round(saleConsideration * shareFraction * 100) / 100;
  const userSdv = Math.round(stampDutyValue * shareFraction * 100) / 100;
  const userFullValue = Math.round(fullValueOfConsideration * shareFraction * 100) / 100;

  const costOfAcquisition = (parseFloat(inputs.cost_of_acquisition) || 0) * shareFraction;
  const costOfImprovement = (parseFloat(inputs.cost_of_improvement) || 0) * shareFraction;
  const transferExpenses = (parseFloat(inputs.transfer_expenses) || 0) * shareFraction;

  const gain = Math.round((userFullValue - costOfAcquisition - costOfImprovement - transferExpenses) * 100) / 100;
  const isLoss = gain < 0;

  const otherIncome = parseFloat(inputs.other_indian_income) || 0;
  const taxDetails = calculateTaxLiability(gain, isLongTerm, otherIncome, rules);
  const totalTax = taxDetails.total_tax;

  const panAvailable = inputs.pan_available !== false && inputs.pan_available !== 'false';
  const tdsDetails = computeTdsExposure(userSaleConsideration, isLongTerm, panAvailable, rules);
  const tdsExposure = tdsDetails.tds_exposure;

  const gap = Math.max(0.0, Math.round((tdsExposure - totalTax) * 100) / 100);
  const certificateTds = totalTax;
  const certificateEffectiveRate = userSaleConsideration > 0 ? (Math.round((certificateTds / userSaleConsideration) * 10000) / 100) : 0.0;

  const netConsideration = userSaleConsideration - transferExpenses;
  const exemptionScenarios = calculateExemptionScenarios(gain, isLongTerm, propType, otherIncome, netConsideration, rules);

  const sourceOfFunds = String(inputs.source_of_funds || "nro_rupee").trim().toLowerCase();
  const remittancesAlreadyMadeUsd = parseFloat(inputs.fy_remittances_already_made_usd) || 0.0;
  const repatriationDetails = computeRepatriation(sourceOfFunds, remittancesAlreadyMadeUsd, rules);

  const buyerType = String(inputs.buyer_type || "resident_individual_huf").trim().toLowerCase();
  const buyerReporting = determineBuyerReporting(transferDateStr, buyerType, rules);

  const timelineAndDocs = buildTimelineAndChecklist(transferDateStr, rules, isLongTerm, buyerReporting, isLoss);

  return {
    status: "SUCCESS",
    law_version: rules.version,
    law_name: rules.law_name,
    effective_from: rules.effective_from,
    last_verified: rules.last_verified,
    holding_period: {
      months: holdingMonths,
      is_long_term: isLongTerm,
      asset_classification: isLongTerm ? "Long-Term Capital Asset" : "Short-Term Capital Asset",
      threshold_months: rules.holding_months_long_term || 24
    },
    consideration: {
      sale_price: userSaleConsideration,
      stamp_duty_value: userSdv,
      sdv_tolerance_ratio: sdvTolerance,
      is_sdv_deemed: isSdvDeemed,
      full_value_of_consideration: userFullValue,
      ownership_share_percent: ownershipShare,
      sdv_citation: rules.sdv_section && rules.sdv_section.section_new
    },
    deductions: {
      cost_of_acquisition: Math.round(costOfAcquisition * 100) / 100,
      cost_of_improvement: Math.round(costOfImprovement * 100) / 100,
      transfer_expenses: Math.round(transferExpenses * 100) / 100,
      total_deductions: Math.round((costOfAcquisition + costOfImprovement + transferExpenses) * 100) / 100,
      indexation_applied: false,
      indexation_note: "Indexation benefit is not available to Non-Residents as per current law (post 23 July 2024 regime)."
    },
    capital_gain: {
      gain_amount: gain,
      is_loss: isLoss,
      nature: isLongTerm ? "Long-Term Capital Gain" : "Short-Term Capital Gain",
      citation: isLongTerm ? (rules.ltcg_property && rules.ltcg_property.section_new) : (rules.stcg_property && rules.stcg_property.section_new)
    },
    tax_liability: taxDetails,
    tds_exposure: Object.assign({}, tdsDetails, {
      applied_on: "Entire Sale Consideration (as mandated by law without Lower Deduction Certificate)",
      section: rules.version === "2026-27" ? (rules.tds && rules.tds.section_new) : (rules.tds && rules.tds.section_old),
      payment_code: rules.tds && rules.tds.code
    }),
    gap_analysis: {
      tds_exposure: tdsExposure,
      actual_tax: totalTax,
      excess_tds_held: gap,
      certificate_tds: certificateTds,
      certificate_effective_rate_percent: certificateEffectiveRate,
      lower_deduction_section: rules.version === "2026-27" ? (rules.lower_deduction && rules.lower_deduction.section_new) : (rules.lower_deduction && rules.lower_deduction.section_old),
      lower_deduction_form: rules.version === "2026-27" ? (rules.lower_deduction && rules.lower_deduction.form_new) : (rules.lower_deduction && rules.lower_deduction.form_old),
      recommendation: gap > 0 ?
        ("Apply for a Lower/Nil Deduction Certificate under Section " + ((rules.lower_deduction && rules.lower_deduction.section_new) || '395') + " (" + ((rules.lower_deduction && rules.lower_deduction.form_new) || 'Form 128') + ") before registration to save " + formatINR(gap) + " from being locked up.") :
        "Tax liability matches TDS exposure."
    },
    exemptions: exemptionScenarios,
    repatriation: repatriationDetails,
    buyer_reporting: buyerReporting,
    timeline_and_docs: timelineAndDocs,
    verify_flags: rules.verify_flags || [],
    disclaimer: "Estimate for information and planning purposes only. Not tax, legal or FEMA advice. Subject to verification with official CBDT and RBI notifications."
  };
}

// Tab Switching
function switchMainTab(tabName) {
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

  const tabBtn = document.getElementById(`tab-btn-${tabName}`);
  const tabContent = document.getElementById(`tab-${tabName}-content`);
  if (tabBtn) tabBtn.classList.add('active');
  if (tabContent) tabContent.classList.add('active');

  if (tabName === 'buyer') {
    runBuyerChecker();
  }
}

// Flow Navigation
function startCheckFlow() {
  document.getElementById('hero-section').classList.add('hidden');
  const qSection = document.getElementById('qualifier-section');
  qSection.classList.remove('hidden');
  qSection.scrollIntoView({ behavior: 'smooth' });
  checkQualifierGates();
}

function loadWorkedExample() {
  document.getElementById('q-res-status').value = 'non_resident';
  document.getElementById('q-prop-type').value = 'residential';
  document.getElementById('q-transfer-date').value = '2026-10-15';
  document.getElementById('q-acq-mode').value = 'purchase';

  document.getElementById('inp-sale-price').value = '12000000';
  document.getElementById('inp-sdv').value = '12200000';
  document.getElementById('inp-acq-date').value = '2016-04-10';
  document.getElementById('inp-cost-acq').value = '6000000';
  document.getElementById('inp-cost-improv').value = '500000';
  document.getElementById('inp-expenses').value = '120000';
  document.getElementById('inp-ownership').value = '100';
  document.getElementById('inp-other-income').value = '0';
  document.getElementById('inp-pan-avail').value = 'true';
  document.getElementById('inp-buyer-type').value = 'resident_individual_huf';
  document.getElementById('inp-source-funds').value = 'nre_fcnr';
  document.getElementById('inp-fy-remittance-usd').value = '0';

  startCheckFlow();
  proceedToDetailsForm();
  executeFullCalculation();
}

// Qualifier Gate Logic (Step 1)
function checkQualifierGates() {
  const resStatus = document.getElementById('q-res-status').value;
  const propType = document.getElementById('q-prop-type').value;
  const stopAlert = document.getElementById('qualifier-stop-alert');
  const stopTitle = document.getElementById('stop-alert-title');
  const stopMsg = document.getElementById('stop-alert-message');
  const footerBtn = document.getElementById('qualifier-footer');

  if (resStatus !== 'non_resident') {
    stopAlert.classList.remove('hidden');
    stopTitle.innerText = "Residential Status Gate: Calculation Stopped";
    stopMsg.innerHTML = "<strong>Speak to an adviser.</strong> The calculation engine is strictly configured for Non-Resident Indians (NRIs). Under Indian tax law, resident sellers are governed by Section 393(1) (earlier Section 194-IA: 1% TDS on consideration above ₹50 lakh), can utilize basic tax exemption adjustments, and can opt for indexation on pre-23 July 2024 purchases. NRI rules must not be applied to a resident.";
    if (footerBtn) footerBtn.classList.add('hidden');
    return false;
  }

  if (propType === 'agricultural') {
    stopAlert.classList.remove('hidden');
    stopTitle.innerText = "FEMA Prohibition Gate: Out of Scope";
    stopMsg.innerHTML = "<strong>FEMA Warning:</strong> Under RBI regulations, Non-Residents (NRIs/OCIs) are strictly prohibited from selling agricultural land, plantation property, or farm houses to other non-residents. Agricultural property can only be sold to a resident Indian citizen, and requires specialized legal clearances. Version 1 of this tool refuses agricultural property calculations.";
    if (footerBtn) footerBtn.classList.add('hidden');
    return false;
  }

  stopAlert.classList.add('hidden');
  if (footerBtn) footerBtn.classList.remove('hidden');
  return true;
}

function proceedToDetailsForm() {
  if (!checkQualifierGates()) return;
  document.getElementById('qualifier-section').classList.add('hidden');
  const dSection = document.getElementById('details-section');
  dSection.classList.remove('hidden');
  dSection.scrollIntoView({ behavior: 'smooth' });
  liveUpdateCalculations();
}

function editQualifier() {
  document.getElementById('details-section').classList.add('hidden');
  document.getElementById('qualifier-section').classList.remove('hidden');
}

// Live Update for Inputs & Real-time Validations
function liveUpdateCalculations() {
  const price = parseFloat(document.getElementById('inp-sale-price').value) || 0;
  const sdv = parseFloat(document.getElementById('inp-sdv').value) || price;

  const wordsEl = document.getElementById('lbl-sale-price-words');
  if (wordsEl) wordsEl.innerText = formatWordsINR(price);

  const badge = document.getElementById('sdv-safeharbour-badge');
  if (badge) {
    if (sdv > price * 1.10) {
      badge.className = 'sdv-status-badge badge-red';
      badge.innerText = `Stamp Duty Exceeds 110% (Deemed Full Value: ${formatINR(sdv)})`;
    } else {
      badge.className = 'sdv-status-badge badge-green';
      badge.innerText = 'Within 110% Safe Harbour (No Deeming under s.50C)';
    }
  }

  const acqDate = document.getElementById('inp-acq-date').value;
  const trnDate = document.getElementById('q-transfer-date').value;
  const hpEl = document.getElementById('holding-period-indicator');
  if (acqDate && trnDate && hpEl) {
    const hp = calculateHoldingPeriodMonths(acqDate, trnDate);
    if (hp.isLongTerm) {
      hpEl.innerHTML = `Holding: <strong>${hp.months} months</strong> (Long-Term Capital Asset — 12.5% Tax Rate)`;
      hpEl.style.color = '#14b8a6';
    } else {
      hpEl.innerHTML = `Holding: <strong>${hp.months} months</strong> (Short-Term Capital Asset — Taxed at Slab Rates)`;
      hpEl.style.color = '#f59e0b';
    }
  }

  const sourceFunds = document.getElementById('inp-source-funds').value;
  const remWrap = document.getElementById('wrap-remittance-usd');
  if (remWrap) {
    if (sourceFunds === 'nre_fcnr') {
      remWrap.classList.add('hidden');
    } else {
      remWrap.classList.remove('hidden');
    }
  }
}

function resetDefaults() {
  document.getElementById('inp-sale-price').value = '12000000';
  document.getElementById('inp-sdv').value = '12200000';
  document.getElementById('inp-cost-acq').value = '6000000';
  document.getElementById('inp-cost-improv').value = '500000';
  document.getElementById('inp-expenses').value = '120000';
  liveUpdateCalculations();
}

// Master Client Execution (Instant, Deterministic, Zero Network Delay)
function executeFullCalculation() {
  const payload = {
    residential_status: document.getElementById('q-res-status').value,
    property_type: document.getElementById('q-prop-type').value,
    transfer_date: document.getElementById('q-transfer-date').value,
    acquisition_date: document.getElementById('inp-acq-date').value,
    mode_of_acquisition: document.getElementById('q-acq-mode').value,
    sale_consideration: parseFloat(document.getElementById('inp-sale-price').value) || 0,
    stamp_duty_value: parseFloat(document.getElementById('inp-sdv').value) || 0,
    cost_of_acquisition: parseFloat(document.getElementById('inp-cost-acq').value) || 0,
    cost_of_improvement: parseFloat(document.getElementById('inp-cost-improv').value) || 0,
    transfer_expenses: parseFloat(document.getElementById('inp-expenses').value) || 0,
    ownership_share: parseFloat(document.getElementById('inp-ownership').value) || 100,
    other_indian_income: parseFloat(document.getElementById('inp-other-income').value) || 0,
    pan_available: document.getElementById('inp-pan-avail').value === 'true',
    buyer_type: document.getElementById('inp-buyer-type').value,
    source_of_funds: document.getElementById('inp-source-funds').value,
    fy_remittances_already_made_usd: parseFloat(document.getElementById('inp-fy-remittance-usd').value) || 0,
  };

  currentCalcData = payload;
  const result = calculateNRIPropertySale(payload);
  currentCalcResult = result;
  renderResults(result);
}

// Render Results View
function renderResults(res) {
  if (res.status === 'STOP') {
    alert(res.message);
    return;
  }

  const resultsSection = document.getElementById('results-section');
  resultsSection.classList.remove('hidden');
  resultsSection.scrollIntoView({ behavior: 'smooth' });

  // 1. Top Gap Banner
  const gapData = res.gap_analysis || {};
  const gapAmt = gapData.excess_tds_held || 0;
  document.getElementById('res-gap-amount').innerText = formatINR(gapAmt);
  const tdsAmt = res.tds_exposure.tds_exposure;
  const taxAmt = res.tax_liability.total_tax;
  document.getElementById('res-gap-explanation').innerHTML = `
    The buyer is legally required to withhold <strong>${formatINR(tdsAmt)}</strong> unless you provide a Lower Deduction Certificate. 
    Your actual computed tax is only <strong>${formatINR(taxAmt)}</strong>. 
    Applying under <strong>Section ${gapData.lower_deduction_section} (${gapData.lower_deduction_form})</strong> protects <strong>${formatINR(gapAmt)}</strong> from remaining locked with the IT Department until your return refund.
  `;

  // 2. Metric Cards
  const gainData = res.capital_gain || {};
  document.getElementById('res-gain-value').innerText = formatINR(gainData.gain_amount);
  document.getElementById('res-gain-nature').innerText = gainData.nature;
  document.getElementById('res-gain-sub').innerText = `Full Value: ${formatINR(res.consideration.full_value_of_consideration)} - Deductions: ${formatINR(res.deductions.total_deductions)}`;

  const taxData = res.tax_liability || {};
  document.getElementById('res-tax-value').innerText = formatINR(taxData.total_tax);
  document.getElementById('res-tax-effective-rate').innerText = `${taxData.effective_tax_rate}% Effective`;
  document.getElementById('res-tax-sub').innerText = `Base: ${formatINR(taxData.base_tax)} + Surcharge: ${formatINR(taxData.surcharge)} + Cess: ${formatINR(taxData.cess)}`;

  const tdsData = res.tds_exposure || {};
  document.getElementById('res-tds-value').innerText = formatINR(tdsData.tds_exposure);
  document.getElementById('res-tds-rate').innerText = `${tdsData.effective_rate_percent}% on Gross Price`;
  document.getElementById('res-tds-sub').innerText = `Withheld on gross consideration of ${formatINR(res.consideration.sale_price)}`;

  document.getElementById('res-cert-rate').innerText = `${gapData.certificate_effective_rate_percent}%`;
  document.getElementById('res-cert-form-badge').innerText = `${gapData.lower_deduction_form} / s.${gapData.lower_deduction_section}`;
  document.getElementById('res-cert-sub').innerText = `Target withholding matches true tax: ${formatINR(taxData.total_tax)}`;

  // 3. Buyer Route Details
  const bRep = res.buyer_reporting || {};
  document.getElementById('res-buyer-form-name').innerText = bRep.form;
  document.getElementById('route-mechanism').innerText = bRep.mechanism;
  document.getElementById('route-form').innerText = bRep.form + (bRep.notification ? ` (${bRep.notification})` : '');
  document.getElementById('route-deadline').innerText = bRep.deadline;
  document.getElementById('route-code').innerText = `Code ${bRep.code} (Section ${bRep.section})`;

  // 4. FEMA Repatriation
  const repat = res.repatriation || {};
  document.getElementById('fema-channel-name').innerText = repat.channel;
  const fillEl = document.getElementById('headroom-progress-fill');
  const balEl = document.getElementById('headroom-balance-lbl');

  if (repat.is_usd_million_route) {
    const remMade = repat.remittances_made_usd || 0;
    const headroom = repat.headroom_usd || 0;
    const pct = Math.min(100, Math.round((remMade / 1000000) * 100));
    fillEl.style.width = `${pct}%`;
    balEl.innerHTML = `Available Headroom: <strong>$${headroom.toLocaleString()} USD</strong>`;
    document.getElementById('fema-notes-text').innerText = `Sale proceeds credit to NRO account. You have $${headroom.toLocaleString()} USD remaining in your annual $1M entitlement for this financial year (subject to Form 145/146 CA certification).`;
  } else {
    fillEl.style.width = '100%';
    balEl.innerHTML = `Route: <strong>Freely Repatriable Inward Remittance</strong>`;
    document.getElementById('fema-notes-text').innerText = "Foreign inward remittance funds are repatriable abroad up to the original foreign currency remitted into India, outside the USD 1 Million NRO cap.";
  }

  // 5. Legal Citations Panel
  document.getElementById('assumptions-law-title').innerText = res.law_name;
  const citGrid = document.getElementById('citation-grid');
  citGrid.innerHTML = `
    <div class="citation-pill">
      <strong>LTCG Property Rate</strong>
      <span>${res.law_version === '2026-27' ? 'Section 197(1)(b) (2025 Act)' : 'Section 112 (1961 Act)'} · 12.5% Flat</span>
    </div>
    <div class="citation-pill">
      <strong>TDS on NRI Seller</strong>
      <span>${res.law_version === '2026-27' ? 'Section 393(2), Sl. 17 · Code 1057' : 'Section 195 (1961 Act)'}</span>
    </div>
    <div class="citation-pill">
      <strong>Lower Deduction Route</strong>
      <span>${res.law_version === '2026-27' ? 'Section 395 · Form 128' : 'Section 197 · Form 13'}</span>
    </div>
    <div class="citation-pill">
      <strong>Resident Buyer Filing</strong>
      <span>${bRep.form} · ${bRep.mechanism}</span>
    </div>
    <div class="citation-pill">
      <strong>Safe Harbour 110%</strong>
      <span>${res.consideration.sdv_citation} · 10% Circle Rate Tolerance</span>
    </div>
    <div class="citation-pill">
      <strong>Remittance & CA Cert</strong>
      <span>${res.law_version === '2026-27' ? 'Forms 145 & 146 (2025 Act)' : 'Forms 15CA & 15CB (1961 Act)'}</span>
    </div>
  `;

  // 6. Populate Unlocked Modules
  renderUnlockedSections(res);
}

// Render Unlocked Report Data
function renderUnlockedSections(res) {
  // 1. Exemption Table
  const exTableBody = document.getElementById('exemptions-table-body');
  exTableBody.innerHTML = '';
  const exemptions = res.exemptions || {};

  for (const [key, ex] of Object.entries(exemptions)) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${ex.section_old} / s.${ex.section}</strong></td>
      <td>${ex.name}</td>
      <td>${formatINR(ex.max_investment_cap)}</td>
      <td>${ex.timing_rule}<br/><small>${ex.lockin_period_years} Years Lock-in</small></td>
      <td><strong>${formatINR(ex.investment_modeled)}</strong></td>
      <td>${formatINR(ex.tax_after_exemption)}</td>
      <td><strong style="color: #14b8a6;">${formatINR(ex.tax_savings)}</strong></td>
    `;
    exTableBody.appendChild(tr);
  }

  // 2. Buyer Instruction Letter
  const bRep = res.buyer_reporting || {};
  const gapData = res.gap_analysis || {};
  const letterBox = document.getElementById('buyer-letter-box');
  const letterText = `
TO: THE PURCHASER / BUYER OF THE PROPERTY
RE: TDS COMPLIANCE INSTRUCTIONS ON PURCHASE OF IMMOVABLE PROPERTY FROM NRI SELLER

Dear Sir / Madam,

With reference to the agreed transfer of the property, please take note of the mandatory statutory provisions governing TDS deduction and deposit under the Indian Income-tax Act:

1. NON-RESIDENT STATUS:
   The seller is a Non-Resident Indian (NRI). Please note that Section 393(1) (earlier Section 194-IA: 1% TDS) applies STRICTLY to resident sellers and DOES NOT apply to this transaction. Deducting 1% on an NRI sale is invalid under law and attracts personal penalty on the buyer of 1% to 1.5% interest per month plus ₹200/day late fees.

2. STATUTORY TDS WITHHOLDING PROVISION:
   - Governing Provision: Section ${bRep.section} (Payment Code ${bRep.code})
   - Standard Statutory Withholding Rate: ${res.tds_exposure.effective_rate_percent}% (including applicable surcharge & cess) on the gross sale consideration.

3. LOWER DEDUCTION CERTIFICATE APPLICATION:
   - Application has been submitted under Section ${gapData.lower_deduction_section} (${gapData.lower_deduction_form}) to the Assessing Officer (International Taxation).
   - Once issued, the certificate determines the exact rate of TDS to be deducted: ${gapData.certificate_effective_rate_percent}%, rather than the standard statutory rate.

4. BUYER DEPOSIT & REPORTING PROCEDURE:
   - Form to be filed: ${bRep.form}
   - Filing Mechanism: ${bRep.mechanism}
   ${bRep.notification ? `- Note: Under ${bRep.notification}, resident individual and HUF buyers do NOT require a TAN. Payment and challan-cum-statement can be filed directly on PAN.` : '- TAN is required.'}
   - Statutory Filing Due Date: ${bRep.deadline}

5. CHALLAN FURNISHING:
   Kindly share the official Form ${bRep.form} challan acknowledgement within 7 days of payment so tax credits reflect accurately on the seller's AIS / Form 26AS.

Yours sincerely,
Seller (Non-Resident Indian)
Date: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
`.trim();

  letterBox.innerText = letterText;

  // 3. Timeline Steps
  const tlSteps = document.getElementById('timeline-steps');
  tlSteps.innerHTML = '';
  const milestones = res.timeline_and_docs.milestones || [];
  milestones.forEach((m) => {
    const div = document.createElement('div');
    div.className = 'tl-step';
    div.innerHTML = `
      <div class="tl-dot">📌</div>
      <div class="tl-body">
        <strong>${m.stage}: ${m.action}</strong>
        <p>${m.detail}</p>
      </div>
    `;
    tlSteps.appendChild(div);
  });

  // 4. Checklist
  const clGrid = document.getElementById('checklist-grid');
  clGrid.innerHTML = '';
  const docs = res.timeline_and_docs.required_documents || [];
  docs.forEach(doc => {
    const div = document.createElement('div');
    div.className = 'cl-item';
    div.innerHTML = `<span class="cl-check">✓</span> <span>${doc}</span>`;
    clGrid.appendChild(div);
  });
}

function scrollToCertificateRoadmap() {
  const el = document.getElementById('certificate-roadmap-card');
  if (el) {
    if (!isReportUnlocked) {
      instantDemoUnlock();
    }
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

function toggleAssumptionsPanel() {
  const body = document.getElementById('assumptions-body');
  const icon = document.getElementById('assumptions-toggle-icon');
  if (body.classList.contains('hidden')) {
    body.classList.remove('hidden');
    icon.innerText = '▲';
  } else {
    body.classList.add('hidden');
    icon.innerText = '▼';
  }
}

// Payment Modal & Unlocking
function openPaymentModal() {
  document.getElementById('payment-modal').classList.remove('hidden');
}

function closePaymentModal() {
  document.getElementById('payment-modal').classList.add('hidden');
}

function submitSimulationPayment() {
  closePaymentModal();
  unlockReportView();
}

function instantDemoUnlock() {
  unlockReportView();
}

function unlockReportView() {
  isReportUnlocked = true;
  document.getElementById('unlock-card').classList.add('hidden');
  const unlocked = document.getElementById('unlocked-content');
  unlocked.classList.remove('hidden');
  unlocked.scrollIntoView({ behavior: 'smooth' });
}

// PDF Download & Print
function downloadPdfReport() {
  if (!currentCalcResult) {
    alert("Please calculate results first.");
    return;
  }
  // Ensure report is unlocked
  if (!isReportUnlocked) {
    unlockReportView();
  }
  // Trigger native print / PDF export
  window.print();
}

// Copy Buyer Letter to Clipboard
function copyBuyerLetter() {
  const letterBox = document.getElementById('buyer-letter-box');
  if (!letterBox) return;
  navigator.clipboard.writeText(letterBox.innerText).then(() => {
    alert("Letter copied to clipboard! You can paste it directly into an email or document.");
  }).catch(() => {
    alert("Could not copy automatically. Please select the text and copy manually.");
  });
}

// Buyer-Side Checker Tool (Hook)
function runBuyerChecker() {
  const price = parseFloat(document.getElementById('bc-price').value) || 0;
  const transferDate = document.getElementById('bc-transfer-date').value || "2026-10-15";
  const entity = document.getElementById('bc-buyer-entity').value;
  const hasCert = document.getElementById('bc-has-cert').value === 'yes';
  const certRateWrap = document.getElementById('bc-cert-rate-wrap');

  if (hasCert) {
    certRateWrap.classList.remove('hidden');
  } else {
    certRateWrap.classList.add('hidden');
  }

  const isPostOct2026 = new Date(transferDate) >= new Date('2026-10-01');
  const isPostApr2026 = new Date(transferDate) >= new Date('2026-04-01');

  let surchargeRate = 0.0;
  if (price > 10000000) surchargeRate = 0.15;
  else if (price > 5000000) surchargeRate = 0.10;

  const statEffectiveRate = 0.125 * (1 + surchargeRate) * 1.04;
  let effectiveRate = statEffectiveRate;
  let effectiveRatePercent = (statEffectiveRate * 100).toFixed(2);

  if (hasCert) {
    const customRate = parseFloat(document.getElementById('bc-cert-rate').value) || 6.41;
    effectiveRate = customRate / 100.0;
    effectiveRatePercent = customRate.toFixed(2);
  }

  const tdsAmount = Math.round(price * effectiveRate);

  let formName = "Form 144 (TAN-based)";
  let tanRequired = true;

  if (isPostOct2026 && entity === 'individual_huf') {
    formName = "Form 141 Schedule E (PAN-based)";
    tanRequired = false;
  } else if (!isPostApr2026) {
    formName = "Form 27Q (Section 195)";
  }

  const resDiv = document.getElementById('buyer-checker-result');
  resDiv.innerHTML = `
    <div class="buyer-result-box">
      <div class="flex-between mb-2">
        <div>
          <span class="step-badge">Buyer Obligation Summary</span>
          <h3 style="color: #ffffff; font-size: 20px;">Statutory TDS to Deduct: <span style="color: #f43f5e;">${formatINR(tdsAmount)}</span> (${effectiveRatePercent}%)</h3>
        </div>
        <span class="law-badge-sm">${formName}</span>
      </div>

      <div class="buyer-route-details">
        <div class="route-item">
          <strong>Applicable Section:</strong>
          <span>${isPostApr2026 ? 'Section 393(2), Sl. 17 (Code 1057)' : 'Section 195'}</span>
        </div>
        <div class="route-item">
          <strong>Filing Form:</strong>
          <span>${formName}</span>
        </div>
        <div class="route-item">
          <strong>Do You Need TAN?</strong>
          <span>${tanRequired ? 'YES (TAN Mandatory)' : 'NO (PAN-based filing allowed!)'}</span>
        </div>
        <div class="route-item">
          <strong>Deposit Due Date:</strong>
          <span>${isPostOct2026 && entity === 'individual_huf' ? 'Within 30 days from end of deduction month' : '7th of the following month'}</span>
        </div>
      </div>

      <div class="alert-box alert-danger mt-2">
        <div class="alert-icon">⚠️</div>
        <div class="alert-body">
          <strong>DO NOT DEDUCT 1% (OLD s.194-IA / s.393(1)):</strong> 
          Many property buyers mistakenly deduct 1% TDS under Section 194-IA. 
          The 1% rate applies strictly when the seller is a Resident Indian. 
          Because your seller is an NRI, deducting 1% will lead to income tax notices demanding short deduction interest and ₹200/day late penalty from you, the buyer!
        </div>
      </div>
    </div>
  `;
}

// Initial loader
document.addEventListener('DOMContentLoaded', () => {
  liveUpdateCalculations();
});
