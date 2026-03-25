export interface PortalTile {
  id: string;
  title: string;
  description: string;
  href: string;
  icon?: string;
}

export interface Country {
  code: string;
  name: string;
  dialCode: string;
}

export interface ExchangeRate {
  currency: string;
  code: string;
  rate: number;
  change?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface DeveloperBullet {
  id: string;
  text: string;
}
