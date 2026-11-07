export const SITE_URL = "https://hillsborocivictheatre.com";

import type {
  NavLink,
  Pillar,
  RoleCard,
  ValueItem,
  Milestone,
  DonationTier,
  SponsorTier,
} from "./types";

export const BRAND = {
  name: "Hillsboro Civic Theater",
  short: "HCT",
  wordmark: "HILLSBORO CIVIC THEATER",
  tagline: "Where Hillsboro Takes the Stage",
  mission:
    "A theater run by local volunteers. We bring big musicals to the stage with a full live orchestra.",
  location: "Hillsboro · Oregon",
  email: "hello@hillsborocivictheater.org",
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },
} as const;

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Community", href: "/community" },
  { label: "Donate", href: "/donate" },
  { label: "Get Involved", href: "/get-involved" },
];

export const PILLARS: Pillar[] = [
  {
    icon: "clef",
    title: "Big Shows, Live Music",
    body: "We put on big musicals with full live orchestras. We give each show the time and care it needs to shine.",
  },
  {
    icon: "circle",
    title: "Volunteer Powered",
    body: "Everyone on stage, in the orchestra, and behind the scenes is a volunteer. Our neighbors give their time to build and run HCT. They believe Hillsboro deserves great theater.",
  },
  {
    icon: "curtain",
    title: "Open to Everyone",
    body: "Have years on stage? Seeing your first show? Just want to help? There is a place for you here.",
  },
];

export const COMMUNITY_ROLES: RoleCard[] = [
  {
    title: "Performers",
    body: "We welcome singers, actors, and dancers at every skill level. Our big musicals need lots of people on stage. Check here first for audition news.",
  },
  {
    title: "Musicians",
    body: "Live music is at the heart of our shows. Play strings, brass, woodwinds, or percussion? There is a place for your instrument in our orchestra.",
  },
  {
    title: "Directors & Choreographers",
    body: "Help lead our shows. We need directors, music directors, and dance leaders who care about great work and our community.",
  },
  {
    title: "Production & Crew",
    body: "Build sets, run lights and sound, make costumes, or manage the stage. The work behind the curtain matters as much as the show.",
  },
  {
    title: "Volunteers",
    body: "Welcome guests, help at events, spread the word, or help with office tasks. There are many ways to lend a hand.",
  },
  {
    title: "Audience Members",
    body: "Buy a ticket. Bring a friend. Tell someone about HCT. Every person in the audience helps make theater possible.",
  },
];

export const COMMUNITY_VALUES: ValueItem[] = [
  {
    title: "Belonging",
    body: "Everyone belongs at HCT. On stage, in the orchestra, behind the scenes, or in the audience, you matter.",
  },
  {
    title: "Growth",
    body: "There is always more to learn. Whether this is your first show or you have years of practice, HCT is a place to grow.",
  },
  {
    title: "Craft",
    body: "We care about the work. We practice until it feels right. We build with care. Each detail matters.",
  },
  {
    title: "Joy",
    body: "Theater should feel full of life. We love the work, the people, and the joy of a great show. That is why we are here.",
  },
];

export const MISSION_VALUES: string[] = [
  "Great art, made with care",
  "Our community comes first",
  "A place for everyone",
  "Care in every detail",
  "Kindness in all we do",
];

export const MILESTONES: Milestone[] = [
  {
    phase: "Getting Started (Now)",
    body: "We are setting up HCT and doing the legal work. We are finding our first sponsors and volunteers.",
    active: true,
  },
  {
    phase: "Community Building",
    body: "We are bringing together our first cast, orchestra, directors, and crew. We are building ties with local venues and arts groups.",
  },
  {
    phase: "First Production",
    body: "Our first big musical, with a full live orchestra and a local cast.",
  },
  {
    phase: "A Lasting Home for HCT",
    body: "Our goal: a season of shows each year, programs for young people, and a lasting home for the arts in Hillsboro.",
  },
];

export const DONATION_TIERS: DonationTier[] = [
  {
    name: "Supporter",
    amount: "Any Amount",
    body: "Every gift matters. Give what works for you. Your support helps us build HCT.",
    cta: "Give a Gift",
  },
  {
    name: "Friend of HCT",
    amount: "$100–$499/year",
    body: "Your name in our first season program. Early news about tickets. Our heartfelt thanks.",
    cta: "Become a Friend",
  },
  {
    name: "Patron",
    amount: "$500–$999/year",
    body: "All Friend benefits. Thanks at HCT events. An invite to events just for Patrons.",
    cta: "Become a Patron",
  },
  {
    name: "Producer",
    amount: "$1,000–$4,999/year",
    body: "All Patron benefits. Your name in show programs. A special thank-you at shows.",
    cta: "Become a Producer",
  },
  {
    name: "Founding Benefactor",
    amount: "$5,000+/year",
    body: "Help give HCT a lasting home in our city. Your name in all founding materials. A private thank-you event. Your name as part of our history.",
    cta: "Join Our Founders",
    featured: true,
    featuredLabel: "Founding Level",
  },
];

export const SPONSOR_TIERS: SponsorTier[] = [
  {
    tier: "Community Sponsor",
    investment: "$250–$999",
    recognition: "Your name in the program, on our website, and on social media",
  },
  {
    tier: "Production Sponsor",
    investment: "$1,000–$4,999",
    recognition: "All benefits above, plus your logo in the program and a spoken thank-you at shows",
  },
  {
    tier: "Season Sponsor",
    investment: "$5,000–$9,999",
    recognition:
      "All benefits above, plus a featured logo, an event invite, and thanks in press materials",
  },
  {
    tier: "Title Sponsor",
    investment: "$10,000–$24,999",
    recognition:
      "All benefits above, plus your name tied to our first show and featured in all materials",
  },
  {
    tier: "Founding Benefactor",
    investment: "$25,000+",
    recognition:
      "Your name honored as a founder. Title sponsor credit for our first season. A lasting place in HCT history.",
  },
];

export const VOLUNTEER_NEEDS: string[] = [
  "Event Support",
  "Community Outreach",
  "Social Media Help",
  "Photos / Video",
  "Graphic Design",
  "Grant Writing",
  "Office Help",
  "Fundraising",
  "Ticket Sales / Guest Welcome",
];
