"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SalonGalleryProps } from "@/type/salon";


export default function SalonGallery({
  bannerImg,
  salonName,
}: SalonGalleryProps) {
  return (
    <div className="relative h-64 md:h-80 w-full bg-purple-950 overflow-hidden">
      <img
        src={bannerImg}
        alt={salonName}
        className="w-full h-full object-cover opacity-60 transition-all duration-500 transform hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#FAF5F7] via-transparent to-black/40" />
      <Link
        href="/"
        className="absolute top-4 left-4 bg-white/90 backdrop-blur p-2.5 rounded-full text-purple-950 shadow-lg hover:bg-white transition"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>
    </div>
  );
}
