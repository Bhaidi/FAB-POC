# Stub capability model (two layers)

Capabilities are defined in **two steps**. Both are implemented in TypeScript; this doc is the human-readable mirror.

---

## How it works

| Layer | Meaning | Code | Locked? |
|-------|---------|------|--------|
| **1. Country offering** | What the **product** makes available in each **market** (country). If a cell is blank in Matrix A, no user can get that L1 there. | `lib/server/countryCapabilityMatrix.ts` — `COUNTRY_OFFERED_L1` | Treat as **locked** unless product scope changes |
| **2. User grant** | For each **stub org** (`org-9001` …), which offered L1s the user is **not** entitled to in each market. | `lib/server/demoUserCapabilityGrants.ts` — `USER_CAPABILITY_DENIALS_BY_ORG` | Edit per user / role tests |

**Effective access:** for each L1,

`user_sees_enabled = country_offers(L1) AND NOT user_denied(L1)`

- Country does not offer → always hidden (not in API as enabled).
- Country offers, user not denied → enabled tile.
- Country offers, user denied (`false` in Matrix B) → hidden.

Stub API still returns **all 10 L1 rows** per market (`consolidateMarketServiceAccess`); the UI hides non-enabled / hidden rows as today.

---

## Matrix A — Country capability offering (Layer 1)

| Market (country) | accounts | payments | liquidity | trade-finance | collections | supply-chain-finance | virtual-accounts | host-to-host | reports-insights | administration | Notes |
|------------------|----------|----------|-----------|---------------|-------------|---------------------|------------------|--------------|------------------|----------------|-------|
| UAE | yes | yes | yes | yes | yes | yes | yes | yes | yes | yes | All L1 offered |
| UK | yes | yes | | | | | | yes | yes | yes | |
| SG | yes | yes | | | | | | yes | yes | yes | Same pattern as UK |
| HK | yes | yes | | | | | | | | | |
| FR | yes | yes | yes | yes | | | yes | yes | yes | yes | |
| US | yes | yes | | | | | | | | | |
| CN | yes | yes | | | | | | | | | |
| KW | yes | yes | | | | | | | | | |
| KSA | yes | yes | | | | yes | yes | yes | | | |

_Implemented in `lib/server/countryCapabilityMatrix.ts`._

---

## Matrix B — User grants (Layer 2, within Matrix A only)

Use **`no`** only where the user must **lose** an L1 that their **country row** would otherwise offer. Leave cells **empty** = user gets everything the country offers for that market.

L1 columns: `accounts` · `payments` · `liquidity` · `trade-finance` · `collections` · `supply-chain-finance` · `virtual-accounts` · `host-to-host` · `reports-insights` · `administration`

### org-9001 — Jordan Maxwell (`FABMAX1` + `MAXUSER1`)

Markets: UAE, UK, SG, HK, FR

| Market | accounts | payments | liquidity | trade-finance | collections | supply-chain-finance | virtual-accounts | host-to-host | reports-insights | administration |
|--------|----------|----------|-----------|---------------|-------------|---------------------|------------------|--------------|------------------|----------------|
| UAE | | | | | | | | | | |
| UK | | | | | | | | | | |
| SG | | | | | | | | | | |
| HK | | | | | | | | | | |
| FR | | | | | | | | | | |

_(Empty = no denials — full “max” access within each country row.)_

### org-9002 — Sam Rivera (`FABMIN1` + `MINUSER1`)

Markets: UAE only

| Market | accounts | payments | liquidity | trade-finance | collections | supply-chain-finance | virtual-accounts | host-to-host | reports-insights | administration |
|--------|----------|----------|-----------|---------------|-------------|---------------------|------------------|--------------|------------------|----------------|
| UAE | | | | | | no | no | no | no | no |

_(Exactly four L1 tiles on home: accounts, payments, liquidity, collections.)_

### org-9003 — Elena Vasquez (`FABCHK1` + `CHKUSER1`)

Markets: UAE, UK, SG

| Market | accounts | payments | liquidity | trade-finance | collections | supply-chain-finance | virtual-accounts | host-to-host | reports-insights | administration |
|--------|----------|----------|-----------|---------------|-------------|---------------------|------------------|--------------|------------------|----------------|
| UAE | | | | | | | | | | |
| UK | | | | | | | | | | |
| SG | | | | | | | | | | |

_(Empty = no denials — CHECKER / approver persona; workflow is driven by `userRole` in user-context JSON.)_

_Implemented in `lib/server/demoUserCapabilityGrants.ts`._

---

## Other stub files

| Concern | File |
|---------|------|
| Which markets appear in the picker per user | `lib/server/platformStubRepository.ts` (slices `org-3001-markets.json`) |
| Login ↔ org | `data/platformStubTestPersonas.ts`, `docs/PLATFORM_TEST_PERSONAS.md` |
| Operational JSON (summary/services/activities) | `data/platformStubs/org-3001-market-data.json` |

---

## Optional: markets list & operational JSON

| Market | In market picker? | Selectable + active? | Has `org-3001-market-data.json` pack? | Notes |
|--------|-------------------|----------------------|---------------------------------------|-------|
| | yes / no | yes / no | yes / no | |
