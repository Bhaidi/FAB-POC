/**
 * Auth API shapes — swap `authService` implementation for real HTTP; keep these contracts stable.
 */

export type InitiateLoginPayload = {
  corporateId: string;
  userId: string;
};

export type InitiateLoginSuccess = {
  status: "SUCCESS";
  challengeNumber: string;
  sessionId: string;
};

export type InitiateLoginFailure = {
  status: "INVALID_CREDENTIALS" | "NOT_REGISTERED" | "ERROR";
  message: string;
};

export type InitiateLoginResult = InitiateLoginSuccess | InitiateLoginFailure;

export type CheckLoginStatusResult =
  | { status: "PENDING" }
  | { status: "APPROVED" }
  | { status: "REJECTED"; message: string }
  | { status: "EXPIRED"; message: string }
  | { status: "ERROR"; message: string };
