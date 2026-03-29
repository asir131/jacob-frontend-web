import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ServiceDetailClient from '@/components/sections/ServiceDetailClient';
import { MOCK_SERVICES } from '@/data/mock-services';
import { BRAND } from '@/lib/constants';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const service = MOCK_SERVICES.find((s) => s.id === resolvedParams.id);
  
  if (!service) return { title: 'Service Not Found' };
  
  return {
    title: `${service.title} | ${BRAND.name}`,
    description: service.description || `Book ${service.title} from verified professionals on ${BRAND.name}. Get high-quality local services at your doorstep in ${service.location?.city || 'Bangladesh'}.`,
    openGraph: {
      title: `${service.title} - Professional Local Service`,
      description: service.description,
      images: service.images?.[0] ? [{ url: service.images[0] }] : [],
    }
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const service = MOCK_SERVICES.find((s) => s.id === resolvedParams.id);

  if (!service) {
    notFound();
  }

  return <ServiceDetailClient service={service} />;
}
