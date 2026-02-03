import React from "react";
import styled from "styled-components";
import { creationCycleConfig } from "@/config/creationCycle";

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const WeekBlock = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const WeekLabel = styled.div`
  flex-shrink: 0;
  width: 80px;
  padding: 0.5rem 0.75rem;
  background: ${({ theme }) => theme.accentMuted};
  border-radius: 6px;
  font-family: "Source Serif 4", Georgia, serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.accent};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const WeekContent = styled.div`
  flex: 1;
`;

const WeekTitle = styled.h4`
  font-family: "Source Sans 3", sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0 0 0.25rem;
`;

const WeekDescription = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textMuted};
  margin: 0;
  line-height: 1.5;
`;

export const WeekTimeline: React.FC = () => {
  const { process } = creationCycleConfig;

  return (
    <Timeline>
      <WeekBlock>
        <WeekLabel>Week 1</WeekLabel>
        <WeekContent>
          <WeekTitle>{process.week1.title}</WeekTitle>
          <WeekDescription>{process.week1.description}</WeekDescription>
        </WeekContent>
      </WeekBlock>
      <WeekBlock>
        <WeekLabel>Weeks 2–3</WeekLabel>
        <WeekContent>
          <WeekTitle>{process.week2to3.title}</WeekTitle>
          <WeekDescription>{process.week2to3.description}</WeekDescription>
        </WeekContent>
      </WeekBlock>
      <WeekBlock>
        <WeekLabel>Week 4</WeekLabel>
        <WeekContent>
          <WeekTitle>{process.week4.title}</WeekTitle>
          <WeekDescription>{process.week4.description}</WeekDescription>
        </WeekContent>
      </WeekBlock>
    </Timeline>
  );
};

export default WeekTimeline;
