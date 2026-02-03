import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styled, { keyframes } from "styled-components";
import { useUser } from "@/contexts/UserContext";
// @ts-expect-error - qrcode.react types
import { QRCodeSVG } from "qrcode.react";
import { creationCycleConfig } from "@/config/creationCycle";
import { TabBar, TabBarSpacer } from "@/components/navigation";

const APP_DEEP_LINK = "renaissance://";
const APP_AUTH_DEEP_LINK = "renaissance://authenticate";

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
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
`;

const PageTitle = styled.h1`
  font-family: "Source Sans 3", sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0 0 0.5rem;
`;

const PageSubtitle = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.textMuted};
  margin: 0 0 2rem;
`;

const Section = styled.section<{ $delay?: number }>`
  margin-bottom: 2rem;
  animation: ${fadeInUp} 0.4s ease-out both;
  animation-delay: ${({ $delay }) => $delay || 0.1}s;
`;

const SectionTitle = styled.h2`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  overflow: hidden;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const Avatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.accent};
`;

const AvatarPlaceholder = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${({ theme }) => theme.border};
  border: 2px solid ${({ theme }) => theme.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
  font-weight: 600;
`;

const Username = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const DisplayName = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textMuted};
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textMuted};
`;

const InfoValue = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const InfoValueMuted = styled(InfoValue)`
  color: ${({ theme }) => theme.textMuted};
  font-style: italic;
`;

const ActionButton = styled.button<{ $variant?: "danger" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $variant, theme }) =>
    $variant === "danger" ? theme.danger + "15" : theme.accent};
  color: ${({ $variant, theme }) =>
    $variant === "danger" ? theme.danger : "#fff"};
  border: 1px solid
    ${({ $variant, theme }) =>
      $variant === "danger" ? theme.danger + "30" : theme.accent};

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Login UI
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
  width: 100%;
  text-align: center;
`;

const LoginCard = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  animation: ${fadeInUp} 0.4s ease-out both;
`;

const LoginTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  margin: 0 0 0.5rem;
`;

const LoginSubtitle = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.textMuted};
  margin: 0 0 1.5rem;
  line-height: 1.5;
`;

const QRCodeContainer = styled.div`
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  display: inline-block;
  margin-bottom: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid ${({ theme }) => theme.border};
  border-top-color: ${({ theme }) => theme.accent};
  border-radius: 50%;
  animation: ${rotate} 0.8s linear infinite;
  margin: 0 auto 1rem;
`;

const StatusText = styled.p<{ $type?: "success" | "error" }>`
  font-size: 0.9rem;
  color: ${({ $type, theme }) =>
    $type === "success" ? theme.success : $type === "error" ? theme.danger : theme.textMuted};
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const PulsingDot = styled.span`
  width: 8px;
  height: 8px;
  background: ${({ theme }) => theme.accent};
  border-radius: 50%;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const TimerText = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textMuted};
`;

const RefreshButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.accent};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  margin-top: 0.5rem;

  &:hover {
    background: ${({ theme }) => theme.accentMuted};
  }
`;

const DesktopOnlySection = styled.div`
  @media (max-width: 767px) {
    display: none;
  }
`;

const MobileSection = styled.div`
  display: none;
  @media (max-width: 767px) {
    display: block;
  }
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  color: ${({ theme }) => theme.textMuted};
  font-size: 0.85rem;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.border};
  }
`;

const MobileAppButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.accent};
  background: ${({ theme }) => theme.accent};
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

const GuestLink = styled(Link)`
  display: block;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textMuted};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoading, signOut, refreshUser } = useUser();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const createSession = useCallback(async () => {
    setIsCreatingSession(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/auth/session", { method: "POST" });
      const data = await res.json();
      if (data.success && data.token) {
        setSessionToken(data.token);
        setSessionExpiresAt(data.expiresAt);
      } else {
        setLoginError("Failed to create login session");
      }
    } catch {
      setLoginError("Failed to create login session");
    } finally {
      setIsCreatingSession(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !user && !sessionToken && !isCreatingSession) {
      createSession();
    }
  }, [isLoading, user, sessionToken, isCreatingSession, createSession]);

  useEffect(() => {
    if (!sessionToken || user) return;
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/auth/session?token=${sessionToken}`);
        const data = await res.json();
        if (data.authenticated) {
          await refreshUser();
          setSessionToken(null);
          setSessionExpiresAt(null);
        } else if (data.expired) {
          setSessionToken(null);
          setSessionExpiresAt(null);
          createSession();
        }
      } catch {
        // ignore
      }
    }, 2000);
    return () => clearInterval(pollInterval);
  }, [sessionToken, user, refreshUser, createSession]);

  useEffect(() => {
    if (!sessionExpiresAt) {
      setTimeRemaining(0);
      return;
    }
    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.floor((sessionExpiresAt - Date.now()) / 1000)
      );
      setTimeRemaining(remaining);
      if (remaining === 0 && sessionToken) {
        setSessionToken(null);
        setSessionExpiresAt(null);
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [sessionExpiresAt, sessionToken]);

  const getQRCodeUrl = () => {
    if (!sessionToken) return "";
    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : "";
    return `${baseUrl}/api/auth/qr-authenticate?token=${sessionToken}`;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOpenApp = () => {
    if (sessionToken) {
      window.location.href = `${APP_AUTH_DEEP_LINK}?token=${sessionToken}&callback=${encodeURIComponent(window.location.origin)}`;
    } else {
      window.location.href = APP_DEEP_LINK;
    }
  };

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      signOut();
      router.push("/");
    } catch {
      setIsSigningOut(false);
    }
  };

  const formatDate = (d: string | Date | null | undefined) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const formatAddress = (addr: string | null | undefined) => {
    if (!addr) return null;
    if (addr.length <= 16) return addr;
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };

  if (isLoading) return null;

  if (!user) {
    return (
      <>
        <Head>
          <title>Sign In | {creationCycleConfig.name}</title>
          <meta name="description" content={`Sign in to ${creationCycleConfig.name}`} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href={creationCycleConfig.branding.favicon} />
        </Head>
        <Container>
          <ContentArea>
            <LoginContainer>
              <LoginCard>
                <LoginTitle>Sign In</LoginTitle>

                <DesktopOnlySection>
                  <LoginSubtitle>
                    Scan this QR code with the Renaissance app to sign in
                  </LoginSubtitle>
                  {isCreatingSession ? (
                    <>
                      <LoadingSpinner />
                      <StatusText>Creating session...</StatusText>
                    </>
                  ) : loginError ? (
                    <>
                      <StatusText $type="error">{loginError}</StatusText>
                      <RefreshButton onClick={createSession}>Try Again</RefreshButton>
                    </>
                  ) : sessionToken ? (
                    <>
                      <QRCodeContainer>
                        <QRCodeSVG
                          value={getQRCodeUrl()}
                          size={200}
                          level="M"
                          includeMargin={false}
                        />
                      </QRCodeContainer>
                      <StatusText>
                        <PulsingDot />
                        Waiting for authentication...
                      </StatusText>
                      {timeRemaining > 0 && (
                        <TimerText>Expires in {formatTime(timeRemaining)}</TimerText>
                      )}
                      {timeRemaining === 0 && (
                        <RefreshButton onClick={createSession}>
                          Refresh QR Code
                        </RefreshButton>
                      )}
                    </>
                  ) : null}
                </DesktopOnlySection>

                <MobileSection>
                  <LoginSubtitle>
                    Open the Renaissance app to sign in to your account
                  </LoginSubtitle>
                  <MobileAppButton onClick={handleOpenApp}>
                    Open Renaissance App
                  </MobileAppButton>
                  <OrDivider>or</OrDivider>
                  {isCreatingSession ? (
                    <>
                      <LoadingSpinner />
                      <StatusText>Creating session...</StatusText>
                    </>
                  ) : sessionToken ? (
                    <>
                      <StatusText style={{ marginBottom: "0.5rem" }}>
                        Show this QR code to another device
                      </StatusText>
                      <QRCodeContainer>
                        <QRCodeSVG
                          value={getQRCodeUrl()}
                          size={160}
                          level="M"
                          includeMargin={false}
                        />
                      </QRCodeContainer>
                      <StatusText>
                        <PulsingDot />
                        Waiting...
                      </StatusText>
                    </>
                  ) : null}
                </MobileSection>

                <GuestLink href="/dashboard">Continue as guest</GuestLink>
              </LoginCard>
            </LoginContainer>
          </ContentArea>

          <TabBarSpacer />
          <TabBar />
        </Container>
      </>
    );
  }

  const displayName = user.username || user.displayName || "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <Head>
        <title>Account | {creationCycleConfig.name}</title>
        <meta
          name="description"
          content={`Manage your ${creationCycleConfig.name} account`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={creationCycleConfig.branding.favicon} />
      </Head>
      <Container>
        <ContentArea>
          <PageTitle>Account</PageTitle>
          <PageSubtitle>Manage your account settings</PageSubtitle>

          <Section $delay={0.1}>
            <SectionTitle>Profile</SectionTitle>
            <Card>
              <ProfileHeader>
                {user.pfpUrl || user.profilePicture ? (
                  <Avatar
                    src={(user.pfpUrl || user.profilePicture) as string}
                    alt={displayName}
                  />
                ) : (
                  <AvatarPlaceholder>{initials || "?"}</AvatarPlaceholder>
                )}
                <div>
                  <Username>@{user.username || "anonymous"}</Username>
                  {user.displayName &&
                    user.displayName !== user.username && (
                      <DisplayName>{user.displayName}</DisplayName>
                    )}
                </div>
              </ProfileHeader>
              <InfoRow>
                <InfoLabel>Email</InfoLabel>
                {user.email ? (
                  <InfoValue>{user.email}</InfoValue>
                ) : (
                  <InfoValueMuted>Not set</InfoValueMuted>
                )}
              </InfoRow>
              <InfoRow>
                <InfoLabel>Phone</InfoLabel>
                {user.phone ? (
                  <InfoValue>{user.phone}</InfoValue>
                ) : (
                  <InfoValueMuted>Not set</InfoValueMuted>
                )}
              </InfoRow>
              <InfoRow>
                <InfoLabel>Wallet</InfoLabel>
                {user.accountAddress ? (
                  <InfoValue title={user.accountAddress}>
                    {formatAddress(user.accountAddress)}
                  </InfoValue>
                ) : (
                  <InfoValueMuted>Not connected</InfoValueMuted>
                )}
              </InfoRow>
              {user.createdAt && (
                <InfoRow>
                  <InfoLabel>Member since</InfoLabel>
                  <InfoValue>{formatDate(user.createdAt)}</InfoValue>
                </InfoRow>
              )}
            </Card>
          </Section>

          <Section $delay={0.15}>
            <SectionTitle>Session</SectionTitle>
            <ActionButton
              $variant="danger"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </ActionButton>
          </Section>
        </ContentArea>

        <TabBarSpacer />
        <TabBar />
      </Container>
    </>
  );
}
