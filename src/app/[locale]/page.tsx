import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { TrustBento } from '@/components/home/TrustBento';
import { About } from '@/components/home/About';
import { LawSection } from '@/components/home/LawSection';
import { Pathways } from '@/components/home/Pathways';
import { RecordedTeaser } from '@/components/home/RecordedTeaser';
import { CoursesSection } from '@/components/home/CoursesSection';
import { Schedule } from '@/components/home/Schedule';
import { Roadmap } from '@/components/home/Roadmap';
import { Testimonials } from '@/components/home/Testimonials';
import { Instructor } from '@/components/home/Instructor';
import { Faq } from '@/components/home/Faq';
import { SectionRail } from '@/components/layout/SectionRail';
import { publicRecordedCourses } from '@/lib/recorded';
import { getBatches, getFaq, getReviews } from '@/lib/content';

export const revalidate = 300;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [recorded, batches, faq, reviews] = await Promise.all([publicRecordedCourses(), getBatches(), getFaq(), getReviews()]);

  return (
    <>
      <SectionRail />
      <Hero />
      <TrustBento />
      <About />
      <LawSection />
      <Pathways />
      <RecordedTeaser courses={recorded} />
      <CoursesSection />
      <Schedule batches={batches} />
      <Roadmap />
      <Testimonials items={reviews} />
      <Instructor />
      <Faq items={faq} />
    </>
  );
}
