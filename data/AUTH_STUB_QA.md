# Stub login — QA cheat sheet

**Corporate ID** and **User ID**: **letters and numbers only**, no spaces or symbols. Whatever you type is shown in **CAPITALS** (invalid characters are removed as you type).

Use **User ID** (and matching **Corporate ID** for personas) to drive outcomes. Full rows: `data/authStubTestAccounts.ts` → `AUTH_STUB_TEST_ACCOUNTS`.

| User ID | Corporate ID | Outcome |
|---------|--------------|---------|
| `SUCCESS` | e.g. `FABCORP01` | Push verify → approved → **dashboard** |
| *(any other alphanumeric)* | e.g. `FABCORP01` | Happy path (e.g. `JDOE`) → default stub org |
| `INVALID` | | Error on login form |
| `REJECT` | | Rejected on device |

**Platform stub personas** (drives `x-organization-id` after login):

| Persona | Corporate ID | User ID | Org |
|---------|--------------|---------|-----|
| **Max** | `FABMAX1` | `MAXUSER1` | org-9001 |
| **Min** | `FABMIN1` | `MINUSER1` | org-9002 |
| **Checker** | `FABCHK1` | `CHKUSER1` | org-9003 |

See `docs/PLATFORM_TEST_PERSONAS.md` and `docs/STUB_DATA_MATRIX_TEMPLATE.md` for capability and balance details.
