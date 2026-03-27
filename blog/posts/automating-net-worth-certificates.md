---
title: "Automating Net Worth Certificates: How I’m Solving a CA Office Bottleneck"
summary: I can't believe we’ve been manually drafting these for so long
time: 1762346400
---

If you’ve worked in a CA office, you know the Net Worth Certificate routine. It’s not hard, but it’s repetitive. The client sends their PAN card, Aadhaar card, and a list of assets—land, gold, bank balances, maybe some liabilities. We open Word, copy-paste from an old template, fill in the numbers, generate a UDIN, print it on the letterhead, sign it, stamp it, scan it, and save it somewhere on the system.

It works, but it’s fragile. One missed detail, one typo, one misplaced file—and you’re backtracking through folders or redoing the draft.

So I decided to fix it.

## The Idea: Let AI Do the Heavy Lifting

I wanted a system that could take care of the grunt work. Something that could:

- Read PAN and Aadhaar card screenshots and extract the relevant data  
- Auto-fill a Net Worth Certificate template (the one we use every day)  
- Create a folder for the client and save everything there  
- Let us input asset and liability details through a clean interface  
- Generate the final document on our letterhead  
- Accept the signed scan and archive it back in the same folder  

Basically, I wanted to turn a 30-minute task into a 3-minute one.
To make this happen, I built a **self-hosted web app** that runs locally on the system or server we use in the office.

## OCR for PAN and Aadhaar

The first bottleneck was data entry. Every time a client sends a PAN or Aadhaar screenshot, someone has to manually type in the name, PAN number, and address. So the self-hosted web app has a bullt-in OCR functionality—so when we upload a PAN or Aadhaar card screenshot, it instantly extracts the relevant data like name, PAN number, and address without any manual typing.

No more typos. No more back-and-forth.

## Auto-Folder Creation

Once the PAN is read, the web app creates a folder structure like this in the system or server it is hosted:
```
Desktop/
└── Clients/
    └── Networth Certificates/
        └── [Client Name extracted from PAN]/
```

This becomes the client’s vault—everything related to them goes here. Drafts, final documents, signed scans, even future certificates.

## Asset and Liability Entry Interface

The web app includes a clean, browser-based form for entering asset and liability details. We simply open the app in the browser pop-up window and fill out the form directly—no need for external tools or manual Word editing.

Here’s how the form works:

- **Categorized Sections**: The form is divided into logical sections—Immovable Assets, Movable Assets, Bank Balances, and Liabilities. Each section has its own input fields for descriptions and values.

- **Dynamic Entry Support**: You can add multiple entries under each category. For example, if a client owns two plots of land or has three bank accounts, you can add each one separately. The form dynamically expands to accommodate them.

- **Real-Time Calculations**: As you enter values, the form automatically calculates totals for each section. It also computes the overall Total Assets, Total Liabilities, and Net Worth in real time.

- **Validation and Formatting**: The form ensures that all numeric fields are properly formatted (e.g., ₹XX,XX,XXX.00) and checks for missing or invalid entries before allowing you to proceed.

This form replaces the need for spreadsheets, calculators, and manual Word templates. It’s fast, accurate, and consistent—especially helpful when handling multiple clients in a day.


## Template Integration

Once the form is complete, the app uses the data to generate a Net Worth Certificate in our standard format. It includes the client’s name, PAN, address, asset breakdown, liabilities, and net worth summary.

Here’s the full format it uses:

---

### NETWORTH STATEMENT

This is to certify that the Net Worth of **[Name extracted from PAN]**,  
bearing PAN Number **[PAN extracted from PAN card]**,  
residing at **[Address extracted from Aadhaar]**,  
as on **[Date selected in form]**, is as follows:

#### Immovable Properties in India

| S. No | Particulars | Amount (Rs.) |
|------|-------------|--------------|
| 1    | [Land/Building details with market value] | ₹XX,XX,XXX.00 |

#### Movable Properties in India

| S. No | Particulars | Amount (Rs.) |
|------|-------------|--------------|
| 2    | [Gold, vehicles, etc.] | ₹XX,XX,XXX.00 |

#### Cash and Bank Balances

| S. No | Particulars | Amount (Rs.) |
|------|-------------|--------------|
| 3    | [Bank balances, cash on hand] | ₹XX,XXX.00 |

#### Liabilities

| S. No | Particulars | Amount (Rs.) |
|------|-------------|--------------|
| 4    | [Loans, credit card dues, etc.] | ₹XX,XX,XXX.00 |

#### Summary

| Description | Amount |
|-------------|--------|
| Total Assets | ₹XX,XX,XXX.00 |
| Total Liabilities | ₹XX,XX,XXX.00 |
| Net Worth | ₹XX,XX,XXX.00 |

The above information is based on documentary evidence and declarations provided by the client.

For [CA Firm Name]  
Chartered Accountants  
Firm Reg No. [Auto-filled]  
UDIN: [Entered manually]  
Date: [Auto-filled]  
Place: [Auto-filled]

---

## UDIN Entry

Unfortunately, ICAI doesn’t provide any API for UDIN generation. So we still have to generate it manually from the ICAI portal. Once done, we enter it into the web app, and it embeds the UDIN into the final certificate.

## Export Options

The certificate is rendered as a PDF or Word file, ready to be printed on the firm’s letterhead. You can also save it directly to the client’s folder created earlier.

## Upload Signed Copy and Supporting Docs

After printing the certificate on the firm’s letterhead and signing/stamping it, we scan the document and upload it back into the app. It reads the content to confirm it matches the draft and saves it in the correct client folder.

There’s also an option to upload other supporting files—like title deeds, valuation proofs, or screenshots sent by the client. Everything stays bundled together.

## Why This Works

It’s not just about saving time. It’s about consistency, accuracy, and scalability. Whether you’re handling 5 clients or 500, the workflow stays the same. And because it’s self-hosted, client data stays secure.

This system doesn’t replace the CA’s judgment—it just removes the friction.

I'll make the web app code public in a few days, open-sourcing it for anyone to adapt and improve. Stay tuned!
