import { BatchSchedule } from '../types';

/**
 * Default live batches, from the official course flyer:
 * Friday & Sunday or Saturday & Monday, 07:00–09:00 PM or 09:00–11:00 PM (BST).
 * Admins can override these from the dashboard (Firestore `batches` collection).
 * Seat counts are optional and hidden unless an admin sets them.
 */
export const BATCH_SCHEDULES: BatchSchedule[] = [
  {
    id: 'batch-fs-7pm',
    courseId: 'any',
    batchName: 'Friday & Sunday · Early Evening',
    banglaBatchName: 'শুক্রবার ও রবিবার · সন্ধ্যা',
    days: 'Friday & Sunday',
    banglaDays: 'শুক্রবার ও রবিবার',
    dayKeys: ['fri', 'sun'],
    timeSlot: '07:00 PM – 09:00 PM (BST)',
    type: 'Evening',
    status: 'Open',
  },
  {
    id: 'batch-fs-9pm',
    courseId: 'any',
    batchName: 'Friday & Sunday · Late Evening',
    banglaBatchName: 'শুক্রবার ও রবিবার · রাত',
    days: 'Friday & Sunday',
    banglaDays: 'শুক্রবার ও রবিবার',
    dayKeys: ['fri', 'sun'],
    timeSlot: '09:00 PM – 11:00 PM (BST)',
    type: 'Night',
    status: 'Open',
  },
  {
    id: 'batch-sm-7pm',
    courseId: 'any',
    batchName: 'Saturday & Monday · Early Evening',
    banglaBatchName: 'শনিবার ও সোমবার · সন্ধ্যা',
    days: 'Saturday & Monday',
    banglaDays: 'শনিবার ও সোমবার',
    dayKeys: ['sat', 'mon'],
    timeSlot: '07:00 PM – 09:00 PM (BST)',
    type: 'Evening',
    status: 'Open',
  },
  {
    id: 'batch-sm-9pm',
    courseId: 'any',
    batchName: 'Saturday & Monday · Late Evening',
    banglaBatchName: 'শনিবার ও সোমবার · রাত',
    days: 'Saturday & Monday',
    banglaDays: 'শনিবার ও সোমবার',
    dayKeys: ['sat', 'mon'],
    timeSlot: '09:00 PM – 11:00 PM (BST)',
    type: 'Night',
    status: 'Open',
  },
];
