import { authColors, authRadius, authShadow } from "@/components/auth/authTokens";

/** Shared dark-glass input styling for auth forms (login / future flows). */
export const authInputFieldStyles = {
  h: "48px",
  px: 4,
  borderRadius: authRadius.input,
  bg: authColors.glass.input,
  border: "1px solid",
  borderColor: authColors.border.default,
  color: authColors.text.primary,
  fontSize: "15px",
  lineHeight: "20px",
  _placeholder: { color: authColors.text.muted },
  _hover: {
    bg: authColors.glass.inputHover,
    borderColor: authColors.border.strong,
  } as const,
  _focusVisible: {
    bg: authColors.glass.inputFocus,
    borderColor: authColors.accent,
    boxShadow: authShadow.inputFocus,
  } as const,
  transition:
    "background 0.2s cubic-bezier(0, 0, 0.2, 1), border-color 0.2s cubic-bezier(0, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0, 0, 0.2, 1)",
} as const satisfies Record<string, unknown>;
