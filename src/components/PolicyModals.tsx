import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface PolicyModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const PolicyModals: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {type === 'privacy' ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-50 text-[#0B2545]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B2545]">Privacy Policy</h3>
                <span className="text-xs text-slate-500">Aazam Travel Agency · Pan-India Online Desk</span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                At <strong>Aazam Travel Agency</strong>, we respect your personal privacy. This Privacy Policy details how we handle passenger and enquiry data submitted through our website and WhatsApp communication channels.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">1. Information We Collect</h4>
              <p>
                When you make an inquiry for train tickets, flights, buses, hotels, or holiday packages, we collect your name, mobile phone/WhatsApp number, origin, destination, journey dates, and passenger preferences.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. Purpose of Information</h4>
              <p>
                We use this information exclusively to check availability, calculate applicable travel fares, contact you with itinerary options, and facilitate bookings on your behalf with relevant authorized travel providers (e.g., IRCTC, airlines, bus operators, hotels).
              </p>
              <h4 className="font-bold text-slate-900 text-sm">3. Data Protection & Confidentiality</h4>
              <p>
                We do not sell, rent, or trade your personal information with third-party marketers. Your contact details are stored securely and accessed only by authorized travel agency personnel.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">4. Contacting Us</h4>
              <p>
                For questions regarding your data or to request removal of your inquiry records, contact us directly at +91 94215 56220 or email saazamshaikh@gmail.com.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B2545]">Terms & Conditions</h3>
                <span className="text-xs text-slate-500">Aazam Travel Agency · Pan-India Online Desk</span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                Please review these Terms and Conditions regarding travel enquiry and booking assistance provided by <strong>Aazam Travel Agency</strong>, providing 100% online booking services across India.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">1. Travel Agent Assistance Role</h4>
              <p>
                Aazam Travel Agency acts as an independent travel agent providing ticketing assistance, guidance, itinerary curation, and reservation support. We assist customers with reservations for Indian Railways (IRCTC), domestic and international flights, bus operators, hotels, and holiday tour packages.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">2. Enquiries vs Confirmed Bookings</h4>
              <p>
                Submitting a form or sending a WhatsApp message constitutes an inquiry and does not guarantee ticket issuance or seat allocation. A booking is considered <em>Confirmed</em> only after official confirmation with the relevant transport or hospitality provider and receipt of applicable payments.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">3. Fares, Timings & Carrier Policies</h4>
              <p>
                Fares, seat availability, train schedules, and flight baggage allowances are determined by the respective operating authorities (Indian Railways, airlines, bus fleets) and may fluctuate based on official quotas and real-time rules.
              </p>
              <h4 className="font-bold text-slate-900 text-sm">4. Cancellations and Refunds</h4>
              <p>
                Ticket cancellations and refund amounts are governed strictly by the respective service provider’s cancellation rules (e.g., IRCTC cancellation charges, airline refund policies, hotel cancellation policies) plus applicable agency service charges.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#0B2545] hover:bg-blue-900 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
