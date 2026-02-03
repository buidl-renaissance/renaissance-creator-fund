/**
 * Creation Cycle Configuration
 *
 * A month-long, creator-led creation program that funds original work through
 * community participation, sponsor matching, and artisan fund support.
 */

export const creationCycleConfig = {
  // Basic Info
  name: "Creation Cycle",
  fullName: "Renaissance City Creator Fund",
  tagline: "Creator-Led, Community-Funded Work",
  description:
    "A month-long, creator-led creation program that funds original work through a blended model of community participation, sponsor matching, and artisan fund support. Each cycle culminates in a live public celebration and a documented creative artifact.",

  // Program Structure
  structure: {
    durationWeeks: 4,
    leadCreatorCount: 1,
    collaboratorCount: "2-3" as const,
    creatorTeamDescription:
      "1 lead creator and 2–3 collaborators. The lead creator sets the creative direction, assembles the team, and distributes funds among collaborators.",
  },

  // Funding Model (per cycle)
  funding: {
    totalPerCycle: 1500,
    communityTickets: 500,
    sponsorMatch: 500,
    artisanFund: 500,
    creatorCompensation: 1000,
    productionCosts: 500,
  },

  // Live Celebration Event
  event: {
    ticketPrice: 20,
    attendanceCap: 25,
    description:
      "Limited-capacity, ticketed public event held at the studio. Includes live presentation, documentation display, light hospitality, and a printed or digital artifact.",
    ticketsSoldByCreators:
      "Tickets are sold primarily by the creators, reinforcing direct community support.",
  },

  // Pilot Timeline
  pilot: {
    cycles: [
      { month: "April", year: 2026 },
      { month: "May", year: 2026 },
    ],
  },

  // Creation Process (week-by-week)
  process: {
    week1: {
      title: "Origin & Ideation",
      description:
        "Creator introductions, concept development, documentation of intent and creative direction.",
    },
    week2to3: {
      title: "Creation & Process",
      description:
        "Active creation, ongoing documentation (video, photography, interviews), creation partner acknowledgments integrated into process storytelling.",
    },
    week4: {
      title: "Completion & Public Celebration",
      description:
        "Finalization of the work, live public event celebrating the completed creation, first public viewing and community gathering.",
    },
  },

  // Creation Partner Role (display term; sponsor kept for data)
  sponsor: {
    displayName: "Creation partner",
    description:
      "Creation partners act as enablers of creation, not advertisers. Their support is acknowledged throughout the month-long process via documentation content, creator acknowledgments, and event recognition. Support directly increases creator compensation and helps sustain the program's production costs.",
  },

  // Outcomes & Impact
  outcomes: [
    "A fully funded original creation",
    "Paid opportunities for multiple creators",
    "A documented creative process (mini-documentary + short-form content)",
    "A live public engagement moment",
    "A growing archive of creator-led work and community participation",
  ],

  // Branding
  branding: {
    logo: null as string | null,
    favicon: "/favicon.ico",
  },

  // Theme (clay/rust accent per style guide)
  theme: {
    primary: "#8B6B4A",
    primaryHover: "#7A5E41",
  },
};

export type CreationCycleConfig = typeof creationCycleConfig;
