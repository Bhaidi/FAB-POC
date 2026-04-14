"use client";

import { forwardRef, useMemo, type ComponentProps } from "react";
import { Input, type InputProps, useColorMode } from "@chakra-ui/react";
import { GlassCredentialFieldFrame } from "@/components/auth/GlassCredentialFieldFrame";
import { AUTH_INPUT_FIGMA_LAYOUT } from "@/components/auth/authInputStyles";
import { getDsGlassTextFieldInnerStyles, getDsTextFieldStyles } from "@/lib/fabTheme/dsTextField";

export type DsTextFieldProps = Omit<InputProps, "variant"> & {
  /** Field height — default `48px` (Figma DS). */
  fieldHeight?: string;
  /** Inner horizontal padding; default `24px`. Use `false` when a parent row supplies inset. */
  fieldPaddingX?: string | false;
  /**
   * When true, matches login credential fields: `434px` max width from `sm` (light + dark frame).
   * When false, the glass frame is full width of its container.
   */
  authLayout?: boolean;
  /** Login/register — dark: glass rim; light: Figma `558:17096` pill fields. */
  authLoginChrome?: boolean;
  /** Overrides default frame width in dark mode. */
  glassW?: ComponentProps<typeof GlassCredentialFieldFrame>["w"];
  glassMaxW?: ComponentProps<typeof GlassCredentialFieldFrame>["maxW"];
};

/**
 * Design System **Text field / Glass** — same treatment as login:
 * - **Dark:** layered {@link GlassCredentialFieldFrame} + transparent inner input
 * - **Light:** {@link getDsTextFieldStyles} (single surface)
 */
export const DsTextField = forwardRef<HTMLInputElement, DsTextFieldProps>(function DsTextField(
  {
    fieldHeight = "48px",
    fieldPaddingX,
    authLayout = false,
    authLoginChrome = false,
    glassW,
    glassMaxW,
    w: widthProp,
    maxW: maxWidthProp,
    ...inputProps
  },
  ref,
) {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const resolvedPaddingX = fieldPaddingX === undefined ? "24px" : fieldPaddingX;

  const inner = useMemo(
    () => getDsGlassTextFieldInnerStyles({ paddingX: resolvedPaddingX }),
    [resolvedPaddingX],
  );

  const lightStyles = useMemo(() => {
    const ds = getDsTextFieldStyles({
      colorMode: "light",
      height: fieldHeight,
      paddingX: resolvedPaddingX === false ? false : resolvedPaddingX,
      ...(authLoginChrome ? { surface: "authLoginLight" as const } : {}),
    });
    return authLayout ? { ...ds, ...AUTH_INPUT_FIGMA_LAYOUT } : ds;
  }, [authLayout, authLoginChrome, fieldHeight, resolvedPaddingX]);

  /** Width on `<Input>` sizes the glass frame in dark mode; inner input stays `width: full`. */
  const frameW = glassW ?? widthProp ?? (authLayout ? { base: "100%", sm: "434px" } : "100%");
  const frameMaxW = glassMaxW ?? maxWidthProp ?? "100%";

  if (isDark) {
    return (
      <GlassCredentialFieldFrame
        chrome={authLoginChrome ? "authLogin" : "ds"}
        isDisabled={inputProps.isDisabled}
        height={fieldHeight}
        w={frameW}
        maxW={frameMaxW}
      >
        <Input ref={ref} variant="unstyled" {...inner} {...inputProps} w="full" maxW="full" />
      </GlassCredentialFieldFrame>
    );
  }

  if (authLoginChrome) {
    return (
      <Input
        ref={ref}
        variant="unstyled"
        {...lightStyles}
        {...inputProps}
        w={widthProp}
        maxW={maxWidthProp}
      />
    );
  }

  return (
    <Input
      ref={ref}
      variant="unstyled"
      {...lightStyles}
      {...inputProps}
      w={widthProp}
      maxW={maxWidthProp}
    />
  );
});
