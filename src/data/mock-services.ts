export interface Service {
  id: string;
  title: string;
  category: string;
  subCategory: string;
  provider: {
    id: string;
    name: string;
    type: 'Solo' | 'Team' | 'Agency' | 'Company';
    avatar: string;
    badge: 'Verified' | 'Top Rated' | 'New';
    rating: number;
    completedOrders: number;
  };
  location: {
    city: string;
    lat: number;
    lng: number;
  };
  startingPrice: number;
  images: string[];
  distance?: number; // Calculated dynamically
}

export const MOCK_SERVICES: Service[] = [
  {
    id: 'GIG-001',
    title: 'Professional Deep House Cleaning',
    category: 'Cleaning',
    subCategory: 'House Cleaning',
    provider: {
      id: 'USR-001',
      name: 'Rahim Uddin',
      type: 'Solo',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267041',
      badge: 'Top Rated',
      rating: 4.9,
      completedOrders: 142,
    },
    location: {
      city: 'Dhaka, Bangladesh',
      lat: 23.7937,
      lng: 90.4066, // Banani
    },
    startingPrice: 1500,
    images: ['/service1.png', '/service2.png'],
  },
  {
    id: 'GIG-002',
    title: 'Expert Plumbing & Pipe Repair',
    category: 'Plumbing',
    subCategory: 'Pipe Maintenance',
    provider: {
      id: 'USR-002',
      name: 'QuickFix Team',
      type: 'Team',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267042',
      badge: 'Verified',
      rating: 4.7,
      completedOrders: 310,
    },
    location: {
      city: 'Dhaka, Bangladesh',
      lat: 23.7509,
      lng: 90.3933, // Farmgate
    },
    startingPrice: 500,
    images: ['/service3.png'],
  },
  {
    id: 'GIG-003',
    title: 'AC Servicing & Master Cleaning',
    category: 'Electrical',
    subCategory: 'AC Servicing',
    provider: {
      id: 'USR-003',
      name: 'CoolBreeze Agency',
      type: 'Agency',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267043',
      badge: 'Verified',
      rating: 4.5,
      completedOrders: 82,
    },
    location: {
      city: 'Dhaka, Bangladesh',
      lat: 23.7340,
      lng: 90.3928, // Shahbag
    },
    startingPrice: 800,
    images: ['/service4.png'],
  },
  {
    id: 'GIG-004',
    title: 'At-home Bridal Makeup & Styling',
    category: 'Beauty',
    subCategory: 'Bridal Makeup',
    provider: {
      id: 'USR-004',
      name: 'Sadia Islam',
      type: 'Solo',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267044',
      badge: 'Top Rated',
      rating: 5.0,
      completedOrders: 43,
    },
    location: {
      city: 'Dhaka, Bangladesh',
      lat: 23.8103,
      lng: 90.4125, // Gulshan
    },
    startingPrice: 5000,
    images: ['/hero2.png'],
  },
  {
    id: 'GIG-005',
    title: 'Pest Control for Apartments & Offices',
    category: 'Pest Control',
    subCategory: 'Termite Control',
    provider: {
      id: 'USR-005',
      name: 'PestBusters Ltd.',
      type: 'Company',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e290267045',
      badge: 'Verified',
      rating: 4.8,
      completedOrders: 512,
    },
    location: {
      city: 'Chattogram, Bangladesh',
      lat: 22.3569,
      lng: 91.7832,
    },
    startingPrice: 2000,
    images: ['/service1.png'],
  },
];

// Helper to calculate distance in km using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const d = R * c; // Distance in km
  return Number(d.toFixed(1));
}
