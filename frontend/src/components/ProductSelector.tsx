'use client';

import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus } from 'lucide-react';
import { RootState } from '@/store';
import { incrementSelection, decrementSelection } from '@/store/packageSlice';
import { ProductType } from '@/store/types';
import { cn } from '@/lib/utils';

interface ProductSelectorProps {
  productType: ProductType;
  title: string;
  color: string;
  description?: string;
}

export default function ProductSelector({ 
  productType, 
  title, 
  color, 
  description 
}: ProductSelectorProps) {
  const dispatch = useDispatch();
  const quantity = useSelector((state: RootState) => state.package.selections[productType]);

  const handleIncrement = () => {
    dispatch(incrementSelection(productType));
  };

  const handleDecrement = () => {
    dispatch(decrementSelection(productType));
  };

  return (
    <div className="flex items-center justify-between py-4 px-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
      {/* Product Info */}
      <div className="flex items-center space-x-4">
        <div 
          className={cn("w-4 h-4 rounded-full flex-shrink-0")}
          style={{ backgroundColor: color }}
        />
        <div>
          <h3 className="font-medium text-beije-text">{title}</h3>
          {description && (
            <p className="text-sm text-beije-muted mt-1">{description}</p>
          )}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleDecrement}
          disabled={quantity === 0}
          className={cn(
            "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
            quantity === 0
              ? "border-gray-200 text-gray-300 cursor-not-allowed"
              : "border-gray-300 text-beije-text hover:border-beije-primary hover:text-beije-primary"
          )}
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="w-8 text-center font-medium text-beije-text">
          {quantity}
        </span>

        <button
          onClick={handleIncrement}
          className="w-8 h-8 rounded-full border-2 border-gray-300 text-beije-text hover:border-beije-primary hover:text-beije-primary flex items-center justify-center transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
