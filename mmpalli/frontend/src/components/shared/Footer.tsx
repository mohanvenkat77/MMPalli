import { Code, Camera, Play, Heart, MapPin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-white/10 bg-[#18231f] text-stone-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,145,102,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(82,132,158,0.12),transparent_30%)]" />
      <div className="site-container relative z-10 py-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h3 className="display-title text-2xl text-white">
              Matla Mala <span className="text-amber-300">Palli</span>
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-sm text-stone-300/78">
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} className="text-amber-200" />
                Anantapur, Andhra Pradesh
              </span>
              <span className="inline-flex items-center gap-2">
                <Mail size={14} className="text-amber-200" />
                dasimohanvenkat7@gmail.com
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a href="/foundation" className="text-sm text-stone-300/84 transition hover:text-amber-200">Foundation</a>
            <a href="/village-accounts" className="text-sm text-stone-300/84 transition hover:text-amber-200">Village</a>
            <div className="flex gap-2">
              <a
                href="https://github.com/mohanvenkat77"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10"
                title="GitHub"
              >
                <Code size={18} />
              </a>
              <a
                href="https://www.instagram.com/mohan_fani?igsh=NWRhZGQ5YmxocHF0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-rose-300 transition hover:bg-white/10"
                title="Instagram"
              >
                <Camera size={18} />
              </a>
              <a
                href="https://www.youtube.com/@mmptechie777"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-red-300 transition hover:bg-white/10"
                title="YouTube"
              >
                <Play size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4 text-xs text-stone-300/70 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} MatlaMala Palli Development. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted with <Heart size={12} className="fill-rose-400 text-rose-400" /> by <span className="font-semibold text-white">Mohan Venkat</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
