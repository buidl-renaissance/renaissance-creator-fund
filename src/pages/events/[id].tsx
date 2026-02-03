import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styled, { keyframes } from "styled-components";
import { useUser } from "@/contexts/UserContext";
import { Loading } from "@/components/Loading";
import { creationCycleConfig } from "@/config/creationCycle";

interface Creator {
  id: string;
  displayName: string | null;
  username: string | null;
  pfpUrl: string | null;
  role: string;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  eventDate: string;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  capacity: number;
  ticketPrice: number;
  ticketsSold: number;
  imageUrl?: string | null;
  cycle?: { id: string; title: string } | null;
  creators?: Creator[];
  userHasTicket?: boolean;
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

const EventImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${({ theme }) => theme.backgroundAlt};
  border-radius: 12px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: ${({ theme }) => theme.textMuted};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const EventTitle = styled.h1`
  font-family: "Source Sans 3", sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0 0 0.5rem;
`;

const EventMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textMuted};
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.6;
  margin: 0 0 2rem;
`;

const SectionTitle = styled.h2`
  font-family: "Source Sans 3", sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 0.75rem;
`;

const CreatorsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const CreatorChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 20px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text};
`;

const CreatorAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
`;

const CreatorImage = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
`;

const TicketSection = styled.div`
  padding: 1.5rem;
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  margin-top: 2rem;
`;

const TicketInfo = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.textMuted};
  margin: 0 0 1rem;
`;

const ReserveButton = styled.button<{ $disabled?: boolean }>`
  width: 100%;
  padding: 1rem 1.5rem;
  background: ${({ theme, $disabled }) =>
    $disabled ? theme.border : theme.accent};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.accentHover};
  }
`;

const ReservedBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.accentMuted};
  color: ${({ theme }) => theme.accent};
  border-radius: 8px;
  font-weight: 600;
`;

const CancelButton = styled.button`
  margin-top: 0.75rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textMuted};
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.textMuted};
    color: ${({ theme }) => theme.text};
  }
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
    margin: 0;
  }
`;

function formatEventDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(time: string | null): string {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

const EventDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user, isLoading: isUserLoading } = useUser();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reserving, setReserving] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchEvent = () => {
    if (!id || typeof id !== "string") return;
    fetch(`/api/events/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Event not found");
        return res.json();
      })
      .then((data) => setEvent(data.event))
      .catch(() => setError("Event not found"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    setLoading(true);
    setError(null);
    fetchEvent();
  }, [id]);

  const handleReserve = async () => {
    if (!user || !event || reserving) return;
    setReserving(true);
    try {
      const res = await fetch(`/api/events/${id}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        fetchEvent();
      }
    } finally {
      setReserving(false);
    }
  };

  const handleCancel = async () => {
    if (!user || !event || cancelling) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/events/${id}/tickets`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchEvent();
      }
    } finally {
      setCancelling(false);
    }
  };

  if (isUserLoading || loading) {
    return (
      <Container>
        <LoadingContainer>Loading...</LoadingContainer>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container>
        <ContentArea>
          <ErrorContainer>
            <h2>Event not found</h2>
            <p>The event you&apos;re looking for doesn&apos;t exist.</p>
            <BackButton href="/events">← Back to Events</BackButton>
          </ErrorContainer>
        </ContentArea>
      </Container>
    );
  }

  const eventDate = new Date(event.eventDate);
  const isSoldOut = event.ticketsSold >= event.capacity;
  const needsAuth = !user;

  return (
    <Container>
      <Head>
        <title>{event.title} | {creationCycleConfig.name}</title>
        <meta name="description" content={event.description || event.title} />
        <link rel="icon" href={creationCycleConfig.branding.favicon} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Header>
        <BackButton href="/events">←</BackButton>
      </Header>
      <HeaderSpacer />

      <ContentArea>
        <EventImage>
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} />
          ) : (
            "🎉"
          )}
        </EventImage>

        <EventTitle>{event.title}</EventTitle>
        <EventMeta>
          <span>{formatEventDate(eventDate)}</span>
          {(event.startTime || event.endTime) && (
            <span>
              {formatTime(event.startTime)}
              {event.endTime && ` – ${formatTime(event.endTime)}`}
            </span>
          )}
          {event.location && <span>{event.location}</span>}
          {event.cycle && (
            <Link href={`/cycles/${event.cycle.id}`} style={{ color: "inherit" }}>
              {event.cycle.title}
            </Link>
          )}
        </EventMeta>

        {event.description && (
          <Description>{event.description}</Description>
        )}

        {event.creators && event.creators.length > 0 && (
          <>
            <SectionTitle>Creators</SectionTitle>
            <CreatorsList>
              {event.creators.map((c) => (
                <CreatorChip key={c.id}>
                  {c.pfpUrl ? (
                    <CreatorImage
                      src={c.pfpUrl}
                      alt={c.displayName || c.username || "Creator"}
                    />
                  ) : (
                    <CreatorAvatar>
                      {(c.displayName || c.username || "?").charAt(0).toUpperCase()}
                    </CreatorAvatar>
                  )}
                  {c.displayName || c.username || "Creator"}
                </CreatorChip>
              ))}
            </CreatorsList>
          </>
        )}

        <TicketSection>
          <TicketInfo>
            ${event.ticketPrice} · {event.ticketsSold}/{event.capacity} tickets
            reserved
          </TicketInfo>
          {event.userHasTicket ? (
            <div>
              <ReservedBadge>✓ You have a ticket</ReservedBadge>
              <CancelButton
                onClick={handleCancel}
                disabled={cancelling}
              >
                Cancel reservation
              </CancelButton>
            </div>
          ) : (
            <ReserveButton
              onClick={handleReserve}
              disabled={isSoldOut || needsAuth || reserving}
              $disabled={isSoldOut || needsAuth}
            >
              {needsAuth
                ? "Sign in to reserve"
                : isSoldOut
                  ? "Sold out"
                  : reserving
                    ? "Reserving..."
                    : "Reserve ticket"}
            </ReserveButton>
          )}
        </TicketSection>
      </ContentArea>
    </Container>
  );
};

export default EventDetailPage;
