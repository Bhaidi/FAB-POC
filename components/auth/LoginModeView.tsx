"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Text, VStack } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useOptionalAuthChrome } from "@/components/auth/AuthChromeContext";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { AuthFailureView } from "@/components/auth/login-flow/AuthFailureView";
import { LoginFormView } from "@/components/auth/login-flow/LoginFormView";
import { LoginPushVerifyView } from "@/components/auth/login-flow/LoginPushVerifyView";
import { authColors, authHeroTypography, authLoginHeroVertical, authSpacing } from "@/components/auth/authTokens";
import { AuthParallaxLayer } from "@/components/auth/AuthStageMotion";
import { useLoginAuthFlow } from "@/hooks/useLoginAuthFlow";

const MotionBox = motion(Box);

const EASE_OUT = [0.33, 1, 0.68, 1] as const;

const TRANS_IN = { duration: 0.28, ease: EASE_OUT } as const;

function LoginHeroColumn() {
  return (
    <VStack align={{ base: "center", lg: "flex-start" }} spacing={0} w="full" pb={authLoginHeroVertical.descriptionTail}>
      <Text
        fontFamily="var(--font-graphik)"
        {...authHeroTypography.overline}
        color={authColors.text.muted}
        textAlign={{ base: "center", lg: "left" }}
      >
        Corporate banking
      </Text>
      <Text
        fontFamily="var(--font-graphik)"
        {...authHeroTypography.headline}
        color={authColors.text.primary}
        whiteSpace="pre-wrap"
        textAlign={{ base: "center", lg: "left" }}
        mt={authLoginHeroVertical.eyebrowToHeading}
      >
        {`End-to-End `}
        {"\n"}
        Corporate
        {"\n"}
        Solution Suite
      </Text>
      <Text
        fontFamily="var(--font-graphik)"
        {...authHeroTypography.subtitle}
        color={authColors.text.tertiary}
        textAlign={{ base: "center", lg: "left" }}
        maxW={authSpacing.heroBodyMaxW}
        mt={authLoginHeroVertical.headingToDescription}
      >
        Our new state of the art banking portal to enhance your banking experience.
      </Text>
    </VStack>
  );
}

/**
 * Login mode — marketing split + stubbed credential / push-verify / success & failure flow.
 */
export function LoginModeView() {
  const router = useRouter();
  const flow = useLoginAuthFlow();
  const authChrome = useOptionalAuthChrome();
  const setSegmentedToggleVisible = authChrome?.setSegmentedToggleVisible;
  const setChromeInteractionLocked = authChrome?.setChromeInteractionLocked;

  const splitLogin = flow.phase === "loginForm" || flow.phase === "initiatingLogin";

  useEffect(() => {
    if (!setSegmentedToggleVisible) return;
    setSegmentedToggleVisible(splitLogin);
  }, [splitLogin, setSegmentedToggleVisible]);

  useEffect(() => {
    if (!setChromeInteractionLocked) return;
    const locked = flow.phase === "initiatingLogin";
    setChromeInteractionLocked(locked);
    return () => setChromeInteractionLocked(false);
  }, [flow.phase, setChromeInteractionLocked]);

  const goToDashboard = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent={{ base: "flex-start", lg: "center" }}
      w="full"
      flex="1"
      minH={0}
      overflow="hidden"
      py={{ base: 2, md: 3 }}
    >
      <AnimatePresence mode="wait">
        {splitLogin ? (
          <MotionBox
            key="split-login"
            w="full"
            flex="1"
            display="flex"
            flexDirection="column"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26, ease: EASE_OUT }}
          >
            <AuthSplitLayout
              left={
                <AuthParallaxLayer role="hero" idleFloat>
                  <LoginHeroColumn />
                </AuthParallaxLayer>
              }
              right={
                <AuthParallaxLayer role="right" idleFloat>
                  <LoginFormView
                    corporateId={flow.corporateId}
                    userId={flow.userId}
                    onCorporateIdChange={flow.setCorporateId}
                    onUserIdChange={flow.setUserId}
                    fieldErrors={flow.fieldErrors}
                    formLevelError={flow.formLevelError}
                    isSubmitting={flow.phase === "initiatingLogin"}
                    onSubmit={flow.submitLogin}
                  />
                </AuthParallaxLayer>
              }
            />
          </MotionBox>
        ) : (
          <MotionBox
            key="login-post-split"
            w="full"
            px={{ base: 1, md: 0 }}
            mt={{ base: 0, lg: -6 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={TRANS_IN}
          >
            {/*
              One `AnimatePresence` + stable keys: `verify-ui` covers both pending and completing
              so React does not remount between them (avoids flicker / random phase flashes).
              `mode="wait"` ensures verify fully exits before success/error mounts.
            */}
            <AnimatePresence mode="wait" initial={false}>
              {flow.phase === "verifyPending" ||
              flow.phase === "verifyCompleting" ||
              flow.phase === "verifyApproved" ? (
                <motion.div
                  key="verify-ui"
                  style={{ width: "100%" }}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={TRANS_IN}
                >
                  <AuthParallaxLayer role="verify" idleFloat>
                    <LoginPushVerifyView
                      timelinePhase={flow.phase}
                      challengeNumber={flow.challengeNumber}
                      countdownResetKey={flow.verificationResetKey}
                      onCountdownExpire={flow.expireVerificationCode}
                      onResendRequest={flow.resendVerificationRequest}
                      onCancel={flow.cancelVerification}
                      onSuccessSequenceComplete={flow.completeVerificationSuccess}
                      onContinueToDashboard={goToDashboard}
                    />
                  </AuthParallaxLayer>
                </motion.div>
              ) : flow.phase === "verifyRejected" ? (
                <motion.div
                  key="rejected-ui"
                  style={{ width: "100%" }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={TRANS_IN}
                >
                  <AuthParallaxLayer role="verify" idleFloat>
                    <AuthFailureView
                      variant="rejected"
                      messageOverride={flow.verifyMessage}
                      onPrimary={() => flow.resetToLogin()}
                      onSecondary={() => flow.resetToLogin()}
                    />
                  </AuthParallaxLayer>
                </motion.div>
              ) : flow.phase === "verifyExpired" ? (
                <motion.div
                  key="expired-ui"
                  style={{ width: "100%" }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={TRANS_IN}
                >
                  <AuthParallaxLayer role="verify" idleFloat>
                    <AuthFailureView
                      variant="expired"
                      messageOverride={flow.verifyMessage}
                      onPrimary={() => flow.resetToLogin({ clearFields: true })}
                    />
                  </AuthParallaxLayer>
                </motion.div>
              ) : flow.phase === "verifyError" ? (
                <motion.div
                  key="error-ui"
                  style={{ width: "100%" }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={TRANS_IN}
                >
                  <AuthParallaxLayer role="verify" idleFloat>
                    <AuthFailureView
                      variant="error"
                      messageOverride={flow.verifyMessage}
                      onPrimary={() => flow.resetToLogin()}
                      onSecondary={() => flow.resetToLogin()}
                    />
                  </AuthParallaxLayer>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  );
}
