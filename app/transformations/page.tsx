import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";
import { MusicPlayer } from "@/components/ui/MusicPlayer";
import { getTransformationItems } from "@/lib/content-store";
import type { TransformationItem } from "@/lib/content-types";

export const metadata: Metadata = {
  title: "Transformations | MEET.",
  description: "See the before and after transformations of high-impact YouTube thumbnails.",
};

export default async function TransformationsPage() {
  const items = await getTransformationItems();

  return (
    <main className="bg-[#050505] text-white min-h-screen selection:bg-white/20 selection:text-white">
      <Navbar />

      <div className="pt-36 pb-16 px-6 max-w-5xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.35em] text-white/30 font-semibold mb-3">
          03 // Transformations
        </p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
          Before<br /><span className="text-gradient">/ After</span>
        </h1>
        <p className="text-white/40 font-light text-lg max-w-xl leading-relaxed">
          A visual breakdown of how raw ideas become cinematic, high-converting thumbnails.
          Drag the handle to reveal the difference.
        </p>
        <div className="mt-10 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
      </div>

      <div className="px-6 max-w-5xl mx-auto pb-28 space-y-24">
        {items.length === 0 ? (
          <div className="text-center py-20 text-white/30 font-light">
            No transformations added yet. Manage them in the Admin Dashboard.
          </div>
        ) : (
          items.map((item: TransformationItem) => (
            <article key={item._id} className="glass-card rounded-3xl p-6 md:p-8">
              <BeforeAfterSlider
                beforeImage={item.beforeImage}
                afterImage={item.afterImage}
                beforeLabel="Before"
                afterLabel="After"
              />
              <div className="mt-8 max-w-xl">
                <h2 className="text-xl md:text-2xl font-black mb-3">
                  {item.title}
                </h2>
                <p className="text-white/45 font-light leading-relaxed text-sm md:text-base whitespace-pre-line">
                  {item.description}
                </p>
              </div>
            </article>
          ))
        )}
      </div>

      <MusicPlayer />
    </main>
  );
}
