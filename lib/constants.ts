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
    "A community-powered civic theater producing large-scale musicals with a full orchestra.",
  location: "Hillsboro · Oregon",
  email: "hello@hillsborocivictheater.org",
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
  },
} as const;

// Formspree endpoint — replace PLACEHOLDER with the real form ID once the
// account is set up (or set NEXT_PUBLIC_FORMSPREE_ID).
export const FORMSPREE_ID =
  process.env.NEXT_PUBLIC_FORMSPREE_ID || "PLACEHOLDER";
export const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_ID}`;

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
    title: "Full-Scale Productions",
    body: "We produce large-scale musicals with full live orchestras. No half-measures. No corner-cutting. Every production earns its place on stage.",
  },
  {
    icon: "circle",
    title: "Community Powered",
    body: "Every person on stage, in the pit, behind the curtain, and in the seats is part of what makes HCT possible. This theater belongs to Hillsboro.",
  },
  {
    icon: "curtain",
    title: "Open to Everyone",
    body: "Whether you're a seasoned performer, a first-time audience member, or someone who just wants to help build something beautiful — there's a place for you here.",
  },
];

export const COMMUNITY_ROLES: RoleCard[] = [
  {
    title: "Performers",
    body: "For singers, actors, and dancers of all experience levels. We produce full-scale musicals that need entire communities of talent on stage. Auditions will be announced here first.",
  },
  {
    title: "Musicians",
    body: "We believe live orchestras are non-negotiable. Whether you play strings, brass, woodwinds, or percussion, your instrument has a home in our pit.",
  },
  {
    title: "Directors & Choreographers",
    body: "We're building a creative leadership team of directors, music directors, and choreographers who share our commitment to excellence and community.",
  },
  {
    title: "Production & Crew",
    body: "Set design, lighting, sound, costumes, props, stage management — the craft behind the curtain is as important as what happens on stage.",
  },
  {
    title: "Volunteers",
    body: "Front of house, event support, community outreach, administrative help — there are a hundred ways to contribute beyond the stage.",
  },
  {
    title: "Audience Members",
    body: "Simply showing up matters. Buying a ticket, bringing a friend, sharing the word — audiences make theater possible.",
  },
];

export const COMMUNITY_VALUES: ValueItem[] = [
  {
    title: "Belonging",
    body: "HCT is a place where everyone is welcomed, respected, and valued — on stage, in the pit, backstage, and in the audience.",
  },
  {
    title: "Growth",
    body: "We believe in developing talent and capacity at every level. Whether you're a seasoned professional or trying this for the first time, HCT is a place to grow.",
  },
  {
    title: "Craft",
    body: "We take the work seriously. We rehearse until it's right. We design until it's beautiful. We care about every detail.",
  },
  {
    title: "Joy",
    body: "At the end of the day, this is theater. It should be joyful, electric, and alive. We never forget why we're here.",
  },
];

export const MISSION_VALUES: string[] = [
  "Artistry without compromise",
  "Community as the foundation",
  "Access and belonging for all",
  "Craftsmanship in every detail",
  "Emotional intelligence in everything we do",
];

export const MILESTONES: Milestone[] = [
  {
    phase: "Founding Phase (Now)",
    body: "Establishing the organization, building our founding sponsor and volunteer community, laying the legal and operational foundation.",
    active: true,
  },
  {
    phase: "Community Building",
    body: "Recruiting founding performers, musicians, directors, and crew. Establishing partnerships with local venues and arts organizations.",
  },
  {
    phase: "First Production",
    body: "Our inaugural large-scale musical production, produced with a full live orchestra and community cast.",
  },
  {
    phase: "HCT as Institution",
    body: "An annual season of productions, youth programming, and a permanent home for Hillsboro's performing arts.",
  },
];

export const DONATION_TIERS: DonationTier[] = [
  {
    name: "Supporter",
    amount: "Any Amount",
    body: "Every gift, at every level, matters. If you believe in what we're building, your support is welcomed and celebrated.",
    cta: "Give a Gift",
  },
  {
    name: "Friend of HCT",
    amount: "$100–$499/year",
    body: "Recognition in our inaugural season program · Early access to ticket announcements · Our sincere gratitude.",
    cta: "Become a Friend",
  },
  {
    name: "Patron",
    amount: "$500–$999/year",
    body: "Everything in Friend · Recognition at HCT events · Invitation to exclusive Patron events.",
    cta: "Become a Patron",
  },
  {
    name: "Producer",
    amount: "$1,000–$4,999/year",
    body: "Everything in Patron · Named recognition in production programs · Special acknowledgment at performances.",
    cta: "Become a Producer",
  },
  {
    name: "Founding Benefactor",
    amount: "$5,000+/year",
    body: "Your investment at this level helps establish HCT as a permanent institution. Named recognition in all founding materials · Private acknowledgment event · Your name as part of our history.",
    cta: "Become a Founding Benefactor",
    featured: true,
    featuredLabel: "Founding Level",
  },
];

export const SPONSOR_TIERS: SponsorTier[] = [
  {
    tier: "Community Sponsor",
    investment: "$250–$999",
    recognition: "Name in program, website listing, social recognition",
  },
  {
    tier: "Production Sponsor",
    investment: "$1,000–$4,999",
    recognition: "Above + logo in program, verbal recognition at performances",
  },
  {
    tier: "Season Sponsor",
    investment: "$5,000–$9,999",
    recognition:
      "Above + prominent logo placement, event invitation, press recognition",
  },
  {
    tier: "Title Sponsor",
    investment: "$10,000–$24,999",
    recognition:
      "Above + named association with inaugural production, prominent visibility across all materials",
  },
  {
    tier: "Founding Benefactor",
    investment: "$25,000+",
    recognition:
      "Named legacy recognition, title sponsorship of inaugural season, permanent acknowledgment in HCT history",
  },
];

export const VOLUNTEER_NEEDS: string[] = [
  "Event Support",
  "Community Outreach",
  "Social Media Assistance",
  "Photography / Videography",
  "Graphic Design",
  "Grant Writing",
  "Administrative Support",
  "Fundraising & Development",
  "Box Office / Front of House",
];
