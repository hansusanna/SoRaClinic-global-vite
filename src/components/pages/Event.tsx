import { useMemo, useState, useEffect } from "react";
import type { EventItem } from "@/db/type/event";
import EventCard from "@/components/EventCard";
import raw from "@/db/event.json";
import { Button } from "@/components/ui/button"; 

export default function Event() {
  const [selectedItem, setSelectedItem] = useState<EventItem | null>(null);
  const [clickedCard, setClickedCard] = useState<number | null>(null);

  useEffect(() => {
  if (!selectedItem) return;

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") setSelectedItem(null);
  };
  document.addEventListener("keydown", onKey);

  const prev = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  return () => {
    document.removeEventListener("keydown", onKey);
    document.body.style.overflow = prev;
  };
}, [selectedItem]);

  const items = raw as EventItem[];

  // 만료/활성 분류
  const { activeItems, expiredItems } = useMemo(() => {
    const today = new Date();

    const parseValidUntil = (txt: string): Date | null => {
      if (/available daily/i.test(txt)) return new Date(8640000000000000); // 무기한
      const m = txt.match(/until\s+(.+)$/i);
      if (!m) return null;
      const d = new Date(m[1]);
      return isNaN(d.getTime()) ? null : d;
    };

    const active: EventItem[] = [];
    const expired: EventItem[] = [];

    for (const it of items) {
      const d = parseValidUntil(it.validUntil);
      if (!d) active.push(it);
      else (d >= today ? active : expired).push(it);
    }
    return { activeItems: active, expiredItems: expired };
  }, [items]);

  const handleCardClick = (id: number) => {
    setClickedCard(id);
    const picked = items.find((i) => i.id === id) ?? null;

    setTimeout(() => {
      setClickedCard(null);
      setSelectedItem(picked);
    }, 200);
  };

  return (
    <div className="max-w-7xl px-6 py-8 mx-auto">
      {/* 이벤트 타이틀 */}
      <div className="text-center mb-12">
        <h1 className="text-5xl mb-6 text-gray-800">Special Promotions</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Exclusive K-beauty offers for international clients at SoRa Clinic.
          Experience premium Korean beauty treatments with special discounted rates.
        </p>
        <div className="mt-6 inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-medium">
        Limited Time Offers - Book Your Beauty Transformation Now!
        </div>
      </div>

      {/* Active */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeItems.map((item) => (
          <EventCard
            key={item.id}
            item={item}
            active={clickedCard === item.id}
            onClick={handleCardClick}
          />
        ))}
      </div>

      {/* Expired 이벤트 끝났을때 */}
      {expiredItems.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Expired</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-60">
            {expiredItems.map((item) => (
              <EventCard
                key={item.id}
                item={item}
                active={clickedCard === item.id}
                onClick={handleCardClick}
              />
            ))}
          </div>
        </section>
      )}

      {/* 상세 선택 영역 */}
      {selectedItem && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={() => setSelectedItem(null)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-pink-100/50"
      onClick={(e) => e.stopPropagation()}
      tabIndex={-1}>
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-[4/3] overflow-hidden rounded-xl shadow-lg relative">           
              { <img
                src={selectedItem.image}
                alt={selectedItem.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  img.onerror = null;
                  img.src = "/img/placeholder.jpg";
                }}
              /> }

              <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                {selectedItem.discount}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-4">
            <div>
              <div className="mb-2">
                <span className="inline-block bg-gradient-to-r from-[#0ABAB5]/10 to-pink-100 text-[#0ABAB5] px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
                  {selectedItem.category}
                </span>
              </div>

              <h2 id="event-modal-title" className="text-2xl md:text-3xl text-gray-800 mb-3 font-light leading-tight">
                {selectedItem.title}
              </h2>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl md:text-3xl font-bold text-[#0ABAB5]">
                  {selectedItem.eventPrice}
                </span>
                <span className="text-lg md:text-xl text-gray-400 line-through">
                  {selectedItem.originalPrice}
                </span>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-pink-50 border border-pink-200 rounded-lg p-2 mb-4">
                <div className="text-xs md:text-sm text-pink-800 font-medium">
                   {selectedItem.validUntil}
                </div>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
              {selectedItem.description}
            </p>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-800">What's Included:</h4>
              <div className="grid grid-cols-1 gap-1">
                {selectedItem.includes.map((include, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-gradient-to-r from-[#0ABAB5] to-pink-400 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm">{include}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-gradient-to-r from-[#0ABAB5] to-pink-400 hover:from-[#0ABAB5]/90 hover:to-pink-400/90 text-white px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex-1 text-sm">
                Book This
              </Button>
              <Button variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-full transition-all duration-300 text-sm">
                Ask Questions
              </Button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setSelectedItem(null)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
