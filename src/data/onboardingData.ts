import { OnboardingStep, Document, Training } from '../types/onboarding';

export const onboardingSteps: OnboardingStep[] = [
  {
    id: '1',
    title: 'Welcome & Introduction',
    description: 'Complete your welcome orientation and company overview',
    completed: true,
    required: true,
    category: 'personal'
  },
  {
    id: '2',
    title: 'Personal Information',
    description: 'Update your personal details and emergency contacts',
    completed: true,
    required: true,
    category: 'personal'
  },
  {
    id: '3',
    title: 'Document Upload',
    description: 'Upload required identification and employment documents',
    completed: false,
    required: true,
    category: 'compliance'
  },
  {
    id: '4',
    title: 'IT Setup',
    description: 'Configure your accounts, passwords, and system access',
    completed: false,
    required: true,
    category: 'system'
  },
  {
    id: '5',
    title: 'Training Modules',
    description: 'Complete mandatory training courses and certifications',
    completed: false,
    required: true,
    category: 'professional'
  },
  {
    id: '6',
    title: 'Department Introduction',
    description: 'Meet your team and understand your role responsibilities',
    completed: false,
    required: true,
    category: 'professional'
  },
  {
    id: '7',
    title: 'Benefits Enrollment',
    description: 'Select your health, dental, and retirement benefits',
    completed: false,
    required: true,
    category: 'compliance'
  },
  {
    id: '8',
    title: 'Final Review',
    description: 'Review all information and complete onboarding process',
    completed: false,
    required: true,
    category: 'compliance'
  }
];

export const requiredDocuments: Document[] = [
  {
    id: '1',
    name: 'Government ID (Driver\'s License/Passport)',
    type: 'image',
    uploaded: false,
    required: true,
    category: 'identity'
  },
  {
    id: '2',
    name: 'Social Security Card',
    type: 'image',
    uploaded: false,
    required: true,
    category: 'identity'
  },
  {
    id: '3',
    name: 'Educational Certificates',
    type: 'pdf',
    uploaded: false,
    required: true,
    category: 'education'
  },
  {
    id: '4',
    name: 'Previous Employment Records',
    type: 'pdf',
    uploaded: false,
    required: false,
    category: 'employment'
  },
  {
    id: '5',
    name: 'Bank Account Details',
    type: 'pdf',
    uploaded: false,
    required: true,
    category: 'compliance'
  },
  {
    id: '6',
    name: 'Emergency Contact Information',
    type: 'doc',
    uploaded: false,
    required: true,
    category: 'compliance'
  }
];

export const trainingModules: Training[] = [
  {
    id: '1',
    title: 'Workplace Safety & Security',
    description: 'Essential safety protocols and emergency procedures',
    duration: '45 minutes',
    completed: false,
    required: true,
    dueDate: '2025-01-20',
    category: 'safety'
  },
  {
    id: '2',
    title: 'Data Privacy & Compliance',
    description: 'GDPR, data handling, and privacy regulations',
    duration: '30 minutes',
    completed: false,
    required: true,
    dueDate: '2025-01-18',
    category: 'compliance'
  },
  {
    id: '3',
    title: 'Company Culture & Values',
    description: 'Understanding our mission, vision, and core values',
    duration: '25 minutes',
    completed: false,
    required: true,
    dueDate: '2025-01-15',
    category: 'orientation'
  },
  {
    id: '4',
    title: 'Technical Systems Overview',
    description: 'Introduction to company software and tools',
    duration: '60 minutes',
    completed: false,
    required: true,
    dueDate: '2025-01-22',
    category: 'technical'
  },
  {
    id: '5',
    title: 'Anti-Harassment & Diversity',
    description: 'Workplace conduct and inclusive environment training',
    duration: '40 minutes',
    completed: false,
    required: true,
    dueDate: '2025-01-17',
    category: 'compliance'
  }
];