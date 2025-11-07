import { Partner, SpocMapping, BrandChannelMapping, AdminAnalytics, BOSTask, PricingTask } from '../types/partner';

export const samplePartners: Partner[] = [
  {
    id: 'P001',
    ownerName: 'John Smith',
    firmName: 'TechCorp Solutions',
    email: 'john@techcorp.com',
    mobile: '+1-555-0123',
    country: 'USA',
    brand: 'Apple',
    business: 'Sales',
    uncodedSpocId: 'SPOC001',
    address: '123 Business Ave',
    city: 'New York',
    pinCode: '10001',
    landmark: 'Near Central Park',
    state: 'NY',
    taxId: '12-3456789',
    taxIdType: 'TIN',
    paymentModes: ['PAYG'],
    paymentModeDetails: {
      payg: {
        type: 'single'
      }
    },
    paymentModeDetails: {
      payg: {
        type: 'single'
      }
    },
    invoicingFrequency: 'monthly',
    invoicingType: 'consolidated',
    brandChannel: 'Premium Retail',
    brandChannel: 'Premium Retail',
    status: 'user-creation',
    createdAt: '2025-01-01T10:00:00Z',
    milestones: [
      {
        id: 'M1',
        name: 'Registration',
        status: 'completed',
        startedAt: '2025-01-01T10:00:00Z',
        completedAt: '2025-01-01T10:30:00Z',
        duration: 30
      },
      {
        id: 'M2',
        name: 'In Review',
        status: 'completed',
        startedAt: '2025-01-01T10:30:00Z',
        completedAt: '2025-01-02T14:00:00Z',
        duration: 1650
      },
      {
        id: 'M3',
        name: 'User Creation',
        status: 'in-progress',
        startedAt: '2025-01-02T14:00:00Z'
      },
      {
        id: 'M4',
        name: 'You\'re now Live',
        status: 'pending'
      },
      {
        id: 'M4',
        name: 'You\'re now Live',
        status: 'pending'
      }
    ],
    locations: [
      {
        id: 'L001',
        partnerId: 'P001',
        name: 'Head Office',
        address: '123 Business Ave',
        city: 'New York',
        pinCode: '10001',
        landmark: 'Near Central Park',
        state: 'NY',
        taxId: '12-3456789',
        brandLocationCode: 'APL-NYC-001',
        brandLocationCode: 'APL-NYC-001',
        isHeadOffice: true,
        createdAt: '2025-01-01T10:00:00Z'
      }
    ],
    users: []
  },
  {
    id: 'P002',
    ownerName: 'Sarah Johnson',
    firmName: 'Retail Plus',
    email: 'sarah@retailplus.com',
    mobile: '+91-9876543210',
    country: 'India',
    brand: 'Samsung',
    business: 'Exchange',
    uncodedSpocId: 'SPOC002',
    address: '456 Market Street',
    city: 'Mumbai',
    pinCode: '400001',
    landmark: 'Near Gateway of India',
    state: 'Maharashtra',
    taxId: 'ABCDE1234F',
    taxIdType: 'PAN',
    gstin: '27ABCDE1234F1Z5',
    gstin: '27ABCDE1234F1Z5',
    paymentModes: ['PAYG'],
    paymentModeDetails: {
      payg: {
        type: 'multi-store',
        multiStoreEmail: 'multistore@retailplus.com'
      }
    },
    paymentModeDetails: {
      payg: {
        type: 'multi-store',
        multiStoreEmail: 'multistore@retailplus.com'
      }
    },
    invoicingFrequency: 'weekly',
    invoicingType: 'statewise',
    bankingDetails: {
      accountHolderName: 'Retail Plus Pvt Ltd',
      accountNumber: '1234567890',
      bankName: 'HDFC Bank',
      ifscCode: 'HDFC0001234',
      isVerified: true
    },
    status: 'bos-processing',
    createdAt: '2025-01-02T09:00:00Z',
    milestones: [
      {
        id: 'M1',
        name: 'Registration',
        status: 'in-progress',
        startedAt: '2025-01-02T09:00:00Z',
        completedAt: '2025-01-02T09:45:00Z',
        duration: 45
      },
      {
        id: 'M2',
        name: 'In Review',
        status: 'in-progress',
        startedAt: '2025-01-02T09:45:00Z'
      },
      {
        id: 'M3',
        name: 'User Creation',
        status: 'pending'
      },
      {
        id: 'M4',
        name: 'You\'re now Live',
        status: 'pending'
      },
      {
        id: 'M4',
        name: 'You\'re now Live',
        status: 'pending'
      }
    ],
    locations: [
      {
        id: 'L002',
        partnerId: 'P002',
        name: 'Head Office',
        address: '456 Market Street',
        city: 'Mumbai',
        pinCode: '400001',
        landmark: 'Near Gateway of India',
        state: 'Maharashtra',
        taxId: 'ABCDE1234F',
        brandLocationCode: 'SAM-MUM-001',
        brandLocationCode: 'SAM-MUM-001',
        isHeadOffice: true,
        createdAt: '2025-01-02T09:00:00Z'
      }
    ],
    users: []
  }
]

export const spocMappings: SpocMapping[] = [
  { spocId: 'SPOC001', name: 'Alice Cooper', email: 'alice@uncoded.com' },
  { spocId: 'SPOC002', name: 'Bob Wilson', email: 'bob@uncoded.com' },
  { spocId: 'SPOC003', name: 'Carol Davis', email: 'carol@uncoded.com' }
];

export const brandChannelMappings: BrandChannelMapping[] = [
  { numericValue: 1, brandChannel: 'Premium Retail' },
  { numericValue: 2, brandChannel: 'Mass Market' },
  { numericValue: 3, brandChannel: 'Online Channel' },
  { numericValue: 4, brandChannel: 'Exchange Program' }
];

export const adminAnalytics: AdminAnalytics = {
  totalPartners: 25,
  completedOnboardings: 18,
  averageOnboardingDuration: 2.5,
  supportButtonUsage: 47,
  conversionRate: 72,
  milestoneAnalytics: {
    registration: { average: 35, count: 25 },
    review: { average: 1440, count: 23 },
    userCreation: { average: 120, count: 18 }
  }
};

export const bosTasks: BOSTask[] = [
  {
    id: 'BOS001',
    partnerId: 'P002',
    partnerDetails: samplePartners[1],
    status: 'pending',
    assignedAt: '2025-01-02T10:00:00Z'
  }
];

export const pricingTasks: PricingTask[] = [
  {
    id: 'PRICE001',
    partnerId: 'P001',
    partnerDetails: samplePartners[0],
    status: 'completed',
    marginConfigured: true,
    assignedAt: '2025-01-01T15:00:00Z',
    completedAt: '2025-01-02T11:00:00Z'
  }
];