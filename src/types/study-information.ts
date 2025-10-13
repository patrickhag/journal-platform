export interface StudyInformation {
  funded: boolean;
  informedConsent: boolean;
  ethicalClearance: boolean;
  humanParticipation: boolean;
  ethicalReference?: string;
  founders?: string;
}

export interface StudyQuestion {
  id: string;
  question: string;
  answer: boolean;
  required: boolean;
  description: string;
}

export interface ComplianceStatus {
  status: 'compliant' | 'non-compliant';
  message: string;
  icon: React.ReactNode;
}
