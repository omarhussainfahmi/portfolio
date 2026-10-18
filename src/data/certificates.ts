export interface Certificate {
  title: string;
  hours: number;
  year: number;
  category: string;
  credentialUrl?: string;
  credentialLabel?: string;
  credentialNote?: string;
}
export const certificates: Certificate[] = [
  {
    title: 'Udemy - Asp.Net Core 10 (.NET 10) | True Ultimate Guide Program',
    hours: 87,
    year: 2026,
    category: 'Development',
    credentialUrl: 'https://www.udemy.com/certificate/UC-aad41ab5-82f7-4395-a090-0cfc86ec9f80/',
  },
  {
    title: 'SAP Certified Associate - Project Learning & Enablement in SAP Projects Program',
    hours: 30,
    year: 2026,
    category: 'SAP',
  },
  {
    title: 'SAP Certified Associate - SAP Fiori Application Development Program',
    hours: 32,
    year: 2026,
    category: 'SAP',
  },
  {
    title: 'SAP Certified Associate - ABAP Cloud Back-End Development Program',
    hours: 69,
    year: 2026,
    category: 'SAP',
  },
  {
    title: 'Amazon Web Service (AWS) - Academy Cloud Foundations Program',
    hours: 20,
    year: 2025,
    category: 'Cloud',
    credentialUrl: 'https://www.credly.com/badges/8d67a740-6611-4c60-8a4c-dd4fed672600/print',
  },
  {
    title: 'The Hope International Company - UI/UX Design Program',
    hours: 32,
    year: 2025,
    category: 'Design',
    credentialUrl: 'https://www.credential.net/c648b458-7494-4da5-b556-c5e6b535d500#acc.AbSNBPJI',
  },
  {
    title: 'Udemy - The Ultimate MySQL Bootcamp: Go from SQL Beginner to Expert Program',
    hours: 18,
    year: 2024,
    category: 'Development',
    credentialUrl: 'https://www.udemy.com/certificate/UC-7fdef9d1-acec-46fc-9ee1-64f97da9eb29/',
  },
  {
    title: 'The Hope International Company - Game Development Program',
    hours: 30,
    year: 2023,
    category: 'Development',
    credentialUrl: 'https://www.credential.net/24d4de1f-de84-4971-bb2c-42cd65e200b4#acc.DrlgwuQq',
  },
  {
    title: 'The Hope International Company - Flutter Program',
    hours: 32,
    year: 2023,
    category: 'Development',
    credentialUrl: 'https://www.credential.net/59d465dc-c531-417d-9e19-162ac99e4831#acc.mhPU7u82',
  },
  {
    title: 'Google - E-marketing Program',
    hours: 40,
    year: 2023,
    category: 'Marketing',
    credentialUrl: 'https://learndigital.withgoogle.com/link/1g13k7gbvgg',
    credentialLabel: 'Visit Google learning',
    credentialNote:
      'Google’s original certificate URL now redirects to its learning website. Contact Omar for supporting documentation.',
  },
];
