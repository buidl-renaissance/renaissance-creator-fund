import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import styled, { keyframes } from "styled-components";
import { CycleCard } from "@/components/cycles";
import { creationCycleConfig } from "@/config/creationCycle";
import { TabBar, TabBarSpacer } from "@/components/navigation";

interface Cycle {
  id: string;
  title: string;
  slug: string;
  startDate: string;
  endDate: string;
  status: string;
  leadArtistName?: string | null;
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.background};
`;

const ContentArea = styled.div`
  flex: 1;
  max-width: 720px;
  margin: 0 auto 0 0;
  width: 100%;
  padding: 2.5rem 1.5rem 6rem;
  animation: ${fadeIn} 0.4s ease-out;
`;

const PageTitle = styled.h1`
  font-family: "Source Sans 3", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0 0 1rem;
`;

const PageDescription = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.textMuted};
  margin: 0 0 1.5rem;
  line-height: 1.6;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  background: ${(props) =>
    props.$active ? props.theme.accent : props.theme.surface};
  border: 1px solid
    ${(props) => (props.$active ? props.theme.accent : props.theme.border)};
  border-radius: 20px;
  color: ${(props) =>
    props.$active ? "white" : props.theme.text};
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.accent};
  }
`;

const CyclesGrid = styled.div`
  display: grid;
  gap: 1.25rem;

  @media (min-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.textMuted};

  h3 {
    margin: 0 0 0.5rem;
    color: ${({ theme }) => theme.text};
  }

  p {
    margin: 0;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.textMuted};
`;

const CyclesPage: React.FC = () => {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"upcoming" | "past">("upcoming");

  const fetchCycles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter === "past") params.set("past", "true");
      const response = await fetch(`/api/cycles?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setCycles(data.cycles || []);
      }
    } catch (error) {
      console.error("Error fetching cycles:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchCycles();
  }, [fetchCycles]);

  return (
    <Container>
      <Head>
        <title>Cycles | {creationCycleConfig.name}</title>
        <meta
          name="description"
          content={`Creation Cycles - ${creationCycleConfig.tagline}`}
        />
        <link rel="icon" href={creationCycleConfig.branding.favicon} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <ContentArea>
        <PageTitle>Creation Cycles</PageTitle>
        <PageDescription>
          {creationCycleConfig.structure.durationWeeks}-week creator-led
          programs. Each cycle brings a lead creator and collaborators together
          to create original work, culminating in a live celebration event.
        </PageDescription>

        <FilterBar>
          <FilterButton
            $active={filter === "upcoming"}
            onClick={() => setFilter("upcoming")}
          >
            Upcoming
          </FilterButton>
          <FilterButton
            $active={filter === "past"}
            onClick={() => setFilter("past")}
          >
            Past Cycles
          </FilterButton>
        </FilterBar>

        {loading ? (
          <LoadingContainer>Loading cycles...</LoadingContainer>
        ) : cycles.length > 0 ? (
          <CyclesGrid>
            {cycles.map((cycle) => (
              <CycleCard
                key={cycle.id}
                cycle={{
                  ...cycle,
                  startDate: new Date(cycle.startDate),
                  endDate: new Date(cycle.endDate),
                }}
              />
            ))}
          </CyclesGrid>
        ) : (
          <EmptyState>
            <h3>No {filter} cycles</h3>
            <p>
              {filter === "upcoming"
                ? "Check back soon for upcoming Creation Cycles."
                : "No past cycles to show."}
            </p>
          </EmptyState>
        )}
      </ContentArea>

      <TabBarSpacer />
      <TabBar />
    </Container>
  );
};

export default CyclesPage;
