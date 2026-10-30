'use client';

import { useT } from '@/i18n/t';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { CourseExplorer } from '@/components/courses/CourseExplorer';
import { courses } from '@/content/home';

export function CoursesSection() {
  const t = useT();
  return (
    <section id="courses" className="relative bg-bg py-24 md:py-32">
      <div className="container-x">
        <SectionHeading tag={t(courses.tag)} title={t(courses.title)} intro={t(courses.intro)} />
        <CourseExplorer />
      </div>
    </section>
  );
}
