import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { MusicPlayer } from "@/components/ui/MusicPlayer";
import { getPortfolioItems } from "@/lib/content-store";

export const metadata: Metadata = {
  title: "Cinematic Thumbnails | MEET.",
  description: "MrBeast-style cinematic thumbnail direction built for YouTube clicks, storytelling, and scale.",
};

type PortfolioItem = {
  _id: string;
  title: string;
  image: string;
  category?: string;
  description?: string;
};

const principles = [
  {
    title: "Big Emotion",
    description:
      "The strongest cinematic thumbnails communicate tension, surprise, or obsession in less than a second.",
  },
  {
    title: "Clear Story",
    description:
      "Every frame needs a readable idea: challenge, consequence, reward, or a world the viewer wants to enter.",
  },
  {
    title: "MrBeast Energy",
    description:
      "Bold subject separation, high contrast color, and focused composition that still feels polished instead of noisy.",
  },
];

export default async function CinematicPage() {
  const items: PortfolioItem[] = (await getPortfolioItems()).filter((item: PortfolioItem) =>
    item.category?.toLowerCase().includes("cinematic")
  );

  return (
    <main className="bg-[#050505] text-white min-h-screen selection:bg-white/20 selection:text-white">
      <Navbar />

      <section className="pt-36 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/30 font-semibold mb-3">
            02 // Cinematic
          </p>
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 items-end">
            <div>
              <h1 className="text-5xl md:text-7xl font-black leading-[0.95]">
                Thumbnails with
                <br />
                <span className="text-gradient-premium">cinematic pull.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-white/45 text-lg font-light leading-relaxed">
                This category is built for story-heavy YouTube packaging: MrBeast-style scale,
                premium lighting, sharper emotional reads, and thumbnails that feel made to rule
                the homepage instead of blend into it.
              </p>
            </div>

            <div className="glass-card rounded-[2rem] p-6 md:p-8">
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/30 font-semibold mb-4">
                What Rules YouTube
              </p>
              <div className="space-y-5">
                {principles.map((item) => (
                  <div key={item.title} className="border-b border-white/8 pb-5 last:border-b-0 last:pb-0">
                    <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                    <p className="text-white/45 font-light leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/30 font-semibold mb-3">
                Selected Frames
              </p>
              <h2 className="text-4xl md:text-6xl font-black">Cinematic Gallery</h2>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="glass-card rounded-[2rem] p-10 text-center text-white/35 font-light">
              No cinematic thumbnails added yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {items.map((item, index) => (
                <article
                  key={item._id}
                  className={`group overflow-hidden rounded-[1.75rem] border border-white/8 bg-white/[0.03] ${
                    index === 0 ? "md:col-span-2 aspect-[16/8]" : "aspect-video"
                  }`}
                >
                  <div className="relative h-full">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                      <span className="inline-block text-[10px] uppercase tracking-[0.25em] text-white/45 font-semibold mb-2">
                        {item.category || "Cinematic"}
                      </span>
                      <h3 className="text-xl md:text-2xl font-black">{item.title}</h3>
                      {item.description ? (
                        <p className="mt-2 text-sm text-white/45 max-w-lg font-light leading-relaxed">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <MusicPlayer />
    </main>
  );
}
