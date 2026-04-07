import { Metadata } from 'next';
import CategoryClient from '@/components/sections/CategoryClient';
import { CATEGORY_MAP } from '@/data/categories';
import { BRAND } from '@/lib/constants';

interface Props {
  params: Promise<{ slug: string }>;
}

const humanizeSlug = (slug: string) =>
  slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORY_MAP[slug];
  
  if (!category) {
    return {
      title: `${humanizeSlug(slug)} Services | ${BRAND.name}`,
      description: `Browse ${humanizeSlug(slug)} services on ${BRAND.name}.`,
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
