import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BookingClient from '@/components/sections/BookingClient';
import { MOCK_SERVICES } from '@/data/mock-services';
import { BRAND } from '@/lib/constants';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const service = MOCK_SERVICES.find((s) => s.id === resolvedParams.id);
  
  if (!service) return { title: 'Booking Not Found' };
  
  return {
    title: `Checkout - ${service.title} | ${BRAND.name}`,
    description: `Complete your booking for ${service.title} on ${BRAND.name}. Secure your pro today with our 100% satisfaction guarantee.`,
    robots: { index: false, follow: false },
  };
}

export default async function BookingPage({ params }: PageProps) {
  const resolvedParams = await params;
  const service = MOCK_SERVICES.find((s) => s.id === resolvedParams.id);

  if (!service) {
    notFound();
  }

  return <BookingClient service={service} />;
}
