export interface ProductSelection {
  standartPed: number;
  superPed: number;
  superPlusPed: number;
  gunlukPed: number;
  superGunlukPed: number;
  tangaGunlukPed: number;
  miniTampon: number;
  standartTampon: number;
  superTampon: number;
  isiPaketi2li: number;
  isiPaketi4lu: number;
  cycleEssentials: number;
  cranberryEssentials: number;
}

export interface PackageState {
  selections: ProductSelection;
  totalPrice: number;
  isValid: boolean;
  isLoading: boolean;
  cartItems: ProductSelection;
  cartTotalPrice: number;
}

export interface Product {
  id: string;
  name: string;
  type: 'ped' | 'gunluk' | 'tampon';
  subtype?: 'standart' | 'super' | 'superplus';
  color: string;
  price: number;
  description?: string;
}

export type ProductType = keyof ProductSelection;
