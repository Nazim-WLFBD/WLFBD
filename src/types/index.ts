export interface Course {
  id: string;
  code: string;
  title: string;
  banglaTitle: string;
  duration: string;
  banglaDuration?: string;
  classCount: number;
  classesPerWeek?: string;
  banglaClassesPerWeek?: string;
  targetClb?: string;
  banglaTargetClb?: string;
  regularPrice: number;
  offerPrice: number;
  targetAudience: string;
  banglaTargetAudience?: string;
  cefrLevel: string;
  outcome: string;
  banglaOutcome?: string;
  features: string[];
  banglaFeatures?: string[];
  popular?: boolean;
  tag: string;
  banglaTag?: string;
  tagColor: string;
  isCustomPricing?: boolean;
  /** Booked by WhatsApp inquiry instead of the enrollment form (e.g. One-to-One Sessions). */
  whatsappOnly?: boolean;
  /** Hidden from the site when false (admin panel). */
  published?: boolean;
  /** Pre-filled WhatsApp inquiry for whatsappOnly courses. */
  whatsappMessage?: { en: string; bn: string };
  priceNotice?: string;
}

export interface ComboOffer {
  id: string;
  title: string;
  banglaTitle: string;
  courses: string[];
  combinedFee: number;
  regularValue?: number;
  eligibility: string;
  eligibilityBangla: string;
  description: string;
  banglaDescription?: string;
  badge?: string;
  banglaBadge?: string;
  published?: boolean;
}


export interface Testimonial {
  id: string;
  name: string;
  studentName?: string;
  profession?: string;
  professionRole?: string;
  banglaProfessionRole?: string;
  location: string;
  banglaLocation?: string;
  targetCountry?: 'Canada' | 'France' | 'General';
  countryPath?: string;
  achievement?: string;
  examPassed?: string;
  score?: string;
  banglaScore?: string;
  /** Bangla version of the exam/course/achievement tag shown on the card */
  banglaTag?: string;
  course?: string;
  quote: string;
  reviewText?: string;
  banglaQuote?: string;
  avatar?: string;
  photoUrl?: string;
  rating?: number;
  displayOrder?: number;
  published?: boolean;
  year?: string;
  videoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQItem {
  id: string;
  category: 'General' | 'Classes' | 'Payment' | 'Exams' | 'Immigration';
  question: string;
  banglaQuestion: string;
  answer: string;
  banglaAnswer: string;
}

export type DayKey = 'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri';

export interface BatchSchedule {
  id: string;
  /** Course id this batch is for, or 'any' when it serves every course. */
  courseId: string;
  batchName: string;
  banglaBatchName?: string;
  days: string;
  banglaDays?: string;
  dayKeys: DayKey[];
  timeSlot: string;
  banglaTimeSlot?: string;
  type: 'Morning' | 'Evening' | 'Night';
  /** Optional: only shown when an admin sets them. */
  seatsTotal?: number;
  seatsTaken?: number;
  startDate?: string;
  status: 'Open' | 'Filling Fast' | 'Almost Full' | 'Closed';
}

export type Approval = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  role?: 'superAdmin' | 'admin' | 'instructor' | 'student';
  status?: 'Active' | 'Suspended' | 'Pending';
  /** Admin approval of new accounts. Missing = approved (accounts created before approval existed). */
  approval?: Approval;
  locale?: 'en' | 'bn';
  lastLoginAt?: string;
  authProvider?: string;
  targetGoal?: string;
  currentFrenchLevel?: string;
  preferredBatchTime?: string;
  bio?: string;
  crsScore?: number | null;
  enrolledCourses?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  banglaTitle?: string;
  duration: string;
  videoUrl?: string;
  pdfUrl?: string;
  summary?: string;
  order: number;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  banglaTitle?: string;
  order: number;
  lessons: Lesson[];
}

export interface EnrollmentRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  courseId: string;
  courseTitle: string;
  batchSchedule: string;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Verified' | 'Failed';
  transactionId?: string;
  enrolledAt: string;
}

export interface CertificateRecord {
  id: string;
  certificateNumber: string;
  userId: string;
  userName: string;
  courseTitle: string;
  cefrLevel: string;
  issueDate: string;
}

export interface Announcement {
  id: string;
  title: string;
  banglaTitle?: string;
  content: string;
  banglaContent?: string;
  category: 'General' | 'Class Update' | 'Exam Notice' | 'System';
  createdAt: string;
  createdBy?: string;
}

export interface AuditLog {
  id: string;
  actorUid: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  targetResource: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface RecordedLesson {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  banglaTitle?: string;
  duration: string;
  videoUrl: string;
  pdfUrl?: string;
  summary?: string;
  banglaSummary?: string;
  isPreview?: boolean;
  order: number;
}

export interface RecordedModule {
  id: string;
  courseId: string;
  title: string;
  banglaTitle?: string;
  order: number;
  lessons: RecordedLesson[];
}

export interface RecordedCourse {
  id: string;
  slug: string;
  title: string;
  banglaTitle: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'TEF' | 'TCF';
  regularPrice: number;
  offerPrice: number;
  thumbnail: string;
  description: string;
  banglaDescription: string;
  outcomes: string[];
  banglaOutcomes?: string[];
  features: string[];
  banglaFeatures?: string[];
  targetAudience: string;
  banglaTargetAudience?: string;
  totalHours: string;
  banglaTotalHours?: string;
  totalLessons: number;
  totalModules: number;
  hasCertificate: boolean;
  published: boolean;
  modules?: RecordedModule[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CoursePayment {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  courseId: string;
  courseTitle: string;
  courseType: 'recorded' | 'live';
  amount: number;
  paymentMethod: 'bkash' | 'nagad' | 'bank';
  senderPhone: string;
  trxId: string;
  notes?: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

export interface UserCourseProgress {
  id?: string;
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  lastWatchedLessonId?: string;
  lastWatchedAt?: string;
  progressPercentage: number;
  updatedAt?: string;
}


