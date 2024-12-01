"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const deals = [
  {
    id: 1,
    title: "$7 Deal Lover's™ Menu",
    description: "Choose 2 or more faves, 7 days a week",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=60",
    price: "7.00"
  },
  {
    id: 2,
    title: "Large 1-Topping Pizza",
    description: "Our best delivery deal",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&auto=format&fit=crop&q=60",
    price: "9.99"
  },
  {
    id: 3,
    title: "Big Boneless Wings Bundle",
    description: "16 wings, 2 orders of fries & 2 dips",
    image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=800&auto=format&fit=crop&q=60",
    price: "15.99"
  }
];

export function FeaturedDeals() {
  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Featured</h2>
        <Link 
          href="/deals" 
          className="text-red-600 hover:text-red-700 font-semibold flex items-center"
        >
          SEE MORE <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <Link 
            key={deal.id} 
            href={`/deals/${deal.id}`}
            className="group bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]"
          >
            <div className="relative h-48 w-full">
              <Image
                src={deal.image}
                alt={deal.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full">
                ${deal.price}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{deal.title}</h3>
              <p className="text-gray-600">{deal.description}</p>
              <div className="mt-4 flex items-center text-red-600 font-semibold">
                Order Now <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}