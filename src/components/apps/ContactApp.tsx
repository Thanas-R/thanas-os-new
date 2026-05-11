import { Phone, MessageSquare, Video, Mail, ChevronLeft, MapPin, ChevronRight } from 'lucide-react';
import profilePhoto from '@/assets/profile-photo-new.jpg';

// iOS-26 liquid-glass contact card matching the supplied reference screenshot.
export const ContactApp = () => {
  return (
    <div
      className="relative h-full w-full overflow-hidden text-white"
      style={{
        backgroundImage: `url(${profilePhoto})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Heavy darkening + blur layer for legibility */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: 'blur(40px) saturate(140%)',
          WebkitBackdropFilter: 'blur(40px) saturate(140%)',
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.25) 30%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      <div className="relative z-10 h-full w-full overflow-y-auto no-scrollbar">
        {/* Top chrome */}
        <div className="flex items-center justify-between px-4 pt-3">
          <button className="w-10 h-10 rounded-full liquid-glass-dark flex items-center justify-center backdrop-blur-2xl">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <div className="text-[11px] tracking-widest font-bold opacity-90">MICKEY</div>
          </div>
          <button className="px-4 h-9 rounded-full liquid-glass-dark backdrop-blur-2xl text-[14px] font-medium">
            Edit
          </button>
        </div>

        {/* Name */}
        <div className="text-center mt-3 px-4">
          <h1 className="text-[44px] font-bold tracking-tight leading-none drop-shadow-lg">
            Thanas R
          </h1>
        </div>

        {/* Glass action circles — clear glass, only the icon visible */}
        <div className="flex justify-center gap-4 mt-6 px-4">
          <GlassCircle href="sms:+919141944808" icon={<MessageSquare className="w-6 h-6" strokeWidth={2.4} />} />
          <GlassCircle href="tel:+919141944808" icon={<Phone className="w-6 h-6" strokeWidth={2.4} />} />
          <GlassCircle href="https://meet.google.com/" icon={<Video className="w-6 h-6" strokeWidth={2.4} />} />
          <GlassCircle href="mailto:thanas5.rd@gmail.com" icon={<Mail className="w-6 h-6" strokeWidth={2.4} />} />
        </div>

        {/* Shared name & photo card */}
        <div className="mt-6 mx-4">
          <GlassPanel className="px-3 py-2.5 flex items-center gap-3">
            <img
              src={profilePhoto}
              alt="Thanas"
              className="w-12 h-12 rounded-full object-cover ring-1 ring-white/20"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[16px] font-semibold leading-tight">Shared Name and Photo</div>
              <div className="text-[14px] text-white/65 leading-tight">Contacts Only</div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/55" />
          </GlassPanel>
        </div>

        {/* Info groups */}
        <div className="mt-6 mx-4">
          <GlassPanel className="divide-y divide-white/10">
            <Field
              accent="#FFD60A"
              label="mobile"
              value="+91 91419 44808"
              right={<Phone className="w-5 h-5 text-yellow-400" />}
            />
            <Field
              accent="#FFD60A"
              label="email"
              value="thanas5.rd@gmail.com"
              right={<Mail className="w-5 h-5 text-yellow-400" />}
            />
            <Field
              accent="#FFD60A"
              label="discord"
              value="DarkSpacePirate"
              right={
                <span className="text-yellow-400 font-bold text-[14px]">DC</span>
              }
            />
          </GlassPanel>
        </div>

        {/* Address group */}
        <div className="mt-4 mx-4 pb-8">
          <GlassPanel className="px-4 py-3 relative">
            <div className="text-[14px] text-yellow-400 font-medium leading-tight mb-1">
              home
            </div>
            <div className="text-[18px] leading-snug">
              975 , 2nd E cross
              <br />
              3rd Stage , 3rd Block , 4th Main
              <br />
              Bengaluru 560079
              <br />
              Karnataka
              <br />
              India
            </div>
            <MapPin className="w-5 h-5 text-yellow-400 absolute right-4 top-1/2 -translate-y-1/2" />
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};

const GlassCircle = ({ icon, href }: { icon: React.ReactNode; href?: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="w-16 h-16 rounded-full flex items-center justify-center transition-transform active:scale-95"
    style={{
      background: 'rgba(255,255,255,0.10)',
      backdropFilter: 'blur(30px) saturate(180%)',
      WebkitBackdropFilter: 'blur(30px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.18)',
      boxShadow:
        'inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.25)',
    }}
  >
    {icon}
  </a>
);

const GlassPanel = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-2xl ${className}`}
    style={{
      background: 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(30px) saturate(180%)',
      WebkitBackdropFilter: 'blur(30px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.10)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
    }}
  >
    {children}
  </div>
);

const Field = ({
  label,
  value,
  right,
}: {
  accent: string;
  label: string;
  value: string;
  right?: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <div className="flex-1 min-w-0">
      <div className="text-[13px] text-yellow-400 font-medium leading-tight mb-0.5">
        {label}
      </div>
      <div className="text-[18px] leading-tight truncate">{value}</div>
    </div>
    {right}
  </div>
);
