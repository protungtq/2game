import type { Product } from './supabase';
import type { StoreGame } from '../types';

const steamHeader = (appid: string) =>
  `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/header.jpg`;
const steamHero = (appid: string) =>
  `https://cdn.akamai.steamstatic.com/steam/apps/${appid}/library_hero.jpg`;

/**
 * Map Supabase `products` row -> StoreGame format used by
 * StoreCatalog / StoreHero / GameDetailModal / WishlistModal.
 */
export function mapProductToStoreGame(p: Product): StoreGame {
  const price = p.price ?? 0;
  const originalPrice =
    p.original_price && p.original_price > price ? p.original_price : price;
  const discountPercentage =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const coverImage =
    p.image_url || (p.steam_appid ? steamHeader(p.steam_appid) : '');
  const bannerImage = p.steam_appid ? steamHero(p.steam_appid) : coverImage;

  const genres = (p.genre || '')
    .split(',')
    .map((g) => g.trim())
    .filter(Boolean);

  return {
    id: p.id,
    title: p.name,
    coverImage,
    bannerImage,
    price,
    originalPrice,
    discountPercentage,
    drm: 'Steam',
    genres,
    rating: p.rating != null ? Number(p.rating) : 4.5,
    releaseDate: '',
    developer: '',
    publisher: p.publisher || '',
    description: p.description || '',
    systemRequirements: {
      os: p.os || 'Windows 10 64-bit',
      processor: p.cpu || '—',
      memory: p.ram || '—',
      graphics: p.gpu || '—',
      storage: p.storage || '—',
    },
    inStock: (p.stock ?? 0) > 0,
    isBestseller: p.is_featured,
    isHotDeal: p.is_featured,
  };
}
