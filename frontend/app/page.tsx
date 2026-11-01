import Image from 'next/image';
import Link from 'next/link';
import HeritageSection from '@/components/heritage/HeritageSection';
import ProductCard from '@/components/product/ProductCard';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import ScrollReveal from '@/components/shared/ScrollReveal';
import WordReveal from '@/components/shared/WordReveal';
import Magnetic from '@/components/shared/Magnetic';
import Parallax from '@/components/shared/Parallax';
import TiltCard from '@/components/shared/TiltCard';
import MarqueeTicker from '@/components/home/MarqueeTicker';
import { apiUrl } from '@/lib/api';

async function getFeaturedProducts() {
  try {
    const res = await fetch(apiUrl('/api/products'), { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.status === 'success' ? data.data.slice(0, 4) : [];
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return [];
  }
}

const TRUST = [
  { label: '100% Pure', sub: 'No fillers, no artificial colour' },
  { label: 'Stone-Ground', sub: 'Slow grinding keeps the oils' },
  { label: 'Since 2001', sub: 'Two decades of trust' },
  { label: 'Free Delivery', sub: 'On orders above ₹300' },
];

// One tile per shop category. Images live in /public/posters/<img>.webp
const COLLECTIONS = [
  { img: 'blended_spices', title: 'Blended Spices', sub: 'Garam, chat, chana, biryani and more ready-made masalas', href: '/shop?category=Blended%20Spices' },
  { img: 'ground_spices', title: 'Ground Spices', sub: 'Haldi, mirch, coriander, jeera, amchur and more', href: '/shop?category=Ground%20Spices' },
  { img: 'speciality_essentials', title: 'Specialty Essentials', sub: 'Kasuri methi, salts, saunf, besan, poha and more', href: '/shop?category=Specialty%20Essentials' },
  { img: 'whole_spices_and_seeds', title: 'Whole Spices & Seeds', sub: 'Jeera, ajwain and other whole seeds', href: '/shop?category=Whole%20Spices%20%26%20Seeds' },
];

// Every poster tile uses the exact same frame (5:2), so all images display at an identical size.
function Stage({ img, alt, priority = false, sizes }: { img: string; alt: string; priority?: boolean; sizes: string }) {
  return (
    <div className="stage relative w-full aspect-5/2 overflow-hidden">
      <Image src={`/posters/${img}.webp`} alt={alt} fill sizes={sizes} priority={priority} className="object-contain" />
    </div>
  );
}

function Showcase({ img, alt, priority = false }: { img: string; alt: string; priority?: boolean }) {
  return (
    <div className="relative">
      <div className="absolute inset-x-[8%] top-[10%] bottom-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_55%,rgba(184,146,74,0.28),rgba(184,146,74,0.10)_55%,transparent_75%)] blur-2xl" />
      <Image
        src={`/posters/${img}.webp`}
        alt={alt}
        width={2000}
        height={782}
        sizes="(min-width:1280px) 1152px, 100vw"
        priority={priority}
        className="relative w-full h-auto"
        style={{
          maskImage: 'linear-gradient(to bottom, #000 88%, transparent), linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, #000 88%, transparent), linear-gradient(to right, transparent, #000 5%, #000 95%, transparent)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      />
    </div>
  );
}

export default async function Home() {
  const dbProducts = await getFeaturedProducts();
  const featured = dbProducts.map((p: any) => ({
    id: String(p.id),
    name: p.name,
    category: p.category,
    slug: p.slug,
    image: p.image_url,
    sizes: p.sizes || [{ weight: p.weight || 'Standard', price: p.price || 0 }],
  }));

  return (
    <div className="flex flex-col grow">
      {/* Hero */}
      <section className="relative overflow-hidden bg-ink pt-20 md:pt-28 pb-16 md:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(184,146,74,0.16),transparent_70%)]" />
        <div className="absolute -top-32 left-[8%] w-md h-[28h-112ded-full bg-gold/10 blur-3xl animate-drift pointer-events-none" />
        <div className="absolute top-40 -right-24 w-104 h-104 rounded-full bg-oxblood/40 blur-3xl animate-drift pointer-events-none" style={{ animationDelay: '-6s' }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <p className="eyebrow mb-6 animate-fade-in">Dehradun <span className="mx-2 text-gold">◆</span> Since 2001</p>
            <h1 className="font-serif font-medium text-[clamp(1.9rem,8.2vw,2.6rem)] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-ivory">
              <WordReveal text="Royal aroma, stone-ground to perfection" startDelay={150} highlight={['stone-ground']} />
            </h1>
            <p className="mt-6 text-ivory-muted text-lg max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: '550ms' }}>
              Hand-selected, slow-ground and sealed fresh in Dehradun, so every pinch tastes the way it should.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center animate-fade-up" style={{ animationDelay: '700ms' }}>
              <Magnetic>
                <Link href="/shop" className="btn-sheen inline-block bg-gold-soft text-ink px-9 py-4 text-[12px] uppercase tracking-[0.22em] font-semibold hover:bg-ivory transition-colors">
                  Shop the collection
                </Link>
              </Magnetic>
              <Magnetic>
                <Link href="/heritage" className="inline-block border border-gold/60 text-ivory px-9 py-4 text-[12px] uppercase tracking-[0.22em] hover:border-gold-soft hover:text-gold-soft hover:bg-gold/5 transition-all">
                  Our story
                </Link>
              </Magnetic>
            </div>
          </div>
          <div className="mt-14 md:mt-16 max-w-6xl mx-auto animate-fade-up" style={{ animationDelay: '900ms' }}>
            <Parallax speed={0.06}>
              <Showcase img="showcase-classic" alt="Nirmal Gold Masale boxes and pouches with fresh spices" priority />
            </Parallax>
          </div>
        </div>
      </section>

      <MarqueeTicker />

      {/* Trust strip */}
      <section className="border-y border-gold/25 bg-surface">
        <div className="container mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 md:divide-x divide-gold/20">
          {TRUST.map((t, i) => (
            <ScrollReveal key={t.label} delay={i * 90} variant="fade">
              <div className="text-center px-4 py-3">
                <p className="font-serif text-xl text-gold-soft">{t.label}</p>
                <p className="text-xs text-ivory-muted mt-1">{t.sub}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="container mx-auto px-6 py-20 md:py-28">
        <ScrollReveal>
          <div className="text-center mb-14">
            <p className="eyebrow mb-4">The Collections</p>
            <h2 className="font-serif font-medium text-4xl md:text-5xl text-ivory">Find your masala</h2>
            <div className="hairline w-40 mx-auto mt-6" />
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-2 gap-8 md:gap-10">
          {COLLECTIONS.map((c, i) => (
            <ScrollReveal key={c.img} delay={(i % 2) * 140} variant={i % 2 === 0 ? 'left' : 'right'}>
              <Link href={c.href} className="group block">
                <TiltCard max={4}>
                  <Stage img={c.img} alt={c.title} sizes="(min-width:768px) 50vw, 100vw" />
                </TiltCard>
                <div className="flex items-end justify-between pt-5">
                  <div>
                    <h3 className="font-serif text-2xl md:text-3xl text-ivory group-hover:text-gold-soft transition-colors">{c.title}</h3>
                    <p className="text-sm text-ivory-muted mt-1">{c.sub}</p>
                  </div>
                  <span className="text-gold-soft text-[11px] uppercase tracking-[0.22em] whitespace-nowrap ml-4 transition-transform duration-500 group-hover:translate-x-2">Explore →</span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Everyday range band */}
      <section className="bg-ink bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(94,26,23,0.85),transparent_70%)] border-y border-gold/25">
        <div className="container mx-auto px-6 py-20 md:py-24 grid lg:grid-cols-12 gap-10 items-center">
          <ScrollReveal className="lg:col-span-4" variant="left">
            <p className="eyebrow mb-4">Everyday Range</p>
            <h2 className="font-serif font-medium text-4xl md:text-5xl text-ivory leading-tight">Big flavour. <span className="text-gold-shimmer">₹10</span> a pack.</h2>
            <p className="text-ivory-muted mt-5 leading-relaxed">
              Seven kitchen essentials in small, fresh-sealed boxes. Perfect for trying a new masala, or for stocking up for every meal.
            </p>
            {/* CHANGE THIS LINK */}
            <Link href="/shop?price=Under%20%E2%82%B950" className="inline-block mt-8 border border-gold/60 px-8 py-3.5 text-[12px] uppercase tracking-[0.22em] text-ivory hover:border-gold-soft hover:text-gold-soft hover:bg-gold/5 transition-all">
              Shop everyday packs
            </Link>
          </ScrollReveal>
          <ScrollReveal delay={160} className="lg:col-span-8" variant="scale">
            <Stage img="everyday" alt="Nirmal Gold ₹10 everyday masala boxes" sizes="(min-width:1024px) 66vw, 100vw" />
          </ScrollReveal>
        </div>
      </section>

      {/* Featured products */}
      <section className="container mx-auto px-6 py-20 md:py-28">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="eyebrow mb-3">Handpicked</p>
              <h2 className="font-serif font-medium text-4xl md:text-5xl text-ivory">Signature spices</h2>
            </div>
            <Link href="/shop" className="text-gold-soft text-[12px] uppercase tracking-[0.22em] hover:text-ivory transition-colors">View all →</Link>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 max-[340px]:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6 items-stretch">
          {featured.length > 0 ? (
            featured.map((product: any, i: number) => (
              <ScrollReveal key={`${product.id}-${i}`} delay={i * 100} className="h-full">
                <ProductCard product={product} />
              </ScrollReveal>
            ))
          ) : (
            <div className="col-span-full text-center py-16 px-6 border border-dashed border-gold/30 text-ivory-muted">
              <p className="font-serif text-xl mb-1">Spices are on their way to the shelf</p>
              <p className="text-sm">Couldn&apos;t reach the catalog right now. Please check back shortly.</p>
            </div>
          )}
        </div>
      </section>

      <WhyChooseUs />
      <HeritageSection />
      <Testimonials />
      <Newsletter />
    </div>
  );
}