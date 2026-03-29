import { Metadata } from 'next';
import CategoryClient from '@/components/sections/CategoryClient';
import { CATEGORY_MAP } from '@/data/categories';
import { BRAND } from '@/lib/constants';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORY_MAP[slug];
  
  if (!category) {
    return {
      title: `Category Not Found | ${BRAND.name}`,
    };
  }

  return {
    title: `${category.name} Services | ${BRAND.name}`,
    description: category.description,
    openGraph: {
      title: `${category.name} Services — Professional ${category.name} Experts`,
      description: category.description,
      type: 'website',
    }
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  return <CategoryClient slug={slug} />;
}
