'use client';

import { useT } from '@/i18n/t';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CourseExplorer } from '@/components/courses/CourseExplorer';
import { courses } from '@/content/home';

export function CoursesSection() {
  const t = useT();
  return (
    <section id="courses" className="relative bg-bg py-20 md:py-28">
      <div className="container-x">
        <SectionHeading tag={t(courses.tag)} title={t(courses.title)} intro={t(courses.intro)} num="05" />
        <CourseExplorer />
      </div>
    </section>
  );
}
