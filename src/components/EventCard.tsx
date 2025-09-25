import { EventItem } from "@/db/type/event";

type Props = {
  item: EventItem;
  onClick?: (id: number) => void;
  active?: boolean;
};

export default function EventCard({ item, onClick, active }: Props) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-500 border border-pink-100/50 cursor-pointer ${
        active ? "transform scale-105 shadow-2xl" : "transform scale-100"
      }`}
      onClick={() => onClick?.(item.id)}
    >
      {/* Discount Badge */}
      <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
        {item.discount}
      </div>

      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* K-beauty inspired overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="text-sm text-pink-200 mb-1">{item.validUntil}</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <span className="inline-block bg-gradient-to-r from-[#0ABAB5]/10 to-pink-100 text-[#0ABAB5] px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
            {item.category}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-[#0ABAB5] transition-colors">
          {item.title}
        </h3>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-[#0ABAB5]">{item.eventPrice}</span>
          <span className="text-lg text-gray-400 line-through">{item.originalPrice}</span>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.description}</p>

        <div className="space-y-2">
          <div className="text-xs text-gray-500 font-medium">INCLUDES:</div>
          <div className="flex flex-wrap gap-1">
            {item.includes.slice(0, 2).map((include, index) => (
              <span key={index} className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded">
                {include}
              </span>
            ))}
            {item.includes.length > 2 && (
              <span className="text-xs bg-gradient-to-r from-[#0ABAB5]/10 to-pink-100 text-[#0ABAB5] px-2 py-1 rounded">
                +{item.includes.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#0ABAB5]/5 via-pink-200/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
}
