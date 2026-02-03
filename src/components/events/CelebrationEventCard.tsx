import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { creationCycleConfig } from "@/config/creationCycle";

interface CelebrationEvent {
  id: string;
  title: string;
  description: string | null;
  eventDate: Date;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  capacity: number;
  ticketPrice: number;
  ticketsSold: number;
  imageUrl?: string | null;
  cycleTitle?: string | null;
}

interface CelebrationEventCardProps {
  event: CelebrationEvent;
  compact?: boolean;
}

const Card = styled.div<{ $compact?: boolean }>`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${(props) => (props.$compact ? "8px" : "12px")};
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.accent};
  }
`;

const CardImage = styled.div<{ $compact?: boolean }>`
  position: relative;
  height: ${(props) => (props.$compact ? "72px" : "140px")};
  background: ${({ theme }) => theme.backgroundAlt};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DateBadge = styled.div<{ $compact?: boolean }>`
  position: absolute;
  top: ${(props) => (props.$compact ? "0.4rem" : "1rem")};
  left: ${(props) => (props.$compact ? "0.4rem" : "1rem")};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${(props) => (props.$compact ? "0.25rem 0.4rem" : "0.5rem 0.75rem")};
  background: ${({ theme }) => theme.accent};
  border-radius: ${(props) => (props.$compact ? "4px" : "8px")};
  box-shadow: 0 1px 4px ${({ theme }) => theme.shadow};
`;

const DateMonth = styled.span<{ $compact?: boolean }>`
  font-size: ${(props) => (props.$compact ? "0.5rem" : "0.65rem")};
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DateDay = styled.span<{ $compact?: boolean }>`
  font-size: ${(props) => (props.$compact ? "0.95rem" : "1.5rem")};
  font-weight: 700;
  color: white;
  line-height: 1;
`;

const PlaceholderImage = styled.div<{ $compact?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => (props.$compact ? "1.5rem" : "3rem")};
  color: ${({ theme }) => theme.textMuted};
`;

const CardContent = styled.div<{ $compact?: boolean }>`
  padding: ${(props) => (props.$compact ? "0.5rem 0.75rem" : "1rem")};
`;

const EventTitle = styled(Link)<{ $compact?: boolean }>`
  display: block;
  font-family: "Source Sans 3", sans-serif;
  font-size: ${(props) => (props.$compact ? "0.9rem" : "1.1rem")};
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  margin-bottom: ${(props) => (props.$compact ? "0.25rem" : "0.5rem")};
  text-decoration: none;
  line-height: 1.3;

  &:hover {
    color: ${({ theme }) => theme.accent};
  }
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textMuted};
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-top: 1px solid ${({ theme }) => theme.border};
  font-size: 0.85rem;
`;

const TicketInfo = styled.span`
  color: ${({ theme }) => theme.textMuted};
`;

const TicketCta = styled(Link)`
  padding: 0.4rem 0.8rem;
  background: ${({ theme }) => theme.accent};
  border-radius: 6px;
  color: white;
  font-weight: 500;
  text-decoration: none;
  font-size: 0.8rem;

  &:hover {
    background: ${({ theme }) => theme.accentHover};
  }
`;

function formatEventDate(date: Date): { month: string; day: number } {
  const d = new Date(date);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }),
    day: d.getDate(),
  };
}

export const CelebrationEventCard: React.FC<CelebrationEventCardProps> = ({
  event,
  compact,
}) => {
  const dateInfo = formatEventDate(event.eventDate);
  const spotsLeft = event.capacity - event.ticketsSold;
  const isSoldOut = spotsLeft <= 0;

  return (
    <Card $compact={compact}>
      <CardImage $compact={compact}>
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} />
        ) : (
          <PlaceholderImage $compact={compact}>🎉</PlaceholderImage>
        )}
        <DateBadge $compact={compact}>
          <DateMonth $compact={compact}>{dateInfo.month}</DateMonth>
          <DateDay $compact={compact}>{dateInfo.day}</DateDay>
        </DateBadge>
      </CardImage>

      <CardContent $compact={compact}>
        <EventTitle href={`/events/${event.id}`} $compact={compact}>
          {event.title}
        </EventTitle>
        <Meta>
          {event.cycleTitle && <span>{event.cycleTitle}</span>}
          {event.location && <span> {event.location}</span>}
        </Meta>
      </CardContent>

      <CardFooter>
        <TicketInfo>
          ${event.ticketPrice} · {event.ticketsSold}/{event.capacity} tickets
        </TicketInfo>
        <TicketCta href={`/events/${event.id}`}>
          {isSoldOut ? "Sold Out" : "Reserve"}
        </TicketCta>
      </CardFooter>
    </Card>
  );
};

export default CelebrationEventCard;
