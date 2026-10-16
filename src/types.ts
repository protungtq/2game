export interface StoreGame {
  id: string;
  title: string;
  coverImage: string;
  bannerImage: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  drm: 'Steam' | 'Epic Games' | 'GOG' | 'Ubisoft Connect' | 'Rockstar';
  genres: string[];
  rating: number;
  releaseDate: string;
  developer: string;
  publisher: string;
  description: string;
  systemRequirements: {
    os: string;
    processor: string;
    memory: string;
    graphics: string;
    storage: string;
  };
  inStock: boolean;
  isBestseller?: boolean;
  isHotDeal?: boolean;
}

export interface CartItem {
  game: StoreGame;
  quantity: number;
}
