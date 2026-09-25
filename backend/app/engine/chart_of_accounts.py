"""
Chart of Accounts & Categorization Taxonomy - NYC Restaurant Co.
Maps accounting categories to GAAP P&L statement sections and Balance Sheet items.
"""

from typing import Dict, List, Any

ACCOUNT_TYPES = {
    "Revenue": {
        "is_pnl": True,
        "is_inflow": True,
        "subcategories": [
            "Dine-In & Takeout Food Sales",
            "Beverage & Bar Sales",
            "Corporate Catering Revenue",
            "Third-Party Delivery Sales",
            "Refunds & Customer Discounts"
        ]
    },
    "Cost of Goods Sold": {
        "is_pnl": True,
        "is_inflow": False,
        "subcategories": [
            "Food Inventory (COGS)",
            "Beverage Inventory (COGS)",
            "Packaging & To-Go Disposables",
            "Delivery Marketplace Commissions"
        ]
    },
    "Payroll": {
        "is_pnl": True,
        "is_inflow": False,
        "subcategories": [
            "Hourly Kitchen & FOH Wages",
            "Management Salaries",
            "Payroll Taxes & Benefits"
        ]
    },
    "Operating Expenses": {
        "is_pnl": True,
        "is_inflow": False,
        "subcategories": [
            "Rent & Facilities",
            "Software & POS Subscriptions",
            "Insurance Premium",
            "Professional & Bookkeeping",
            "Utilities - Telecom & Internet",
            "Utilities - Gas, Electric & Water",
            "Cleaning & Linen Services",
            "Marketing & Local Ads",
            "Repairs & Maintenance",
            "Office & Admin Supplies",
            "Licenses & Permits"
        ]
    },
    "Non-P&L (Balance Sheet)": {
        "is_pnl": False,
        "is_inflow": None,
        "subcategories": [
            "Fixed Asset Capital Expenditure",
            "Sales Tax Liability Remittance",
            "Debt Principal Repayment",
            "Owner Drawings & Equity",
            "Deferred Revenue (Gift Cards)"
        ]
    }
}

# Rule-based vendor mapping dictionary for deterministic pattern matching
VENDOR_RULES: List[Dict[str, Any]] = [
    # Revenue
    {"pattern": "FOOD SALES", "category": "Revenue", "subcategory": "Dine-In & Takeout Food Sales", "is_pnl": True, "confidence": 0.99},
    {"pattern": "BEVERAGE SALES", "category": "Revenue", "subcategory": "Beverage & Bar Sales", "is_pnl": True, "confidence": 0.99},
    {"pattern": "CATERING", "category": "Revenue", "subcategory": "Corporate Catering Revenue", "is_pnl": True, "confidence": 0.97},
    {"pattern": "DELIVERY MARKETPLACE PAYOUT", "category": "Revenue", "subcategory": "Third-Party Delivery Sales", "is_pnl": True, "confidence": 0.98},
    {"pattern": "REFUNDS AND DISCOUNTS", "category": "Revenue", "subcategory": "Refunds & Customer Discounts", "is_pnl": True, "confidence": 0.98},

    # COGS
    {"pattern": "LARGE CATERING EVENT FOOD", "category": "Cost of Goods Sold", "subcategory": "Food Inventory (COGS)", "is_pnl": True, "confidence": 0.95},
    {"pattern": "FOOD INVENTORY", "category": "Cost of Goods Sold", "subcategory": "Food Inventory (COGS)", "is_pnl": True, "confidence": 0.98},
    {"pattern": "SYSCO", "category": "Cost of Goods Sold", "subcategory": "Food Inventory (COGS)", "is_pnl": True, "confidence": 0.98},
    {"pattern": "US FOODS", "category": "Cost of Goods Sold", "subcategory": "Food Inventory (COGS)", "is_pnl": True, "confidence": 0.98},
    {"pattern": "LOCAL PRODUCE", "category": "Cost of Goods Sold", "subcategory": "Food Inventory (COGS)", "is_pnl": True, "confidence": 0.98},
    {"pattern": "BUTCHER & SONS", "category": "Cost of Goods Sold", "subcategory": "Food Inventory (COGS)", "is_pnl": True, "confidence": 0.98},
    {"pattern": "BAKERY SUPPLY", "category": "Cost of Goods Sold", "subcategory": "Food Inventory (COGS)", "is_pnl": True, "confidence": 0.98},
    {"pattern": "BEVERAGE INVENTORY", "category": "Cost of Goods Sold", "subcategory": "Beverage Inventory (COGS)", "is_pnl": True, "confidence": 0.98},
    {"pattern": "SOUTHERN GLAZER", "category": "Cost of Goods Sold", "subcategory": "Beverage Inventory (COGS)", "is_pnl": True, "confidence": 0.98},
    {"pattern": "CRAFT BEER", "category": "Cost of Goods Sold", "subcategory": "Beverage Inventory (COGS)", "is_pnl": True, "confidence": 0.98},
    {"pattern": "BEVERAGE DEPOT", "category": "Cost of Goods Sold", "subcategory": "Beverage Inventory (COGS)", "is_pnl": True, "confidence": 0.98},
    {"pattern": "TO-GO PACKAGING", "category": "Cost of Goods Sold", "subcategory": "Packaging & To-Go Disposables", "is_pnl": True, "confidence": 0.97},
    {"pattern": "RESTAURANT DEPOT", "category": "Cost of Goods Sold", "subcategory": "Packaging & To-Go Disposables", "is_pnl": True, "confidence": 0.97},
    {"pattern": "DELIVERY PLATFORM COMMISSION", "category": "Cost of Goods Sold", "subcategory": "Delivery Marketplace Commissions", "is_pnl": True, "confidence": 0.99},

    # Payroll
    {"pattern": "HOURLY KITCHEN AND FOH", "category": "Payroll", "subcategory": "Hourly Kitchen & FOH Wages", "is_pnl": True, "confidence": 0.99},
    {"pattern": "MANAGER SALARY", "category": "Payroll", "subcategory": "Management Salaries", "is_pnl": True, "confidence": 0.99},
    {"pattern": "PAYROLL TAXES", "category": "Payroll", "subcategory": "Payroll Taxes & Benefits", "is_pnl": True, "confidence": 0.99},

    # OpEx
    {"pattern": "RENT", "category": "Operating Expenses", "subcategory": "Rent & Facilities", "is_pnl": True, "confidence": 0.99},
    {"pattern": "POS/SOFTWARE", "category": "Operating Expenses", "subcategory": "Software & POS Subscriptions", "is_pnl": True, "confidence": 0.98},
    {"pattern": "TOAST", "category": "Operating Expenses", "subcategory": "Software & POS Subscriptions", "is_pnl": True, "confidence": 0.98},
    {"pattern": "INSURANCE PREMIUM", "category": "Operating Expenses", "subcategory": "Insurance Premium", "is_pnl": True, "confidence": 0.98},
    {"pattern": "ACCOUNTING/BOOKKEEPING", "category": "Operating Expenses", "subcategory": "Professional & Bookkeeping", "is_pnl": True, "confidence": 0.98},
    {"pattern": "INTERNET AND PHONE", "category": "Operating Expenses", "subcategory": "Utilities - Telecom & Internet", "is_pnl": True, "confidence": 0.98},
    {"pattern": "UTILITIES", "category": "Operating Expenses", "subcategory": "Utilities - Gas, Electric & Water", "is_pnl": True, "confidence": 0.98},
    {"pattern": "CLEANING AND LINEN", "category": "Operating Expenses", "subcategory": "Cleaning & Linen Services", "is_pnl": True, "confidence": 0.98},
    {"pattern": "MARKETING - LOCAL ADS", "category": "Operating Expenses", "subcategory": "Marketing & Local Ads", "is_pnl": True, "confidence": 0.96},
    {"pattern": "REPAIRS AND MAINTENANCE", "category": "Operating Expenses", "subcategory": "Repairs & Maintenance", "is_pnl": True, "confidence": 0.96},
    {"pattern": "OFFICE/ADMIN SUPPLIES", "category": "Operating Expenses", "subcategory": "Office & Admin Supplies", "is_pnl": True, "confidence": 0.95},
    {"pattern": "ANNUAL LICENSE RENEWAL", "category": "Operating Expenses", "subcategory": "Licenses & Permits", "is_pnl": True, "confidence": 0.97},

    # Non-P&L Balance Sheet Items
    {"pattern": "EQUIPMENT PURCHASE", "category": "Non-P&L (Balance Sheet)", "subcategory": "Fixed Asset Capital Expenditure", "is_pnl": False, "confidence": 0.95},
    {"pattern": "SALES TAX REMITTANCE", "category": "Non-P&L (Balance Sheet)", "subcategory": "Sales Tax Liability Remittance", "is_pnl": False, "confidence": 0.98},
    {"pattern": "LOAN PRINCIPAL", "category": "Non-P&L (Balance Sheet)", "subcategory": "Debt Principal Repayment", "is_pnl": False, "confidence": 0.99},
    {"pattern": "OWNER DISTRIBUTION", "category": "Non-P&L (Balance Sheet)", "subcategory": "Owner Drawings & Equity", "is_pnl": False, "confidence": 0.96},
    {"pattern": "GIFT CARD", "category": "Non-P&L (Balance Sheet)", "subcategory": "Deferred Revenue (Gift Cards)", "is_pnl": False, "confidence": 0.78},
]
