"use client";
import Link from "next/link";
import { educationData } from "@/data/education";

export default function EducationHub() {
  return (
    <main className="min-h-screen bg-[#FDFCF8] pt-32 pb-40 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black mb-12">Education Hub</h1>
        <div className="grid gap-6">
          {educationData.map((topic) => (
            <Link key={topic.slug} href={`/education/${topic.slug}`} className="block p-8 bg-white border border-slate-200 rounded-3xl hover:shadow-lg transition-all">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-2 block">{topic.tag}</span>
              <h2 className="text-2xl font-black mb-4">{topic.title}</h2>
              <p className="text-slate-600 font-medium">{topic.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
