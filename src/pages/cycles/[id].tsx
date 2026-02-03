import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styled, { keyframes } from "styled-components";
import { creationCycleConfig } from "@/config/creationCycle";
import { WeekTimeline } from "@/components/cycles";

interface Creator {
  id: string;
  userId: string;
  role: string;
  order: number;
  displayName: string | null;
  username: string | null;
  pfpUrl: string | null;
}

interface Cycle {
  id: string;
  title: string;
  slug: string;
  startDate: string;
  endDate: string;
  status: string;
  creativeDirection: string | null;
  documentationUrl: string | null;
  creators: Creator[];
  celebrationEvent?: {
    id: string;
    title: string;
    eventDate: string;
    ticketPrice: number;
    capacity: number;
    ticketsSold: number;
  } | null;
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

const Header = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: ${({ theme }) => theme.surface};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: transparent;
  color: ${({ theme }) => theme.text};
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
  }
`;

const HeaderSpacer = styled.div`
  height: 60px;
`;

const ContentArea = styled.div`
  flex: 1;
  max-width: 720px;
  margin: 0 auto 0 0;
  width: 100%;
  padding: 0 1.5rem 6rem;
  animation: ${fadeIn} 0.4s ease-out;
`;

const CycleTitle = styled.h1`
  font-family: "Source Sans 3", sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0 0 0.5rem;
`;

const CycleMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 2rem;
`;

const StatusBadge = styled.span<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: ${({ theme, $status }) =>
    $status === "active"
      ? theme.accentMuted
      : $status === "completed"
        ? theme.surfaceHover
        : theme.border};
  color: ${({ theme, $status }) =>
    $status === "active" ? theme.accent : theme.textMuted};
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-family: "Source Sans 3", sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CreativeDirection = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.6;
  margin: 0;
`;

const CreatorsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CreatorItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
`;

const CreatorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
`;

const CreatorImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const CreatorInfo = styled.div`
  flex: 1;
`;

const CreatorName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const CreatorRole = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
  margin-left: 0.5rem;
`;

const DocLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.accentMuted};
  color: ${({ theme }) => theme.accent};
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;

  &:hover {
    background: ${({ theme }) => theme.accent};
    color: white;
  }
`;

const CtaCard = styled(Link)`
  display: block;
  padding: 1.5rem;
  background: ${({ theme }) => theme.accentMuted};
  border: 1px solid ${({ theme }) => theme.accent};
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.accent};
    color: white;

    h3,
    p {
      color: white;
    }
  }
`;

const CtaTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin: 0 0 0.25rem;
`;

const CtaText = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textMuted};
  margin: 0;
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${({ theme }) => theme.textMuted};
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;

  h2 {
    color: ${({ theme }) => theme.text};
    margin: 0 0 0.5rem;
  }

  p {
    color: ${({ theme }) => theme.textMuted};
    margin: 0 0 1rem;
  }
`;

const CycleDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [cycle, setCycle] = useState<Cycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    setLoading(true);
    setError(null);
    fetch(`/api/cycles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Cycle not found");
        return res.json();
      })
      .then((data) => setCycle(data.cycle))
      .catch(() => setError("Cycle not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading...</LoadingContainer>
      </Container>
    );
  }

  if (error || !cycle) {
    return (
      <Container>
        <ContentArea>
          <ErrorContainer>
            <h2>Cycle not found</h2>
            <p>The cycle you&apos;re looking for doesn&apos;t exist.</p>
            <BackButton href="/cycles">← Back to Cycles</BackButton>
          </ErrorContainer>
        </ContentArea>
      </Container>
    );
  }

  const startDate = new Date(cycle.startDate);
  const endDate = new Date(cycle.endDate);
  const dateRange = `${startDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })} – ${endDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}`;

  const leadCreator = cycle.creators.find((c) => c.role === "lead");
  const collaborators = cycle.creators
    .filter((c) => c.role === "collaborator")
    .sort((a, b) => a.order - b.order);

  return (
    <Container>
      <Head>
        <title>{cycle.title} | {creationCycleConfig.name}</title>
        <meta name="description" content={cycle.creativeDirection || cycle.title} />
        <link rel="icon" href={creationCycleConfig.branding.favicon} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header>
        <BackButton href="/cycles">←</BackButton>
      </Header>
      <HeaderSpacer />

      <ContentArea>
        <CycleTitle>{cycle.title}</CycleTitle>
        <CycleMeta>
          <StatusBadge $status={cycle.status}>{cycle.status}</StatusBadge>
          <span>{dateRange}</span>
        </CycleMeta>

        {cycle.creativeDirection && (
          <Section>
            <SectionTitle>Creative Direction</SectionTitle>
            <CreativeDirection>{cycle.creativeDirection}</CreativeDirection>
          </Section>
        )}

        <Section>
          <SectionTitle>Creation Process</SectionTitle>
          <WeekTimeline />
        </Section>

        {cycle.creators.length > 0 && (
          <Section>
            <SectionTitle>Creator Team</SectionTitle>
            <CreatorsList>
              {leadCreator && (
                <CreatorItem>
                  {leadCreator.pfpUrl ? (
                    <CreatorImage
                      src={leadCreator.pfpUrl}
                      alt={leadCreator.displayName || leadCreator.username || "Lead"}
                    />
                  ) : (
                    <CreatorAvatar>
                      {(leadCreator.displayName || leadCreator.username || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </CreatorAvatar>
                  )}
                  <CreatorInfo>
                    <CreatorName>
                      {leadCreator.displayName || leadCreator.username || "Unknown"}
                    </CreatorName>
                    <CreatorRole>Lead Creator</CreatorRole>
                  </CreatorInfo>
                </CreatorItem>
              )}
              {collaborators.map((c) => (
                <CreatorItem key={c.id}>
                  {c.pfpUrl ? (
                    <CreatorImage
                      src={c.pfpUrl}
                      alt={c.displayName || c.username || "Collaborator"}
                    />
                  ) : (
                    <CreatorAvatar>
                      {(c.displayName || c.username || "?")
                        .charAt(0)
                        .toUpperCase()}
                    </CreatorAvatar>
                  )}
                  <CreatorInfo>
                    <CreatorName>
                      {c.displayName || c.username || "Unknown"}
                    </CreatorName>
                    <CreatorRole>Collaborator</CreatorRole>
                  </CreatorInfo>
                </CreatorItem>
              ))}
            </CreatorsList>
          </Section>
        )}

        {cycle.documentationUrl && (
          <Section>
            <SectionTitle>Documentation</SectionTitle>
            <DocLink
              href={cycle.documentationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View process documentation →
            </DocLink>
          </Section>
        )}

        {cycle.celebrationEvent && (
          <Section>
            <SectionTitle>Live Celebration</SectionTitle>
            <CtaCard href={`/events/${cycle.celebrationEvent.id}`}>
              <CtaTitle>{cycle.celebrationEvent.title}</CtaTitle>
              <CtaText>
                ${cycle.celebrationEvent.ticketPrice} ·{" "}
                {cycle.celebrationEvent.ticketsSold}/
                {cycle.celebrationEvent.capacity} tickets · Reserve your spot
              </CtaText>
            </CtaCard>
          </Section>
        )}
      </ContentArea>
    </Container>
  );
};

export default CycleDetailPage;
