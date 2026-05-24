import React from 'react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';

export default function LocationSection() {
  const address = "Av. Pres. Kennedy - Jóquei club, Campos dos Goytacazes - RJ, 28020-010";
  const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(address)}`;
  // Note: Using a standard iframe for now as I don't have the API key. 
  // I will use a generic embed or a placeholder image if needed, but I'll try a public embed link.
  
  const mapEmbed = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3693.447556784382!2d-41.32599992386!3d-21.75350439812497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xbc335607062141%3A0xe543501a35028cbd!2sAv.%20Pres.%20Kennedy%20-%20J%C3%B3quei%20Club%2C%20Campos%20dos%20Goytacazes%20-%20RJ%2C%2028020-010!5e0!3m2!1sen!2sbr!4v1716500000000!5m2!1sen!2sbr";

  return (
    <section className="bg-black py-20 px-6 md:px-10 border-t border-brand-border">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left: Map */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-brand-red opacity-20 group-hover:opacity-40 transition-opacity blur-sm rounded-lg"></div>
          <div className="relative h-[400px] w-full bg-[#1a1a1f] border border-brand-border rounded-lg overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all duration-700">
            <iframe
              src={mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização Playkart Campos"
            ></iframe>
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col gap-10">
          <h2 className="font-display text-3xl md:text-4xl italic text-white font-black uppercase tracking-tight">
            VISITE O <span className="text-brand-red">BOX</span>
          </h2>

          <div className="space-y-8">
            {/* Location */}
            <div className="flex items-start gap-6 group">
              <div className="bg-brand-red p-4 skew-tag flex items-center justify-center min-w-[60px] h-[60px] group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl text-white font-black uppercase tracking-wider mb-1">LOCALIZAÇÃO</span>
                <p className="font-sans text-brand-text-muted text-sm leading-relaxed">
                  Av. Pres. Kennedy - Jóquei club<br />
                  Campos dos Goytacazes, RJ
                </p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-6 group">
              <div className="bg-brand-red p-4 skew-tag flex items-center justify-center min-w-[60px] h-[60px] group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl text-white font-black uppercase tracking-wider mb-1">HORÁRIO DE OPERAÇÃO</span>
                <p className="font-sans text-brand-text-muted text-sm leading-relaxed">
                  Terça - Sexta: 16:00 - 23:00<br />
                  Sábados e Domingos: 10:00 - 00:00
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="flex items-start gap-6 group">
              <div className="bg-brand-red p-4 skew-tag flex items-center justify-center min-w-[60px] h-[60px] group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl text-white font-black uppercase tracking-wider mb-1">PIT STOP</span>
                <div className="flex flex-col gap-1 text-sm">
                  <a href="tel:+5522999990000" className="font-sans text-brand-text-muted hover:text-brand-red transition-colors">+55 (22) 99999-0000</a>
                  <a href="mailto:contato@playkartcampos.com.br" className="font-sans text-brand-text-muted hover:text-brand-red transition-colors">contato@playkartcampos.com.br</a>
                </div>
              </div>
            </div>

            <button 
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Playkart Campos Av. Pres. Kennedy")}`)}
              className="mt-4 w-full md:w-auto bg-white text-black font-display text-lg px-8 py-3 skew-tag hover:bg-brand-red hover:text-white transition-all cursor-pointer mechanical-switch"
            >
              <span>ABRIR NO GOOGLE MAPS</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
