"use client";

import { Star } from "lucide-react";
import { Review } from "@/type/profile";

interface ReviewsTabProps {
  reviews: Review[];
}

export default function ReviewsTab({ reviews }: ReviewsTabProps) {
  return (
    <div className="bg-white border border-purple-200/60 rounded-2xl p-6 shadow-xs space-y-4">
      <h3 className="text-sm font-black uppercase tracking-tight text-purple-950 border-b border-slate-100 pb-3">
        Değerlendirmelerim & Yorumlarım
      </h3>
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <p className="text-xs text-slate-400 font-bold py-4 text-center">
            Henüz bir yorum yapmadınız.
          </p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="border border-purple-100 rounded-xl p-4 space-y-2 bg-[#FAF6F8]/50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black bg-purple-100 text-purple-800 px-2 py-0.5 rounded-sm uppercase tracking-wider mr-2">
                    {rev.type || "Yorum"}
                  </span>
                  <h4 className="text-xs font-black text-purple-950 inline-block">
                    {rev.target_name || "Değerlendirme"}
                  </h4>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">
                  {new Date(rev.created_at).toLocaleDateString("tr-TR")}
                </span>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-600 font-medium italic leading-relaxed">
                "{rev.comment}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
