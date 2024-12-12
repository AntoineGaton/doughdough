"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { useCart } from "@/hooks/useCart";

type DealOrderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  deal: {
    id: string;
    title: string;
    price: number;
    options: string[];
    description: string;
    terms: string;
  };
};

export function DealOrderModal({ isOpen, onClose, deal }: DealOrderModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const { addToCart } = useCart();

  const handleOptionToggle = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  const handleAddToCart = () => {
    addToCart({
      id: deal.id,
      name: deal.title,
      price: deal.price,
      description: deal.description,
      selectedOptions,
      isDeal: true
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-bold">
              Customize Your {deal.title}
            </Dialog.Title>
            <button onClick={onClose}>
              <X className="h-6 w-6 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600">{deal.description}</p>
            
            <div className="space-y-2">
              <p className="font-semibold">Select your options:</p>
              {deal.options?.map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionToggle(option)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span>{option}</span>
                </label>
              )) || <p className="text-gray-500">No options available</p>}
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Add to Cart - ${deal.price}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 