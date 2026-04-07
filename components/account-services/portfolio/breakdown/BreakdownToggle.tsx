"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Fragment, useEffect, useRef, useState } from "react";

type Opt = { id: string; label: string };

const EASE = [0.22, 1, 0.36, 1] as const;

const lineTrack = "rgba(90, 160, 220, 0.11)";

function NetworkOrb({
  active,
  reduceMotion,
  onClick,
  label,
}: {
  active: boolean;
  reduceMotion: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <Flex
      as="button"
      type="button"
      role="tab"
      aria-selected={active}
      aria-label={`${label} breakdown`}
      direction="column"
      align="center"
      gap="7px"
      flex="0 0 auto"
      minW={{ base: "48px", sm: "56px" }}
      maxW="80px"
      cursor="pointer"
      bg="transparent"
      border="none"
      p={0}
      outline="none"
      transition="transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)"
      _focusVisible={{
        boxShadow: "0 0 0 2px rgba(120, 210, 255, 0.45)",
        borderRadius: "md",
      }}
      onClick={onClick}
    >
      <Box position="relative" w="22px" h="22px" display="flex" alignItems="center" justifyContent="center">
        {active ? (
          <Box
            position="absolute"
            inset="-8px"
            borderRadius="full"
            bg="radial-gradient(circle, rgba(100, 220, 255, 0.32) 0%, transparent 72%)"
            pointerEvents="none"
            sx={
              reduceMotion
                ? undefined
                : {
                    animation: "bd-node-halo 2.8s ease-in-out infinite",
                    "@keyframes bd-node-halo": {
                      "0%, 100%": { opacity: 0.55, transform: "scale(1)" },
                      "50%": { opacity: 0.95, transform: "scale(1.12)" },
                    },
                  }
            }
          />
        ) : null}
        <motion.div
          animate={{ width: active ? 11 : 7, height: active ? 11 : 7 }}
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          style={{
            borderRadius: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
          }}
        >
          <motion.div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 9999,
              background: active
                ? "radial-gradient(circle at 32% 28%, rgba(220, 250, 255, 0.98), rgba(90, 200, 255, 0.78))"
                : "radial-gradient(circle at 32% 28%, rgba(130, 185, 230, 0.42), rgba(55, 95, 145, 0.32))",
              boxShadow: active
                ? "0 0 16px rgba(110, 230, 255, 0.7), 0 0 36px rgba(70, 170, 255, 0.28), inset 0 0 8px rgba(255,255,255,0.4)"
                : "0 0 8px rgba(70, 130, 190, 0.22), inset 0 0 4px rgba(255,255,255,0.06)",
              opacity: active ? 1 : 0.5,
            }}
            animate={
              reduceMotion || !active
                ? { scale: 1 }
                : {
                    scale: [1, 1.07, 1],
                  }
            }
            transition={
              reduceMotion || !active
                ? { duration: 0.2 }
                : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </motion.div>
      </Box>
      <Text
        fontFamily="var(--font-graphik)"
        fontSize={{ base: "10px", sm: "11px" }}
        fontWeight={active ? 600 : 500}
        letterSpacing="0.08em"
        textTransform="uppercase"
        textAlign="center"
        lineHeight={1.25}
        color={active ? "rgba(200, 245, 255, 0.94)" : "rgba(255,255,255,0.36)"}
        textShadow={active ? "0 0 20px rgba(90, 190, 255, 0.4)" : "none"}
        transition="color 0.4s cubic-bezier(0.22, 1, 0.36, 1), text-shadow 0.4s ease"
        w="full"
        noOfLines={2}
        title={label}
      >
        {label}
      </Text>
    </Flex>
  );
}

export function BreakdownToggle({ options, activeId, onChange }: { options: Opt[]; activeId: string; onChange: (id: string) => void }) {
  const reduceMotion = useReducedMotion() === true;
  const [energyKey, setEnergyKey] = useState(0);
  const prevIdRef = useRef(activeId);

  useEffect(() => {
    if (prevIdRef.current !== activeId) {
      prevIdRef.current = activeId;
      setEnergyKey((k) => k + 1);
    }
  }, [activeId]);

  if (options.length === 0) return null;

  return (
    <Box w="full" maxW="full" position="relative" py={{ base: 2, md: 3 }} px={{ base: 0, md: 0 }}>
      {/* Network spine — aligns with orb centers */}
      <Box
        position="absolute"
        left={{ base: "8%", sm: "7%" }}
        right={{ base: "8%", sm: "7%" }}
        top="22px"
        h="1px"
        bg={`linear-gradient(90deg, transparent 0%, ${lineTrack} 6%, ${lineTrack} 94%, transparent 100%)`}
        borderRadius="full"
        pointerEvents="none"
        zIndex={0}
        overflow="hidden"
      >
        <AnimatePresence>
          {!reduceMotion && energyKey > 0 ? (
            <motion.div
              key={energyKey}
              initial={{ x: "-35%", opacity: 0 }}
              animate={{ x: "235%", opacity: [0, 1, 0.95, 0] }}
              transition={{
                duration: 0.7,
                ease: EASE,
                times: [0, 0.12, 0.78, 1],
              }}
              style={{
                position: "absolute",
                top: "-3px",
                left: 0,
                width: "38%",
                height: "7px",
                borderRadius: 9999,
                background:
                  "linear-gradient(90deg, transparent, rgba(160, 245, 255, 0.95), rgba(90, 210, 255, 0.9), rgba(160, 245, 255, 0.95), transparent)",
                boxShadow: "0 0 18px rgba(120, 230, 255, 0.6), 0 0 40px rgba(70, 170, 255, 0.22)",
                pointerEvents: "none",
                willChange: "transform, opacity",
              }}
            />
          ) : null}
        </AnimatePresence>
      </Box>

      <Flex
        role="tablist"
        aria-label="Breakdown dimension network"
        position="relative"
        zIndex={1}
        w="full"
        align="flex-start"
        justify="space-between"
        gap={0}
      >
        {options.map((opt, i) => (
          <Fragment key={opt.id}>
            <Box pt="11px">
              <NetworkOrb
                label={opt.label}
                active={activeId === opt.id}
                reduceMotion={reduceMotion}
                onClick={() => onChange(opt.id)}
              />
            </Box>
            {i < options.length - 1 ? (
              <Flex flex="1 1 0" minW={{ base: "2px", sm: "6px" }} maxW="none" pt="21px" aria-hidden>
                <Box flex={1} />
              </Flex>
            ) : null}
          </Fragment>
        ))}
      </Flex>
    </Box>
  );
}
