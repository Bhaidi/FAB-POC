# Platform stub personas (login → `organizationId`)

After stub login, the app resolves **`Corporate ID` + `User ID`** to an organization via `resolveStubPlatformOrganizationId` in `data/platformStubTestPersonas.ts`. APIs use header **`x-organization-id`** (see `lib/server/platformStubRepository.ts`).

## Login table

| | Corporate ID | User ID | Org | Persona |
|---|-------------|---------|-----|---------|
| **Max** | `FABMAX1` | `MAXUSER1` | **org-9001** | **Jordan Maxwell** — Apex Continental Holdings Ltd — **ADMIN** |
| **Min** | `FABMIN1` | `MINUSER1` | **org-9002** | **Sam Rivera** — Rivera Trading FZ-LLC — **MAKER** |
| **Checker** | `FABCHK1` | `CHKUSER1` | **org-9003** | **Elena Vasquez** — Horizon Payments Cooperative Ltd — **CHECKER** |

### Max (`org-9001`)

- **Markets:** UAE, UK, Singapore, Hong Kong, France (all active / switchable in stub).
- **L1 access:** Full catalog in each market slice — no user denials.
- **Home financial rail:** 128 accounts, 10 currencies, 5 countries; **AED 156.4M** hero (stub file `data/dashboardHomeFinancialStub.ts`).
- **Dashboard widgets / Quick Actions:** Heavy workload counts (ADMIN + large approval totals).

### Min (`org-9002`)

- **Markets:** UAE only (`isGlobalClient: false`).
- **L1 / home tiles:** Four domains only — **Accounts**, **Payments**, **Liquidity**, **Collections** (user denials in `lib/server/demoUserCapabilityGrants.ts`).
- **Home financial rail:** 1 account, **1 currency (AED)**, 1 country; **AED 2.1M** hero.
- **Dashboard widgets / Quick Actions:** Sparse / zero-draft maker story.

### Checker (`org-9003`)

- **Markets:** UAE, UK, Singapore (`isGlobalClient: true`).
- **L1 access:** No denials — full country-row access in each market (same pattern as max, smaller market list).
- **Home financial rail:** 56 accounts, **5 currencies**, 3 countries; **AED 41.2M** hero.
- **Dashboard widgets:** Checker set (pending approvals, high value, aging, alerts). **Quick Actions:** payment / payroll / trade pending totals (see `lib/server/dashboardWidgetsStub.ts`).

## Files

- User context JSON: `data/platformStubs/user-context-org-9001.json` … `user-context-org-9003.json`
- Capability denials: `lib/server/demoUserCapabilityGrants.ts`
- Financial snapshot: `data/dashboardHomeFinancialStub.ts`
- Widgets stub: `lib/server/dashboardWidgetsStub.ts`

## Default org

If no header / env: **`org-9001`** (`DEFAULT_STUB_ORGANIZATION_ID`). Optional: `FAB_ACCESS_ORG_ID=org-9002` or `org-9003`.
