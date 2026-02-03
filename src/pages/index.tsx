import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styled, { keyframes, css } from "styled-components";
import { creationCycleConfig } from "@/config/creationCycle";

const APP_NAME = creationCycleConfig.name;
const APP_TAGLINE = creationCycleConfig.tagline;
const APP_DESCRIPTION = creationCycleConfig.description;

// Animations
const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.5rem 4rem;
  position: relative;
  background: ${({ theme }) => theme.background};
`;

const Content = styled.div<{ $visible: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  transition: opacity 0.1s;
`;

const HeroSection = styled.section`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Headline = styled.h1<{ $delay: number }>`
  font-family: 'Source Sans 3', sans-serif;
  font-size: clamp(2.5rem, 10vw, 4rem);
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  letter-spacing: -0.04em;
  line-height: 0.95;
  margin: 0;
  animation: ${fadeUp} 0.8s ease-out both;
  animation-delay: ${({ $delay }) => $delay}ms;
`;

const Subheadline = styled.p<{ $delay: number }>`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.textMuted};
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin: 0.5rem 0 0;
  animation: ${fadeUp} 0.6s ease-out both;
  animation-delay: ${({ $delay }) => $delay}ms;
`;

const Description = styled.p<{ $delay: number }>`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 1rem;
  color: ${({ theme }) => theme.textSecondary};
  margin: 0.75rem 0 0;
  max-width: 480px;
  line-height: 1.6;
  animation: ${fadeIn} 0.6s ease-out both;
  animation-delay: ${({ $delay }) => $delay}ms;
`;

const FeatureSection = styled.section<{ $delay: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
  max-width: 480px;
  animation: ${fadeUp} 0.6s ease-out both;
  animation-delay: ${({ $delay }) => $delay}ms;
`;

const FeatureItem = styled.div<{ $delay: number }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: ${fadeIn} 0.5s ease-out both;
  animation-delay: ${({ $delay }) => $delay}ms;
`;

const FeatureIcon = styled.span`
  font-size: 1.25rem;
  opacity: 0.6;
  width: 2rem;
  text-align: center;
`;

const FeatureInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

const FeatureTitle = styled.span`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
  letter-spacing: -0.01em;
`;

const FeatureLabel = styled.span`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textMuted};
`;

const CTASection = styled.section<{ $delay: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 320px;
  animation: ${fadeUp} 0.6s ease-out both;
  animation-delay: ${({ $delay }) => $delay}ms;
`;

const EnterButton = styled(Link)<{ $active: boolean }>`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 1.125rem 3rem;
  background: ${({ theme }) => theme.accent};
  color: #FDFCF9;
  text-decoration: none;
  border-radius: 6px;
  transition: background 0.2s ease;
  width: 100%;
  text-align: center;
  
  ${({ $active }) => !$active && css`
    pointer-events: none;
    opacity: 0.5;
  `}
  
  &:hover {
    background: ${({ theme }) => theme.accentHover};
    color: #FDFCF9;
  }
`;

const CTAMicrocopy = styled.p`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textMuted};
  text-align: left;
  opacity: 0.7;
  margin: 0;
`;

const FooterRow = styled.footer<{ $delay: number }>`
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  animation: ${fadeIn} 0.6s ease-out both;
  animation-delay: ${({ $delay }) => $delay}ms;
  
  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const FooterText = styled.span`
  font-family: 'Source Sans 3', sans-serif;
  font-size: 0.7rem;
  color: ${({ theme }) => theme.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.15em;
  opacity: 0.4;
`;

const Divider = styled.span`
  width: 1px;
  height: 12px;
  background: ${({ theme }) => theme.border};
  opacity: 0.3;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const HomePage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [ctaActive, setCtaActive] = useState(false);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    const ctaTimer = setTimeout(() => {
      setCtaActive(true);
    }, 1800);

    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(ctaTimer);
    };
  }, []);

  const delays = {
    headline: 0,
    subheadline: 200,
    description: 400,
    features: 600,
    feature1: 700,
    feature2: 850,
    feature3: 1000,
    cta: 1200,
    footer: 1400,
  };

  return (
    <>
      <Head>
        <title>{creationCycleConfig.fullName || APP_NAME}</title>
        <meta name="description" content={APP_DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageContainer>
        <Content $visible={isVisible}>
          <HeroSection>
            <Headline $delay={delays.headline}>{APP_NAME}</Headline>
            <Subheadline $delay={delays.subheadline}>{APP_TAGLINE}</Subheadline>
            <Description $delay={delays.description}>
              {APP_DESCRIPTION}
            </Description>
          </HeroSection>

          <FeatureSection $delay={delays.features}>
            <FeatureItem $delay={delays.feature1}>
              <FeatureIcon>✨</FeatureIcon>
              <FeatureInfo>
                <FeatureTitle>Creator-Led</FeatureTitle>
                <FeatureLabel>Lead creator sets direction and assembles the team</FeatureLabel>
              </FeatureInfo>
            </FeatureItem>

            <FeatureItem $delay={delays.feature2}>
              <FeatureIcon>🤝</FeatureIcon>
              <FeatureInfo>
                <FeatureTitle>Community-Funded</FeatureTitle>
                <FeatureLabel>Blended support: tickets, sponsors, artisan fund</FeatureLabel>
              </FeatureInfo>
            </FeatureItem>

            <FeatureItem $delay={delays.feature3}>
              <FeatureIcon>🎉</FeatureIcon>
              <FeatureInfo>
                <FeatureTitle>Live Celebration</FeatureTitle>
                <FeatureLabel>Salon-style events at the studio each cycle</FeatureLabel>
              </FeatureInfo>
            </FeatureItem>
          </FeatureSection>

          <CTASection $delay={delays.cta}>
            <EnterButton href="/app" $active={ctaActive}>
              Enter
            </EnterButton>
            <CTAMicrocopy>Authenticated with the Renaissance City app</CTAMicrocopy>
          </CTASection>

          <FooterRow $delay={delays.footer}>
            <FooterText>Next.js</FooterText>
            <Divider />
            <FooterText>TypeScript</FooterText>
            <Divider />
            <FooterText>Drizzle</FooterText>
          </FooterRow>
        </Content>
      </PageContainer>
    </>
  );
};

export default HomePage;
