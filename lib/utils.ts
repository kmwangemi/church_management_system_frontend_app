import type { APIError, FastAPIValidationError } from '@/lib/types';
import { type ClassValue, clsx } from 'clsx';
import { formatDate, formatDistanceToNowStrict } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FormatToNewDate = (date: Date | number) => string;

export const formatToNewDate: FormatToNewDate = (date) => {
  if (!date) return '';
  return formatDate(date, 'dd/MM/yyyy');
};

export const getRelativeYear = (offset: number) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + offset);
  return date;
};

export function formatRelativeDate(createdAt: Date): string {
  const currentDate: Date = new Date();
  const oneYearInMs: number = 365 * 24 * 60 * 60 * 1000; // One year in milliseconds
  if (currentDate.getTime() - createdAt.getTime() <= oneYearInMs) {
    // Return relative time if difference is less than or equal to 1 year
    return formatDistanceToNowStrict(createdAt, { addSuffix: true });
  }
  // Return full date with year if difference is more than 1 year
  return formatDate(createdAt, 'MMM d, yyyy');
}

export const getError = (err: APIError | any): string => {
  try {
    const responseData = err?.response?.data;
    // Handle FastAPI validation errors (array of validation errors)
    if (Array.isArray(responseData?.detail)) {
      return responseData.detail
        .map((e: FastAPIValidationError) => {
          // Better field name extraction with fallbacks
          const field = e.loc?.[1] || e.loc?.[0] || 'field';
          const message = e.msg || 'Invalid value';
          return `${field}: ${message}`;
        })
        .join(', ');
    }
    // Handle FastAPI string detail errors
    if (typeof responseData?.detail === 'string') {
      return responseData.detail;
    }
    // Handle custom API errors with message field
    if (responseData?.message) {
      return responseData.message;
    }
    // Handle custom API errors with error field
    if (responseData?.error) {
      return responseData.error;
    }
    // Handle HTTP status errors with meaningful messages
    if (err?.response?.status) {
      const status = err.response.status;
      const statusText = err.response.statusText || 'Error';
      switch (status) {
        case 400:
          return 'Bad request. Please check your input.';
        case 401:
          return 'Unauthorized. Please log in again.';
        case 403:
          return "Access denied. You don't have permission.";
        case 404:
          return 'Resource not found.';
        case 422:
          return 'Validation error. Please check your input.';
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
          return 'Internal server error. Please try again.';
        case 502:
          return 'Bad gateway. Service temporarily unavailable.';
        case 503:
          return 'Service unavailable. Please try again later.';
        default:
          return `${status}: ${statusText}`;
      }
    }
    // Fallback to standard error message
    if (err?.message) {
      return err.message;
    }
    // Final fallback
    return 'An unexpected error occurred. Please try again.';
  } catch (_parseError) {
    // If error parsing fails, return a safe fallback
    // console.error('Error parsing error object:', parseError);
    return 'An unexpected error occurred. Please try again.';
  }
};

export const capitalizeFirstLetter = (str: string) => {
  if (typeof str !== 'string' || str.length === 0) {
    return '';
  }
  const trimmed = str.trim();
  if (trimmed.toUpperCase() === 'N/A') return 'N/A';
  if (trimmed.toLowerCase() === 'not provided') return 'Not Provided';
  return str.charAt(0).toUpperCase() + str.substring(1);
};

export const getFirstLetter = (str: string) => {
  if (typeof str !== 'string' || str.length === 0) return '';
  return str.charAt(0).toLocaleUpperCase();
};

export function capitalizeFirstLetterOfEachWord(str: string) {
  if (typeof str !== 'string' || str.length === 0) return '';
  const trimmed = str.trim();
  if (trimmed.toUpperCase() === 'N/A') return 'N/A';
  if (trimmed.toLowerCase() === 'not provided') return 'Not Provided';
  const words = str.split(' ');
  for (let i = 0; i < words.length; i++) {
    if (words[i].toUpperCase() === 'N/A') {
      words[i] = 'N/A';
    } else {
      words[i] =
        words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
    }
  }
  return words.join(' ');
}

export const formatCurrency = (amount?: number | string | null, currency = 'KES'): string => {
  if (amount === undefined || amount === null) return `${currency} 0`;
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return `${currency} 0`;
  return `${currency} ${num.toLocaleString()}`;
};

export const addCommasToNumber = (input: string | number): string => {
  // Convert the input to a number if it's a string
  const number: number =
    typeof input === 'string' ? Number.parseFloat(input) : Number(input);
  // Check if the conversion was successful
  if (Number.isNaN(number)) {
    return '0';
  }
  // Convert the number to a string
  let numberString: string = number.toString();
  // Handle negative numbers
  let isNegative = false;
  if (number < 0) {
    isNegative = true;
    numberString = numberString.slice(1); // Remove the negative sign for processing
  }
  // Use a regular expression to add commas to the string
  numberString = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  // Add back the negative sign if needed
  if (isNegative) {
    numberString = `-${numberString}`;
  }
  return numberString;
};
export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }
  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }
  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
export const stringToBool = (str: string): boolean => {
  return str.toLowerCase() === 'true';
};

export const formatNotificationCount = (count: number) => {
  // You can customize the threshold as needed
  const threshold = 99;
  if (count > threshold) {
    return `${threshold}+`;
  }
  return count.toString();
};

export const splitFullName = (
  fullName?: string
): { firstName: string; lastName: string } => {
  if (!fullName) return { firstName: '', lastName: '' };
  // biome-ignore lint/performance/useTopLevelRegex: ignore
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = parts.length > 1 ? parts.slice(-1).join(' ') : '';
  return { firstName, lastName };
};

export const CHURCH_POSITION_OPTIONS = [
  { value: 'bishop', label: 'Bishop' },
  { value: 'senior-pastor', label: 'Senior Pastor' },
  { value: 'pastor', label: 'Pastor' },
  { value: 'reverent', label: 'Reverend' },
  { value: 'elder', label: 'Elder' },
  { value: 'deacon', label: 'Deacon' },
  { value: 'church-administrator', label: 'Church Administrator' },
  { value: 'treasurer', label: 'Treasurer' },
  { value: 'secretary', label: 'Secretary' },
  { value: 'department-leader', label: 'Department / Ministry Leader' },
  { value: 'member', label: 'Member' },
  { value: 'visitor', label: 'Visitor' },
];

export const CHURCH_ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Admin (Full System Access)' },
  { value: 'STAFF', label: 'Staff (Ministry & Operations)' },
  { value: 'VOLUNTEER', label: 'Volunteer (Ministry Servant)' },
  { value: 'MEMBER', label: 'Member (Congregant)' },
  { value: 'VISITOR', label: 'Visitor (Guest)' },
];

// Smart automatic role defaults based on church position
export const getDefaultRolesForPosition = (
  position?: string
): ('ADMIN' | 'STAFF' | 'MEMBER' | 'VOLUNTEER' | 'VISITOR')[] => {
  if (!position) return ['MEMBER'];
  const pos = position.toLowerCase();
  switch (pos) {
    case 'church-administrator':
    case 'administrator':
    case 'admin':
      return ['ADMIN'];
    case 'senior-pastor':
    case 'bishop':
    case 'reverent':
    case 'pastor':
      return ['STAFF', 'ADMIN'];
    case 'treasurer':
    case 'secretary':
      return ['STAFF'];
    case 'elder':
    case 'deacon':
    case 'department-leader':
      return ['MEMBER', 'VOLUNTEER'];
    case 'visitor':
      return ['VISITOR'];
    case 'member':
    default:
      return ['MEMBER'];
  }
};

// Staffs are paid while volunteers are not paid
// Staffs are employed volunteers are not employed
// This are system roles & permissions
export const CHURCH_ROLE_BY_POSITION: Record<
  string,
  { value: string; label: string }[]
> = {
  bishop: [
    { value: 'ADMIN', label: 'Admin (Full System Access)' },
    { value: 'STAFF', label: 'Staff (Ministry & Operations)' },
    { value: 'MEMBER', label: 'Member (Congregant)' },
    { value: 'VOLUNTEER', label: 'Volunteer (Ministry Servant)' },
  ],
  'senior-pastor': [
    { value: 'ADMIN', label: 'Admin (Full System Access)' },
    { value: 'STAFF', label: 'Staff (Ministry & Operations)' },
    { value: 'MEMBER', label: 'Member (Congregant)' },
    { value: 'VOLUNTEER', label: 'Volunteer (Ministry Servant)' },
  ],
  reverent: [
    { value: 'ADMIN', label: 'Admin (Full System Access)' },
    { value: 'STAFF', label: 'Staff (Ministry & Operations)' },
    { value: 'MEMBER', label: 'Member (Congregant)' },
    { value: 'VOLUNTEER', label: 'Volunteer (Ministry Servant)' },
  ],
  pastor: [
    { value: 'ADMIN', label: 'Admin (Full System Access)' },
    { value: 'STAFF', label: 'Staff (Ministry & Operations)' },
    { value: 'MEMBER', label: 'Member (Congregant)' },
    { value: 'VOLUNTEER', label: 'Volunteer (Ministry Servant)' },
  ],
  elder: [
    { value: 'ADMIN', label: 'Admin (Full System Access)' },
    { value: 'STAFF', label: 'Staff (Ministry & Operations)' },
    { value: 'MEMBER', label: 'Member (Congregant)' },
    { value: 'VOLUNTEER', label: 'Volunteer (Ministry Servant)' },
  ],
  deacon: [
    { value: 'ADMIN', label: 'Admin (Full System Access)' },
    { value: 'STAFF', label: 'Staff (Ministry & Operations)' },
    { value: 'MEMBER', label: 'Member (Congregant)' },
    { value: 'VOLUNTEER', label: 'Volunteer (Ministry Servant)' },
  ],
  'church-administrator': [
    { value: 'ADMIN', label: 'Admin (Full System Access)' },
    { value: 'STAFF', label: 'Staff (Ministry & Operations)' },
    { value: 'MEMBER', label: 'Member (Congregant)' },
    { value: 'VOLUNTEER', label: 'Volunteer (Ministry Servant)' },
  ],
  treasurer: [
    { value: 'ADMIN', label: 'Admin (Full System Access)' },
    { value: 'STAFF', label: 'Staff (Ministry & Operations)' },
    { value: 'MEMBER', label: 'Member (Congregant)' },
    { value: 'VOLUNTEER', label: 'Volunteer (Ministry Servant)' },
  ],
  secretary: [
    { value: 'ADMIN', label: 'Admin (Full System Access)' },
    { value: 'STAFF', label: 'Staff (Ministry & Operations)' },
    { value: 'MEMBER', label: 'Member (Congregant)' },
    { value: 'VOLUNTEER', label: 'Volunteer (Ministry Servant)' },
  ],
  'department-leader': [
    { value: 'ADMIN', label: 'Admin (Full System Access)' },
    { value: 'STAFF', label: 'Staff (Ministry & Operations)' },
    { value: 'MEMBER', label: 'Member (Congregant)' },
    { value: 'VOLUNTEER', label: 'Volunteer (Ministry Servant)' },
  ],
  member: [
    { value: 'ADMIN', label: 'Admin (Full System Access)' },
    { value: 'STAFF', label: 'Staff (Ministry & Operations)' },
    { value: 'MEMBER', label: 'Member (Congregant)' },
    { value: 'VOLUNTEER', label: 'Volunteer (Ministry Servant)' },
  ],
  visitor: [
    { value: 'VISITOR', label: 'Visitor (Guest)' },
    { value: 'VOLUNTEER', label: 'Volunteer (Ministry Servant)' },
    { value: 'MEMBER', label: 'Member (Congregant)' },
  ],
};

export const getRolesForPosition = (position?: string) => {
  if (!position) return CHURCH_ROLE_OPTIONS;
  return CHURCH_ROLE_BY_POSITION[position] || CHURCH_ROLE_OPTIONS;
};

export type SystemAccessLevel = 'NONE' | 'PORTAL' | 'STAFF' | 'ADMIN';
export type MinistryTag = 'Member' | 'Volunteer' | 'Staff';

export interface SystemAccessLevelOption {
  value: SystemAccessLevel;
  label: string;
  description: string;
  badge: string;
}

export const SYSTEM_ACCESS_LEVEL_OPTIONS: SystemAccessLevelOption[] = [
  {
    value: 'NONE',
    label: 'None',
    description: 'No system login. Stored for church directory and records only.',
    badge: 'Directory Only',
  },
  {
    value: 'PORTAL',
    label: 'Member Portal',
    description: 'Self-service login for giving, events, directory & profile.',
    badge: 'Member Login',
  },
  {
    value: 'STAFF',
    label: 'Staff / Operations',
    description: 'Management access for ministries, records, attendance & events.',
    badge: 'Ministry Staff',
  },
  {
    value: 'ADMIN',
    label: 'Administrator',
    description: 'Full administrative access to settings, finances, users & system.',
    badge: 'Full Access',
  },
];

export interface MinistryTagOption {
  value: MinistryTag;
  label: string;
  description: string;
}

export const MINISTRY_TAG_OPTIONS: MinistryTagOption[] = [
  {
    value: 'Member',
    label: 'Church Member',
    description: 'Active congregant in the local church family.',
  },
  {
    value: 'Volunteer',
    label: 'Ministry Volunteer',
    description: 'Unpaid servant serving in departments or church teams.',
  },
  {
    value: 'Staff',
    label: 'Employed / Key Staff',
    description: 'Employed personnel or official church ministry staff.',
  },
];

export const getDefaultsForPosition = (
  position?: string
): { accessLevel: SystemAccessLevel; tags: MinistryTag[] } => {
  if (!position) {
    return { accessLevel: 'NONE', tags: ['Member'] };
  }
  const pos = position.toLowerCase();
  switch (pos) {
    case 'church-administrator':
    case 'administrator':
    case 'admin':
      return { accessLevel: 'ADMIN', tags: ['Staff'] };
    case 'senior-pastor':
    case 'bishop':
    case 'reverent':
    case 'pastor':
      return { accessLevel: 'STAFF', tags: ['Staff', 'Member'] };
    case 'treasurer':
    case 'secretary':
      return { accessLevel: 'STAFF', tags: ['Staff'] };
    case 'elder':
    case 'deacon':
    case 'department-leader':
      return { accessLevel: 'NONE', tags: ['Member', 'Volunteer'] };
    case 'visitor':
      return { accessLevel: 'NONE', tags: [] };
    case 'member':
    default:
      return { accessLevel: 'NONE', tags: ['Member'] };
  }
};

export const mapAccessAndTagsToRoles = (
  accessLevel: SystemAccessLevel = 'NONE',
  tags: (MinistryTag | string)[] = [],
  position?: string
): ('ADMIN' | 'STAFF' | 'MEMBER' | 'VOLUNTEER' | 'VISITOR')[] => {
  const hasStaffTag = tags.includes('Staff');
  const hasVolunteerTag = tags.includes('Volunteer');
  const hasMemberTag = tags.includes('Member');

  if (accessLevel === 'ADMIN') {
    if (hasStaffTag) return ['ADMIN', 'STAFF'];
    return ['ADMIN'];
  }

  if (accessLevel === 'STAFF') {
    if (hasVolunteerTag) return ['STAFF', 'VOLUNTEER'];
    if (hasMemberTag) return ['STAFF', 'MEMBER'];
    return ['STAFF'];
  }

  if (accessLevel === 'PORTAL') {
    if (hasVolunteerTag) return ['MEMBER', 'VOLUNTEER'];
    return ['MEMBER'];
  }

  // accessLevel === 'NONE'
  if (position?.toLowerCase() === 'visitor') {
    return ['VISITOR'];
  }
  if (hasVolunteerTag && hasMemberTag) {
    return ['MEMBER', 'VOLUNTEER'];
  }
  if (hasVolunteerTag) {
    return ['VOLUNTEER'];
  }
  return ['MEMBER'];
};

export const mapRolesToAccessAndTags = (
  roles: string[] = [],
  position?: string
): { accessLevel: SystemAccessLevel; tags: MinistryTag[] } => {
  const upperRoles = (roles || []).map((r) => r.toUpperCase());
  let accessLevel: SystemAccessLevel = 'NONE';

  if (upperRoles.includes('ADMIN') || upperRoles.includes('OWNER')) {
    accessLevel = 'ADMIN';
  } else if (upperRoles.includes('STAFF')) {
    accessLevel = 'STAFF';
  } else if (upperRoles.includes('MEMBER')) {
    accessLevel = 'PORTAL';
  } else {
    accessLevel = 'NONE';
  }

  const tags: MinistryTag[] = [];
  if (upperRoles.includes('STAFF')) {
    tags.push('Staff');
  }
  if (upperRoles.includes('VOLUNTEER')) {
    tags.push('Volunteer');
  }
  if (upperRoles.includes('MEMBER')) {
    tags.push('Member');
  }

  if (tags.length === 0 && position?.toLowerCase() !== 'visitor') {
    tags.push('Member');
  }

  return { accessLevel, tags };
};

export const PRAYER_CATEGORY_OPTIONS = [
  { value: 'health', label: 'Health & Healing' },
  { value: 'family', label: 'Family & Relationships' },
  { value: 'career', label: 'Career & Work' },
  { value: 'financial', label: 'Financial' },
  { value: 'spiritual', label: 'Spiritual Growth' },
  { value: 'thanksgiving', label: 'Thanksgiving & Praise' },
  { value: 'guidance', label: 'Guidance & Wisdom' },
  { value: 'other', label: 'Other' },
];

export const MILESTONE_CATEGORY_OPTIONS = [
  { value: 'spiritual', label: 'Spiritual' },
  { value: 'bible_study', label: 'Bible Study' },
  { value: 'prayer', label: 'Prayer' },
  { value: 'service', label: 'Service' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'evangelism', label: 'Evangelism' },
  { value: 'fellowship', label: 'Fellowship' },
  { value: 'worship', label: 'Worship' },
  { value: 'discipleship', label: 'Discipleship' },
];

export const DISCIPLE_LEVEL_OPTIONS = [
  { value: 'new-convert', label: 'New Convert' },
  { value: 'growing', label: 'Growing' },
  { value: 'mature', label: 'Mature' },
  { value: 'leader', label: 'Leader' },
];

export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
];

export const MEMBER_TYPE_OPTIONS = [
  { value: 'MEMBER', label: 'Member' },
  { value: 'VISITOR', label: 'Visitor' },
  { value: 'CHILD', label: 'Child' },
];

export const HOUSEHOLD_ROLE_OPTIONS = [
  { value: 'HEAD', label: 'Head of Household' },
  { value: 'SPOUSE', label: 'Spouse' },
  { value: 'CHILD', label: 'Child / Dependent' },
  { value: 'OTHER', label: 'Other Family Member' },
];

export const MARITAL_STATUS_OPTIONS = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
];

export const CHURCH_DENOMINATION_OPTIONS = [
  { value: 'baptist', label: 'Baptist' },
  { value: 'methodist', label: 'Methodist' },
  { value: 'presbyterian', label: 'Presbyterian' },
  { value: 'pentecostal', label: 'Pentecostal' },
  { value: 'catholic', label: 'Catholic' },
  { value: 'lutheran', label: 'Lutheran' },
  { value: 'episcopal', label: 'Episcopal' },
  { value: 'assembly of God', label: 'Assembly of God' },
  { value: 'church of Christ', label: 'Church of Christ' },
  { value: 'non-denominational', label: 'Non-denominational' },
  { value: 'other', label: 'Other' },
];

export const NUMBER_OF_CHURCH_MEMBERS_OPTIONS = [
  { value: '1-50', label: '1-50 Members' },
  { value: '51-100', label: '51-100 Members' },
  { value: '101-250', label: '101-250 Members' },
  { value: '251-500', label: '251-500 Members' },
  { value: '501-1000', label: '501-1000 Members' },
  { value: '1000+', label: 'More than 1000 Members' },
];

export const SUBSCRIPTION_PLANS = [
  {
    value: 'BASIC',
    label: 'Basic - KES 2,999/Month',
    description: 'Up to 100 members, basic features',
  },
  {
    value: 'MINISTRY',
    label: 'Ministry - KES 4,999/Month',
    description: 'Up to 500 members, advanced features',
  },
  {
    value: 'CATHEDRAL',
    label: 'Cathedral - KES 9,999/Month',
    description: 'Unlimited members, all features',
  },
  {
    value: 'CUSTOM',
    label: 'Enterprise - Custom',
    description: 'Custom solution for large churches',
  },
];

export const MEETING_DAY_OPTIONS = [
  { value: 'sunday', label: 'Sunday' },
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
];

export const GROUP_CATEGORY_OPTIONS = [
  { value: 'bible-study', label: 'Bible Study' },
  { value: 'fellowship', label: 'Fellowship' },
  { value: 'prayer', label: 'Prayer' },
  { value: 'youth', label: 'Youth' },
  { value: 'children', label: 'Children' },
  { value: 'marriage', label: 'Marriage' },
  { value: 'worship', label: 'Worship' },
  { value: 'contribution', label: 'Contribution' },
  { value: 'others', label: 'Others' },
];

export const EVENT_TYPE_OPTIONS = [
  { value: 'service', label: 'Service' },
  { value: 'conference', label: 'Conference' },
  { value: 'study', label: 'Bible Study' },
  { value: 'outreach', label: 'Outreach' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'social', label: 'Social Event' },
  { value: 'training', label: 'Training' },
  { value: 'other', label: 'Other' },
];

export const EVENT_FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
];

export const PLEDGE_PURPOSE_OPTIONS = [
  { value: 'building-fund', label: 'Building Fund' },
  { value: 'mission-trip', label: 'Mission Trip' },
  { value: 'youth-program', label: 'Youth Program' },
  { value: 'equipment', label: 'Equipment Purchase' },
  { value: 'outreach', label: 'Community Outreach' },
  { value: 'education', label: 'Education Fund' },
  { value: 'other', label: 'Other' },
];

export const PLEDGE_FREQUENCY_OPTIONS = [
  { value: 'one-time', label: 'One-time Payment' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
];

export const CONTRIBUTION_TYPE_OPTIONS = [
  { value: 'tithe', label: 'Tithe' },
  { value: 'offering', label: 'Regular Offering' },
  { value: 'special-offering', label: 'Special Offering' },
  { value: 'building-fund', label: 'Building Fund' },
  { value: 'mission', label: 'Mission Fund' },
  { value: 'thanksgiving', label: 'Thanksgiving' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'donation', label: 'Donation' },
  { value: 'other', label: 'Other' },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'cash', label: 'Cash' },
  { value: 'm-pesa', label: 'M-Pesa' },
  { value: 'bank-transfer', label: 'Bank Transfer' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'check', label: 'Check' },
  { value: 'online', label: 'Online Payment' },
];

export const ASSET_TYPE_OPTIONS = [
  { value: 'vehicle', label: 'Vehicle' },
  { value: 'property', label: 'Property' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'technology', label: 'Technology' },
  { value: 'musical', label: 'Musical Instruments' },
  { value: 'computer', label: 'Computer' },
  { value: 'appliance', label: 'Appliance' },
  { value: 'building-material', label: 'Building Material' },
  { value: 'book', label: 'Book/Literature' },
  { value: 'other', label: 'Other' },
];

export const ASSET_CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' },
];

export const ASSET_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'disposed', label: 'Disposed' },
  { value: 'sold', label: 'Sold' },
  { value: 'donated', label: 'Donated' },
  { value: 'lost', label: 'Lost' },
  { value: 'stolen', label: 'Stolen' },
];

export const ASSET_MAINTENANCE_FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
];

export const ANNOUNCEMENT_CATEGORY_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'service', label: 'Service' },
  { value: 'prayer', label: 'Prayer' },
  { value: 'ministry', label: 'Ministry' },
  { value: 'children', label: 'Children' },
  { value: 'event', label: 'Event' },
  { value: 'youth', label: 'Youth' },
  { value: 'finance', label: 'Finance' },
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'emergency', label: 'Emergency' },
];

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const ANNOUNCEMENT_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Publish Now' },
  { value: 'scheduled', label: 'Schedule for Later' },
];

export const MESSAGE_SEND_TIME_OPTIONS = [
  { value: 'now', label: 'Send Now' },
  { value: 'scheduled', label: 'Schedule for Later' },
  { value: 'draft', label: 'Save as Draft' },
];

export const CONTENT_TYPE_OPTIONS = [
  { value: 'sermon', label: 'Sermon' },
  { value: 'bible_study', label: 'Bible Study' },
  { value: 'prayer', label: 'Prayer' },
  { value: 'worship', label: 'Worship' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'event', label: 'Event' },
  { value: 'devotional', label: 'Devotional' },
  { value: 'testimony', label: 'Testimony' },
  { value: 'music', label: 'Music' },
  { value: 'video', label: 'Video' },
  { value: 'document', label: 'Document' },
  { value: 'image', label: 'Image' },
  { value: 'audio', label: 'Audio' },
];

export const CONTENT_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
  { value: 'private', label: 'Private' },
];

export const CONTENT_CATEGORY_OPTIONS = [
  { value: 'spiritual', label: 'Spiritual' },
  { value: 'educational', label: 'Educational' },
  { value: 'administrative', label: 'Administrative' },
  { value: 'worship', label: 'Worship' },
  { value: 'youth', label: 'Youth' },
  { value: 'children', label: 'Children' },
  { value: 'missions', label: 'Missions' },
  { value: 'fellowship', label: 'Fellowship' },
  { value: 'outreach', label: 'Outreach' },
  { value: 'discipleship', label: 'Discipleship' },
];

export const REPORT_TYPE_OPTIONS = [
  { value: 'attendance', label: 'Attendance Report' },
  { value: 'financial', label: 'Financial Report' },
  { value: 'membership', label: 'Membership Report' },
  { value: 'events', label: 'Events Report' },
  { value: 'discipleship', label: 'Discipleship Report' },
  { value: 'custom', label: 'Custom Report' },
];

export const REPORT_OUTPUT_FORMAT_OPTIONS = [
  { value: 'pdf', label: 'PDF Document' },
  { value: 'excel', label: 'Excel Spreadsheet' },
  { value: 'csv', label: 'CSV File' },
  { value: 'powerpoint', label: 'PowerPoint Presentation' },
];

export const REPORT_DATE_RANGE_OPTIONS = [
  { value: 'last7days', label: 'Last Week' },
  { value: 'last30days', label: 'Last Month' },
  { value: 'last3months', label: 'Last Quarter' },
  { value: 'last6months', label: 'Last 6 Months' },
  { value: 'lastyear', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' },
];

export const ADMIN_ACCESS_LEVEL_OPTIONS = [
  { value: 'BRANCH', label: 'Branch' },
  { value: 'REGIONAL', label: 'Regional' },
  { value: 'NATIONAL', label: 'National' },
];

export const SUPERADMIN_ACCESS_LEVEL_OPTIONS = [
  { value: 'global', label: 'Global' },
  { value: 'system', label: 'System' },
];

export const REFERRAL_SOURCE_OPTIONS = [
  { value: 'friend', label: 'Friend' },
  { value: 'family', label: 'Family' },
  { value: 'online', label: 'Online' },
  { value: 'flyer', label: 'Flyer' },
  { value: 'other', label: 'Other' },
];

export const FOLLOW_UP_STATUS_OPTIONS = [
  { value: 'interested', label: 'Interested' },
  { value: 'not_interested', label: 'Not Interested' },
  { value: 'pending', label: 'Pending' },
];

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'full-time', label: 'Full-Time' },
  { value: 'part-time', label: 'Part-Time' },
  { value: 'contract', label: 'Contract' },
];

export const MEMBERSHIP_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'transferred', label: 'Transferred' },
  { value: 'deceased', label: 'Deceased' },
];

export const USER_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'pending', label: 'Pending' },
];

export const VOLUNTEER_STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'on_hold', label: 'On Hold' },
  { value: 'suspended', label: 'Suspended' },
];

export const ACTIVITY_STATUS_OPTIONS = [
  { label: 'Planned', value: 'planned' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Postponed', value: 'postponed' },
];

export const SERVICE_TYPE_OPTIONS = [
  { label: 'Worship', value: 'worship' },
  { label: 'Prayer', value: 'prayer' },
  { label: 'Bible Study', value: 'bible_study' },
  { label: 'Youth', value: 'youth' },
  { label: 'Children', value: 'children' },
  { label: 'Special', value: 'special' },
  { label: 'Fellowship', value: 'fellowship' },
];

export const DEPARTMENT_CATEGORY_OPTIONS = [
  { value: 'ministry', label: 'Ministry' },
  { value: 'administration', label: 'Administration' },
  { value: 'operations', label: 'Operations' },
  { value: 'education', label: 'Education' },
  { value: 'outreach', label: 'Outreach' },
  { value: 'support', label: 'Support' },
  { value: 'finance', label: 'Finance' },
  { value: 'facilities', label: 'Facilities' },
  { value: 'technology', label: 'Technology' },
  { value: 'communications', label: 'Communications' },
  { value: 'pastoral_care', label: 'Pastoral Care' },
  { value: 'missions', label: 'Missions' },
  { value: 'youth', label: 'Youth' },
  { value: 'children', label: 'Children' },
  { value: 'worship', label: 'Worship' },
  { value: 'discipleship', label: 'Discipleship' },
  { value: 'community', label: 'Community' },
  { value: 'events', label: 'Events' },
  { value: 'security', label: 'Security' },
  { value: 'volunteer_coordination', label: 'Volunteer Coordination' },
];

export const GROUP_DEPARTMENT_MEMBER_ROLE_OPTIONS = [
  { value: 'leader', label: 'Leader' },
  { value: 'assistant_leader', label: 'Assistant Leader' },
  { value: 'coordinator', label: 'Coordinator' },
  { value: 'member', label: 'Member' },
  { value: 'volunteer', label: 'Volunteer' },
];

export const EXPENSE_CATEGORY_OPTIONS = [
  { value: 'equipment', label: 'Equipment' },
  { value: 'materials', label: 'Materials' },
  { value: 'training', label: 'Training' },
  { value: 'events', label: 'Events' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'refreshments', label: 'Refreshments' },
  { value: 'miscellaneous', label: 'Miscellaneous' },
];

export const ACTIVITY_TYPE_OPTIONS = [
  { value: 'meeting', label: 'Meeting' },
  { value: 'event', label: 'Event' },
  { value: 'training', label: 'Training' },
  { value: 'planning', label: 'Planning' },
  { value: 'rehearsal', label: 'Rehearsal' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'outreach', label: 'Outreach' },
  { value: 'service', label: 'Service' },
  { value: 'program', label: 'Program' },
  { value: 'ministry', label: 'Ministry' },
  { value: 'social', label: 'Social' },
  { value: 'other', label: 'Other' },
];

export const GOAL_CATEGORY_OPTIONS = [
  { value: 'growth', label: 'Growth' },
  { value: 'training', label: 'Training' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'outreach', label: 'Outreach' },
  { value: 'quality', label: 'Quality' },
  { value: 'financial', label: 'Financial' },
  { value: 'other', label: 'Other' },
];

export const getUserId = (userId: any): string => {
  if (typeof userId === 'string') return userId;
  if (userId && typeof userId === 'object' && userId.toString) {
    return userId.toString();
  }
  if (Buffer.isBuffer(userId)) {
    return userId.toString('hex');
  }
  return 'unknown';
};

// File type configurations
export const FILE_CONFIGS = {
  image: {
    allowedTypes: /jpeg|jpg|png|gif|webp/i,
    allowedMimeTypes: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ],
    maxSize: 5 * 1024 * 1024, // 5MB
    folder: 'uploads/images',
    resourceType: 'image' as const,
  },
  document: {
    allowedTypes: /pdf|doc|docx/i,
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    maxSize: 10 * 1024 * 1024, // 10MB
    folder: 'uploads/documents',
    resourceType: 'raw' as const,
  },
  logo: {
    allowedTypes: /jpeg|jpg|png|svg/i,
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'],
    maxSize: 2 * 1024 * 1024, // 2MB
    folder: 'uploads/logos',
    resourceType: 'image' as const,
  },
};

// Helper function to calculate date range
export function calculateDateRange(
  dateRange: string,
  customStartDate?: string,
  customEndDate?: string
) {
  const now = new Date();
  let startDate: Date;
  let endDate: Date = now;
  switch (dateRange) {
    case 'last7days':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'last30days':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'last3months':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'last6months':
      startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      break;
    case 'lastyear':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    case 'custom':
      if (!(customStartDate && customEndDate)) {
        throw new Error('Custom start and end dates are required');
      }
      startDate = new Date(customStartDate);
      endDate = new Date(customEndDate);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  return { startDate, endDate };
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[\d\s\-()]+$/;
export const isEmail = (input: string): boolean => {
  return emailRegex.test(input);
};

export const isPhoneNumber = (input: string): boolean => {
  // Basic phone number validation - adjust regex based on your requirements
  return phoneRegex.test(input) && input.replace(/\D/g, '').length >= 10;
};

export const generateVerificationCode = (): string => {
  return Math.floor(100_000 + Math.random() * 900_000).toString();
};
