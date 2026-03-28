import { Code, Camera, Play, Heart, MapPin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-black italic tracking-tighter">
              MMP<span className="text-saffron-500">Palli</span>
            </h3>
            <p className="text-sm leading-relaxed opacity-70">
              A digital initiative for MatlaMala Palli development. 
              Building transparency and community growth through technology.
            </p>
            <div className="flex items-center gap-2 text-xs text-saffron-400 font-bold uppercase tracking-widest">
                <MapPin size={14} /> Anantapur, Andhra Pradesh
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:ml-auto">
            <h4 className="text-white font-bold mb-6">Quick Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/foundation" className="hover:text-saffron-400 transition-colors">Jai Bheem Foundation</a></li>
              <li><a href="/village-updates" className="hover:text-saffron-400 transition-colors">Village Updates</a></li>
              <li><a href="/members" className="hover:text-saffron-400 transition-colors">Member Directory</a></li>
            </ul>
          </div>

          {/* Social Presence */}
          <div className="md:ml-auto">
            <h4 className="text-white font-bold mb-6">Connect with Developer</h4>
            <div className="flex gap-4">
              {/* GitHub Link - Using 'Code' Icon for stability */}
              <a 
                href="https://github.com/mohanvenkat77" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all hover:-translate-y-1 text-white flex items-center gap-2"
                title="GitHub"
              >
                <Code size={20} />
              </a>
              {/* Instagram Link - Using 'Camera' Icon */}
              <a 
                href="https://www.instagram.com/mohan_fani?igsh=NWRhZGQ5YmxocHF0" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all hover:-translate-y-1 text-rose-400"
                title="Instagram"
              >
                <Camera size={20} />
              </a>
              {/* YouTube Link - Using 'Play' Icon */}
              <a 
                href="https://www.youtube.com/@mmptechie777" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all hover:-translate-y-1 text-red-500"
                title="YouTube"
              >
                <Play size={20} />
              </a>
            </div>
            <p className="mt-6 text-xs flex items-center gap-2">
              <Mail size={14} className="text-saffron-500" />
              dasimohanvenkat7@gmail.com
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-center">
          <p>© {currentYear} MatlaMala Palli Development. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed & Developed with <Heart size={12} className="text-rose-500 fill-rose-500" /> by 
            <span className="text-white font-bold">Mohan Venkat</span>
          </p>
        </div>
      </div>
    </footer>
  );
}