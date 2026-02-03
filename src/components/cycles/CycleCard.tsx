import React from "react";
import styled, { type DefaultTheme } from "styled-components";
import Link from "next/link";
import { creationCycleConfig } from "@/config/creationCycle";

interface Cycle {
  id: string;
  title: string;
  slug: string;
  startDate: Date;
  endDate: Date;
  status: string;
  leadCreatorName?: string | null;
}

interface CycleCardProps {
  cycle: Cycle;
  compact?: boolean;
}

const Card = styled.div<{ $compact?: boolean }>`
  background: ${({ theme }: { theme: DefaultTheme }) => theme.surface};
  border: 1px solid ${({ theme }: { theme: DefaultTheme }) => theme.border};
  border-radius: ${(props) => (props.$compact ? "8px" : "12px")};
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }: { theme: DefaultTheme }) => theme.accent};
  }
`;

const CardContent = styled.div<{ $compact?: boolean }>`
  padding: ${(props) => (props.$compact ? "1rem" : "1.25rem")};
`;

const CycleTitle = styled(Link)<{ $compact?: boolean }>`
  display: block;
  font-family: "Source Sans 3", sans-serif;
  font-size: ${(props) => (props.$compact ? "0.95rem" : "1.1rem")};
  font-weight: 600;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text};
  margin-bottom: 0.5rem;
  text-decoration: none;
  line-height: 1.3;

  &:hover {
    color: ${({ theme }: { theme: DefaultTheme }) => theme.accent};
  }
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  font-size: 0.85rem;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.textMuted};
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ theme, $status }: { theme: DefaultTheme; $status: string }) =>
    $status === "active" ? theme.accentMuted : $status === "completed" ? theme.surfaceHover : theme.border};
  color: ${({ theme, $status }: { theme: DefaultTheme; $status: string }) =>
    $status === "active" ? theme.accent : theme.textMuted};
`;

function formatDateRange(start: Date, end: Date): string {
  const startStr = start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const endStr = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${startStr} – ${endStr}`;
}

export const CycleCard: React.FC<CycleCardProps> = ({ cycle, compact }) => {
  const startDate = new Date(cycle.startDate);
  const endDate = new Date(cycle.endDate);

  return (
    <Card $compact={compact}>
      <CardContent $compact={compact}>
        <CycleTitle href={`/cycles/${cycle.id}`} $compact={compact}>
          {cycle.title}
        </CycleTitle>
        <Meta>
          <StatusBadge $status={cycle.status}>{cycle.status}</StatusBadge>
          <span>{formatDateRange(startDate, endDate)}</span>
          {cycle.leadCreatorName && (
            <span>Lead: {cycle.leadCreatorName}</span>
          )}
        </Meta>
      </CardContent>
    </Card>
  );
};

export default CycleCard;
