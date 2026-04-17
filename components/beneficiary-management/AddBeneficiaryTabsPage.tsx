"use client";

import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";
import { AddBeneficiaryPage } from "./AddBeneficiaryPage";
import { AddBeneficiaryProgressPage } from "./AddBeneficiaryProgressPage";
import { AddBeneficiaryWizardPage } from "./AddBeneficiaryWizardPage";

export function AddBeneficiaryTabsPage() {
  return (
    <Box w="full" minH="100vh">
      <Tabs variant="enclosed" colorScheme="blue" isFitted>
        <TabList>
          <Tab>Accordion</Tab>
          <Tab>Progress</Tab>
          <Tab>Wizard</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0} py={0}>
            <AddBeneficiaryPage />
          </TabPanel>
          <TabPanel px={0} py={0}>
            <AddBeneficiaryProgressPage />
          </TabPanel>
          <TabPanel px={0} py={0}>
            <AddBeneficiaryWizardPage />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
