import Image from 'next/image';

export function AboutHero() {
  return (
    <div className="relative h-[400px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/about-hero.jpg"
          alt="DoughDoughs Pizza Kitchen"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 h-full flex items-center justify-center text-white">
        <h1 className="text-5xl font-bold text-center">
          Crafting Perfect Pizza Since 2020
        </h1>
      </div>
    </div>
  );
}
