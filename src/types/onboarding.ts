export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  category: 'personal' | 'professional' | 'system' | 'compliance';
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  startDate: string;
  manager: string;
  employeeId: string;
  profileImage?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image';
  uploaded: boolean;
  required: boolean;
  uploadDate?: string;
  category: 'identity' | 'education' | 'employment' | 'compliance';
}

export interface Training {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  required: boolean;
  dueDate: string;
  category: 'safety' | 'compliance' | 'technical' | 'orientation';
}

export interface OnboardingProgress {
  totalSteps: number;
  completedSteps: number;
  percentage: number;
  currentPhase: 'welcome' | 'documentation' | 'training' | 'setup' | 'complete';
}