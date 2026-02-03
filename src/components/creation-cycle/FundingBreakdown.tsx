import React from "react";
import styled from "styled-components";
import { creationCycleConfig } from "@/config/creationCycle";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionTitle = styled.h4`
  font-family: "Source Sans 3", sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
`;

const Value = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const TotalRow = styled(Row)`
  border-top: 2px solid ${({ theme }) => theme.border};
  padding-top: 0.75rem;
  margin-top: 0.25rem;
`;

export const FundingBreakdown: React.FC = () => {
  const { funding } = creationCycleConfig;

  return (
    <Container>
      <Section>
        <SectionTitle>Funding Sources (per cycle)</SectionTitle>
        <Row>
          <Label>Community ticket sales</Label>
          <Value>${funding.communityTickets}</Value>
        </Row>
        <Row>
          <Label>Creation partner matching</Label>
          <Value>${funding.sponsorMatch}</Value>
        </Row>
        <Row>
          <Label>Artisan / matching fund</Label>
          <Value>${funding.artisanFund}</Value>
        </Row>
        <TotalRow>
          <Label>Total raised</Label>
          <Value>${funding.totalPerCycle}</Value>
        </TotalRow>
      </Section>

      <Section>
        <SectionTitle>Use of funds</SectionTitle>
        <Row>
          <Label>Creator compensation</Label>
          <Value>~${funding.creatorCompensation}</Value>
        </Row>
        <Row>
          <Label>Production, materials, documentation</Label>
          <Value>~${funding.productionCosts}</Value>
        </Row>
      </Section>
    </Container>
  );
};

export default FundingBreakdown;
