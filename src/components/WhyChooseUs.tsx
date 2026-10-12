import React from 'react';
import { 
  MapPin, 
  Layers, 
  Compass, 
  Receipt, 
  Headphones, 
  MessageSquare,
  CheckCircle2,
  CalendarCheck,
  SendHorizontal,
  BadgeCheck
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const verifiedReasons = [
    {
      title: '100% Pan-India Online Booking',
      description: 'Book train, flight, bus, and tour tickets online from any city or state across India without visiting any physical office.',
      icon: MapPin,
    },
    {
      title: 'Multiple Travel Services in One Place',
      description: 'Indian Railways (IRCTC), flights, intercity luxury sleeper buses, hotel reservations, and custom holiday tours.',
      icon: Layers,
    },
    {
      title: 'Personalized Trip Planning',
      description: 'Custom travel itineraries designed according to your schedule, family preferences, and budget with round-the-clock support.',
      icon: Compass,
    },
    {
      title: 'Clear Pricing & Digital Receipts',
      description: 'Transparent fare breakdowns, instant fare quotes, and official booking PNR confirmations with zero hidden consultation charges.',
      icon: Receipt,
    },
    {
      title: 'Fast Online Payment & Instant Delivery',
      description: 'Pay securely via UPI, Google Pay, PhonePe, Cards or Net Banking, and receive confirmed E-Tickets straight on WhatsApp & Email.',
      icon: Headphones,
    },
    {
      title: 'Direct WhatsApp Booking Desk',
      description: 'Instant response on WhatsApp +91 94215 56220 for quick ticket booking, Tatkal guidance, seat availability, and fare checks.',
      icon: MessageSquare,
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Choose Travel Service Online',
      desc: 'Select train tickets, domestic flight bookings, bus reservations, hotel stays, or holiday tour packages.',
      icon: Layers,
    },
    {
      step: '02',
      title: 'Submit Journey & Passenger Info',
      desc: 'Provide your departure station/city, destination, travel date, quota, class preference, and passenger list.',
      icon: CalendarCheck,
    },
    {
      step: '03',
      title: 'Verify Seats & Pay Securely Online',
      desc: 'Our online desk confirms seat availability and sends a secure digital payment link or UPI QR.',
      icon: SendHorizontal,
    },
    {
      step: '04',
      title: 'Receive Confirmed E-Ticket with PNR',
      desc: 'Your confirmed IRCTC E-Ticket with coach/berth details and PNR is dispatched directly to your WhatsApp & Email within minutes.',
      icon: BadgeCheck,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Why Choose Us Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
            Pan-India Digital Travel Desk
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight">
            Why Book Online with Aazam Travel Agency?
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Trusted Pan-India online travel agency providing confirmed IRCTC train reservations, flights, buses, and holiday packages with instant digital delivery.
          </p>
        </div>

        {/* 6 Verified Claims Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {verifiedReasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all"
              >
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-[#0B2545]">
                    <Icon className="w-5 h-5 text-[#0B2545]" />
                  </div>
                  <h3 className="text-base font-bold text-[#0B2545] leading-snug">
                    {item.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* How It Works Subsection */}
        <div className="mt-12 pt-12 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
              Simple 4-Step Process
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545]">
              How Booking Assistance Works
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Clear, step-by-step assistance from inquiry to confirmed travel documents.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, idx) => {
              const StepIcon = st.icon;
              return (
                <div
                  key={idx}
                  className="relative bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-black text-orange-500 font-mono">
                        {st.step}
                      </span>
                      <div className="p-2 rounded-lg bg-slate-50 text-slate-700">
                        <StepIcon className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="text-base font-bold text-[#0B2545] mb-2 leading-snug">
                      {st.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {st.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Simple & Assisted</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
