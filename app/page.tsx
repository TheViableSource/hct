import { getCmsContent } from "@/lib/cms/content";
import type { Metadata } from "next";
import { ExtraSections } from "@/components/cms/ContentProvider";
import Hero from "@/components/sections/home/Hero";
import Vision from "@/components/sections/home/Vision";
import Pillars from "@/components/sections/home/Pillars";
import CommunityCall from "@/components/sections/home/CommunityCall";
import StayConnected from "@/components/sections/home/StayConnected";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Vision />
      <Pillars />
      <CommunityCall />
      <StayConnected />
      <ExtraSections page="/" />
    </>
  );
}

export async function generateMetadata(): Promise<Metadata> { const {document,preview}=await getCmsContent(); return {...document.seo["/"], alternates:{canonical:"/"}, ...(preview?{robots:{index:false,follow:false}}:{})}; }
