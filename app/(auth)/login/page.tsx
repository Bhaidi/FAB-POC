"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Box } from "@chakra-ui/react";
import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { LoginModeView } from "@/components/auth/LoginModeView";
import { RegisterModeView } from "@/components/auth/RegisterModeView";
import { authContentModeVariants } from "@/lib/motion/authContentTransition";

type AuthMode = "login" | "register";

/** Framer layer — must fill AuthPageShell flex host so Login/Register mode views get height for layout */
const AUTH_MODE_MOTION_STYLE = {
  width: "100%",
  flex: 1,
  display: "flex",
  flexDirection: "column" as const,
  minHeight: 0,
};

/**
 * Login — FAB portal. Login / Register toggle switches page mode (same route).
 */
export default function LoginPage() {
  const [activeMode, setActiveMode] = useState<AuthMode>("login");
  const reduceMotion = useReducedMotion();

  const variants = useMemo(() => authContentModeVariants(reduceMotion), [reduceMotion]);

  return (
    <Box
      position="relative"
      flex="1"
      minH={0}
      w="100%"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <AuthPageShell activeMode={activeMode} onModeChange={setActiveMode}>
        <AnimatePresence mode="wait" initial={false}>
          {activeMode === "login" ? (
            <motion.div
              key="login"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={AUTH_MODE_MOTION_STYLE}
            >
              <LoginModeView />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={AUTH_MODE_MOTION_STYLE}
            >
              <RegisterModeView onLoginNow={() => setActiveMode("login")} />
            </motion.div>
          )}
        </AnimatePresence>
      </AuthPageShell>
    </Box>
  );
}
