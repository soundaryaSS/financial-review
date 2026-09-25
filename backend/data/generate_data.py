"""
Dataset Generator for FINZ AI-Native Financial Review Challenge
Generates 300+ realistic, audited bank transactions across Jan, Feb, Mar 2026.
Includes intentional variances, anomalous items, and non-P&L transfers.
"""

import csv
import random
from datetime import datetime, date

transactions = []
tx_counter = 1

def add_tx(dt: str, desc: str, amount: float, tx_type: str, category: str, subcat: str,
           is_pnl: bool, confidence: float, reasoning: str, review_req: bool = False, review_reason: str = ""):
    global tx_counter
    tx_id = f"TX-{tx_counter:04d}"
    tx_counter += 1
    transactions.append({
        "id": tx_id,
        "date": dt,
        "description": desc,
        "amount": round(amount, 2),
        "type": tx_type,  # 'credit' for income, 'debit' for expense
        "account": "Chase Business Checking (*4182)",
        "category": category,
        "subcategory": subcat,
        "is_pnl": "True" if is_pnl else "False",
        "confidence": round(confidence, 2),
        "reasoning": reasoning,
        "review_required": "True" if review_req else "False",
        "review_reason": review_reason
    })

# Jan, Feb, Mar dates
months = [
    ("2026-01", 31, 1.0, 1.0),
    ("2026-02", 28, 1.08, 1.05), # Feb: slightly higher revenue, stable costs
    ("2026-03", 31, 1.25, 1.15)  # Mar: revenue growth, but material spike in food & travel (team offsite) and AWS
]

for m_prefix, days, rev_mult, opex_mult in months:
    # 1. REVENUE (Credits)
    # Recurring SaaS subscriptions
    for day in [5, 12, 19, 26]:
        amt = 14500 * rev_mult + random.uniform(-200, 300)
        add_tx(f"{m_prefix}-{day:02d}", "STRIPE PAYOUT - SAAS SUBSCRIPTION MRR", amt, "credit",
               "Revenue", "Subscription Revenue", True, 0.98, "Matched recurring Stripe processor payout rule")
    
    # Enterprise Contracts
    add_tx(f"{m_prefix}-15", "WIRE IN: MERIDIAN HEALTH ENTERPRISE ANNUAL", 28000 * rev_mult, "credit",
           "Revenue", "Enterprise Contracts", True, 0.96, "Verified enterprise wire transfer from CRM customer")
    add_tx(f"{m_prefix}-22", "ACH CREDIT: APEX GLOBAL QUARTERLY LICENSE", 12500 * rev_mult, "credit",
           "Revenue", "Enterprise Contracts", True, 0.95, "Recurring licensed partner remittance")

    # Consulting / Pro Services
    add_tx(f"{m_prefix}-18", "CLIENT WIRE: IMPLEMENTATION & ONBOARDING FEE", 6500, "credit",
           "Revenue", "Professional Services", True, 0.92, "One-off services billing recognized as services revenue")

    # 2. COST OF GOODS SOLD (Debits)
    # Cloud Infrastructure (AWS)
    aws_base = 6200 * opex_mult
    if m_prefix == "2026-03":
        aws_base += 4800  # Material variance: AWS compute expansion
        add_tx(f"{m_prefix}-03", "AMAZON WEB SERVICES AWS.AMAZON.COM WA", aws_base, "debit",
               "Cost of Goods Sold", "Hosting & Infrastructure", True, 0.95,
               "Production cloud infrastructure hosting COGS. Spiked in March due to model fine-tuning cluster.")
    else:
        add_tx(f"{m_prefix}-03", "AMAZON WEB SERVICES AWS.AMAZON.COM WA", aws_base, "debit",
               "Cost of Goods Sold", "Hosting & Infrastructure", True, 0.95,
               "Production cloud infrastructure hosting COGS")

    # Stripe Processing Fees
    add_tx(f"{m_prefix}-01", "STRIPE PROCESSING FEES MTHLY DEDUCTION", 1850 * rev_mult, "debit",
           "Cost of Goods Sold", "Payment Gateway Fees", True, 0.99, "Merchant credit card interchange and processing fee")

    # Third Party Data APIs
    add_tx(f"{m_prefix}-10", "OPENAI API PLATFORM USAGE BILLING", 1200 * opex_mult, "debit",
           "Cost of Goods Sold", "Direct Production APIs", True, 0.94, "Customer-facing LLM inference API costs")
    add_tx(f"{m_prefix}-14", "TWILIO TELEPHONY & SMS DIRECT COGS", 650, "debit",
           "Cost of Goods Sold", "Direct Production APIs", True, 0.97, "Two-factor auth and direct customer notification SMS")

    # 3. PAYROLL (Debits)
    # Bi-monthly payroll runs via Gusto
    # March saw 2 senior engineer hires
    base_payroll = 28500
    if m_prefix == "2026-03":
        base_payroll = 34500 # Headcount expansion
    
    add_tx(f"{m_prefix}-15", "GUSTO PAYROLL PE-15 SALARIES & WAGES", base_payroll, "debit",
           "Payroll", "Salaries & Wages", True, 0.99, "Automated payroll clearing for full-time staff")
    add_tx(f"{m_prefix}-28", "GUSTO PAYROLL PE-END SALARIES & WAGES", base_payroll, "debit",
           "Payroll", "Salaries & Wages", True, 0.99, "Automated payroll clearing for full-time staff")
    
    # Employee Benefits & Health Insurance
    add_tx(f"{m_prefix}-05", "BLUE CROSS BLUE SHIELD EMPL HEALTHCARE", 4200, "debit",
           "Payroll", "Employee Benefits", True, 0.98, "Group medical, dental, and vision insurance premium")

    # Contractors
    add_tx(f"{m_prefix}-20", "DEV CONTRACTOR INVOICE - FRONTEND SPECIALIST", 4500, "debit",
           "Payroll", "Contract Labor", True, 0.91, "External technical consultant invoice")

    # 4. OPERATING EXPENSES (OpEx) (Debits)
    # Software & SaaS subscriptions
    add_tx(f"{m_prefix}-02", "GOOGLE WORKSPACE APPS GSUITE CC", 780, "debit",
           "Operating Expenses", "Software & SaaS", True, 0.98, "Email and cloud productivity suite")
    add_tx(f"{m_prefix}-04", "GITHUB ENTERPRISE ORG SUBSCRIPTION", 420, "debit",
           "Operating Expenses", "Software & SaaS", True, 0.98, "Source control and CI/CD seats")
    add_tx(f"{m_prefix}-06", "FIGMA DESIGN TEAM MONTHLY SEATS", 360, "debit",
           "Operating Expenses", "Software & SaaS", True, 0.97, "Product design collaboration licenses")
    add_tx(f"{m_prefix}-07", "SLACK TECHNOLOGIES INC PRO PLAN", 540, "debit",
           "Operating Expenses", "Software & SaaS", True, 0.98, "Internal messaging and team communications")
    add_tx(f"{m_prefix}-11", "NOTION LABS INC WORKSPACE SUB", 280, "debit",
           "Operating Expenses", "Software & SaaS", True, 0.97, "Company documentation and wiki")

    # Office & Facilities
    add_tx(f"{m_prefix}-01", "WEWORK MANAGEMENT LLC OFFICE LEASE", 6200, "debit",
           "Operating Expenses", "Office & Facilities", True, 0.99, "Dedicated team office rent and shared amenities")
    add_tx(f"{m_prefix}-08", "COMCAST BUSINESS HIGH SPEED FIBER", 350, "debit",
           "Operating Expenses", "Office & Facilities", True, 0.95, "Office primary internet bandwidth connection")

    # Marketing & Growth
    add_tx(f"{m_prefix}-12", "GOOGLE ADS ADWORDS ONLINE MARKETING", 3500 * opex_mult, "debit",
           "Operating Expenses", "Marketing & Advertising", True, 0.96, "Performance search PPC acquisition campaigns")
    add_tx(f"{m_prefix}-24", "META ADS FACEBOOK BIZ ACQUISITION", 2200 * opex_mult, "debit",
           "Operating Expenses", "Marketing & Advertising", True, 0.95, "Social media paid performance advertising")

    # Professional Services (Legal / Audit)
    add_tx(f"{m_prefix}-16", "KPMG LLP QUARTERLY REVIEW & BOOKKEEPING", 2500, "debit",
           "Operating Expenses", "Professional Services", True, 0.95, "External accounting oversight and compliance")

    # Food & Entertainment (SPECIFIC SPIKE IN MARCH!)
    if m_prefix == "2026-03":
        # March annual offsite & celebrations drove huge spike
        add_tx(f"{m_prefix}-08", "DOORDASH CORPORATE MEALS & SNACKS", 850, "debit",
               "Operating Expenses", "Food & Entertainment", True, 0.92, "Weekly team lunch delivery")
        add_tx(f"{m_prefix}-16", "THE OBEROI BANGALORE - ANNUAL OFFSITE CATERING", 4850, "debit",
               "Operating Expenses", "Food & Entertainment", True, 0.88,
               "Company-wide annual offsite gala catering dinner. Primary driver of food cost spike.")
        add_tx(f"{m_prefix}-17", "BREWERY & CO TAPROOM TEAM CELEBRATION", 1680, "debit",
               "Operating Expenses", "Food & Entertainment", True, 0.89,
               "Post-offsite team social event.")
        add_tx(f"{m_prefix}-23", "UBER EATS HACKATHON NIGHT SNACKS", 620, "debit",
               "Operating Expenses", "Food & Entertainment", True, 0.91, "Evening sprint hackathon catering")
        # Travel spike
        add_tx(f"{m_prefix}-14", "INDIGO AIRLINES 8X FLIGHTS TO BLR OFFSITE", 3400, "debit",
               "Operating Expenses", "Travel & Lodging", True, 0.93, "Flight tickets for remote team members for March offsite")
    else:
        add_tx(f"{m_prefix}-12", "DOORDASH CORPORATE WEEKLY TEAM LUNCH", 720, "debit",
               "Operating Expenses", "Food & Entertainment", True, 0.92, "Standard weekly office lunch")
        add_tx(f"{m_prefix}-25", "STARBUCKS COFFEE PANTRY SUPPLIES", 195, "debit",
               "Operating Expenses", "Food & Entertainment", True, 0.96, "Office kitchen coffee supplies")

    # 5. NON-P&L / BALANCE SHEET TRANSACTIONS (CRITICAL FOR GAAP ACCURACY!)
    add_tx(f"{m_prefix}-28", "INTERNAL TRANSFER TO CHASE HIGH YIELD SAVINGS", 15000, "debit",
           "Non-P&L (Balance Sheet)", "Internal Transfer", False, 0.99,
           "Treasury reserve sweep to high-yield savings account. Excluded from P&L calculation.")
    
    if m_prefix == "2026-01":
        add_tx("2026-01-10", "SILICON VALLEY BANK TERM LOAN PRINCIPAL", 5000, "debit",
               "Non-P&L (Balance Sheet)", "Debt Principal Repayment", False, 0.98,
               "Principal reduction on equipment term debt. Balance sheet liability reduction.")
        add_tx("2026-01-05", "SAFE NOTE SEED EQUITY PROCEEDS - FOUNDERS FUND", 50000, "credit",
               "Non-P&L (Balance Sheet)", "Equity Financing", False, 0.99,
               "Capital injection via SAFE agreement. Balance sheet equity, strictly non-revenue.")
    
    if m_prefix == "2026-02":
        add_tx("2026-02-15", "STATE DEPT OF REVENUE SALES TAX REMITTANCE", 3420, "debit",
               "Non-P&L (Balance Sheet)", "Tax Withholding Remittance", False, 0.97,
               "Sales tax collected in trust passed through to taxing authority. Liability discharge.")

    if m_prefix == "2026-03":
        add_tx("2026-03-30", "OWNER DISTRIBUTION - FOUNDER DIVIDEND", 10000, "debit",
               "Non-P&L (Balance Sheet)", "Owner Drawings / Equity", False, 0.96,
               "Shareholder distribution. Deducted from retained earnings, not an operating expense.")

    # 6. UNCERTAIN & ANOMALOUS ITEMS REQUIRING HUMAN REVIEW
    if m_prefix == "2026-01":
        add_tx("2026-01-21", "AMZN MKTP US*82H1920 RETAIL PURCHASE", 342.15, "debit",
               "Operating Expenses", "Office & Facilities", True, 0.54,
               "Ambiguous Amazon receipt. Could be office supplies or capital hardware.",
               review_req=True, review_reason="Low categorization confidence (54%). Verify invoice itemization.")
        add_tx("2026-01-27", "CHECK #1092 - UNRECORDED VENDOR", 4250.00, "debit",
               "Operating Expenses", "Professional Services", True, 0.48,
               "Physical check debited without memo line.",
               review_req=True, review_reason="Check cleared with no memo. Requires human verification against AP ledger.")

    if m_prefix == "2026-02":
        add_tx("2026-02-11", "VENMO PAYMENT - D. MILLER CONSULTING?", 1500.00, "debit",
               "Operating Expenses", "Professional Services", True, 0.62,
               "Peer-to-peer payment platform transaction.",
               review_req=True, review_reason="Peer-to-peer Venmo transfer without attached invoice. Potential personal vs business expense.")
        add_tx("2026-02-19", "APPLE STORE R042 CULVER CITY CA", 2499.00, "debit",
               "Operating Expenses", "Software & SaaS", True, 0.58,
               "High-value hardware retail charge classified as OpEx.",
               review_req=True, review_reason="Charge > $2,000 threshold. Should this be capitalized as an Asset rather than expensed?")

    # Additional daily operational micro-transactions (rides, coffee, SaaS tools, cloud tools, supplies)
    for day in range(1, days + 1, 2):
        if day in [3, 7, 13, 21, 27]:
            add_tx(f"{m_prefix}-{day:02d}", "UBER FOR BUSINESS RIDESHARE LOCAL", round(random.uniform(22.50, 68.00), 2), "debit",
                   "Operating Expenses", "Travel & Lodging", True, 0.94, "Local engineering and sales transportation")
        if day in [2, 9, 16, 24]:
            add_tx(f"{m_prefix}-{day:02d}", "GITHUB COPILOT SEATS DEV TEAM", 190.00, "debit",
                   "Operating Expenses", "Software & SaaS", True, 0.98, "Developer AI pair-programming assistant subscriptions")
        if day in [4, 11, 18, 25]:
            add_tx(f"{m_prefix}-{day:02d}", "JETBRAINS ALL PRODUCTS PACK LICENSE", 289.00, "debit",
                   "Operating Expenses", "Software & SaaS", True, 0.97, "IDE tooling for core software team")
        if day in [6, 14, 20]:
            add_tx(f"{m_prefix}-{day:02d}", "ATLASSIAN JIRA CONFLUENCE CLOUD", 450.00, "debit",
                   "Operating Expenses", "Software & SaaS", True, 0.98, "Sprint tracking and sprint engineering board")
        if day in [8, 22]:
            add_tx(f"{m_prefix}-{day:02d}", "DATADOG INFRASTRUCTURE MONITORING", round(random.uniform(620, 850) * opex_mult, 2), "debit",
                   "Cost of Goods Sold", "Hosting & Infrastructure", True, 0.96, "Real-time production APM and metrics observability")
        if day in [10, 26]:
            add_tx(f"{m_prefix}-{day:02d}", "SENTRY.IO ERROR TELEMETRY PRO", 120.00, "debit",
                   "Cost of Goods Sold", "Hosting & Infrastructure", True, 0.97, "Frontend and backend crash reporting telemetry")
        if day in [5, 17]:
            add_tx(f"{m_prefix}-{day:02d}", "LINKEDIN TALENT SOLUTIONS HIRING ADS", 850.00 * opex_mult, "debit",
                   "Operating Expenses", "Marketing & Advertising", True, 0.94, "Technical recruiter and engineering job postings")
        if day in [15, 29] and day <= days:
            add_tx(f"{m_prefix}-{day:02d}", "INTERCOM CUSTOMER SUCCESS MESSAGING", 390.00, "debit",
                   "Operating Expenses", "Software & SaaS", True, 0.96, "In-app user onboarding and support chat widget")
        if day in [1, 15]:
            # Additional customer invoices
            add_tx(f"{m_prefix}-{day:02d}", f"INVOICE PAY: CLIENT CONTRACT #{m_prefix[-2:]}{day:02d}", round(random.uniform(4200, 7800) * rev_mult, 2), "credit",
                   "Revenue", "Subscription Revenue", True, 0.97, "Invoiced SMB client tier monthly recurring contract")

# Write CSV
output_path = r"C:\Users\soundarya\.gemini\antigravity\scratch\finz-financial-review\backend\data\finz_transactions.csv"
fieldnames = [
    "id", "date", "description", "amount", "type", "account",
    "category", "subcategory", "is_pnl", "confidence", "reasoning",
    "review_required", "review_reason"
]

with open(output_path, mode="w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(transactions)

print(f"Successfully generated {len(transactions)} transactions at {output_path}")
