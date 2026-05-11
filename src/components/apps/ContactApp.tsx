import type { ReactNode } from 'react';
import {
  Phone,
  MessageSquare,
  Mail,
} from 'lucide-react';
import contactImg from '@/assets/contact-img.png';
import newProfile from '@/assets/newprofile.png';

// iOS-26 liquid-glass contact card updated
export const ContactApp = () => {
  return (
    <div
      className="relative h-full w-full overflow-hidden text-white"
      style={{
        backgroundImage: `url(${contactImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Blur overlay */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: 'blur(40px) saturate(140%)',
          WebkitBackdropFilter: 'blur(40px) saturate(140%)',
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.28) 35%, rgba(0,0,0,0.60) 100%)',
        }}
      />

      <div className="relative z-10 h-full w-full overflow-y-auto no-scrollbar pb-8">
        {/* Top profile */}
        <div className="flex flex-col items-center pt-8 px-4">
          <div
            className="rounded-full overflow-hidden ring-1 ring-white/20 shadow-2xl"
            style={{
              width: 132,
              height: 132,
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
            }}
          >
            <img
              src={newProfile}
              alt="Thanas R"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="mt-4 text-[44px] font-bold tracking-tight leading-none drop-shadow-lg text-center">
            Thanas R
          </h1>
        </div>

        {/* Action circles */}
        <div className="flex justify-center gap-4 mt-6 px-4">
          <GlassCircle
            href="sms:+919141944808"
            icon={<MessageSquare className="w-6 h-6" strokeWidth={2.4} />}
          />
          <GlassCircle
            href="tel:+919141944808"
            icon={<Phone className="w-6 h-6" strokeWidth={2.4} />}
          />
          <GlassCircle
            href="https://discord.com/users/677174403859087378"
            icon={<DiscordIcon className="w-6 h-6" />}
          />
          <GlassCircle
            href="mailto:thanas5.rd@gmail.com"
            icon={<Mail className="w-6 h-6" strokeWidth={2.4} />}
          />
        </div>

        {/* Info groups */}
        <div className="mt-6 mx-4">
          <GlassPanel className="divide-y divide-white/10">
            <Field
              label="mobile"
              value="+91 91419 44808"
              right={<Phone className="w-5 h-5 text-yellow-400" />}
            />
            <Field
              label="email"
              value="thanas5.rd@gmail.com"
              right={<Mail className="w-5 h-5 text-yellow-400" />}
            />
            <Field
              label="discord"
              value="DarkSpacePirate"
              right={<DiscordIcon className="w-5 h-5 text-yellow-400" />}
            />
          </GlassPanel>
        </div>

        {/* Social links */}
        <div className="mt-4 mx-4">
          <GlassPanel className="divide-y divide-white/10">
            <Field
              label="linkedin"
              value="linkedin.com/in/thanasr"
              right={<LinkedInIcon className="w-5 h-5 text-yellow-400" />}
            />
            <Field
              label="github"
              value="github.com/Thanas-R"
              right={<GitHubIcon className="w-5 h-5 text-yellow-400" />}
            />
            <Field
              label="portfolio"
              value="thanas.vercel.app"
              right={<PortfolioIcon className="w-5 h-5 text-yellow-400" />}
            />
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};

const GlassCircle = ({ icon, href }: { icon: ReactNode; href?: string }) => (
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
  children: ReactNode;
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
  label: string;
  value: string;
  right?: ReactNode;
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

const DiscordIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35z" />
  </svg>
);

const LinkedInIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
    <circle cx="4.983" cy="5.009" r="2.188" />
    <path d="M9.237 8.855v12.139h3.769v-6.003c0-1.584.298-3.118 2.262-3.118 1.937 0 1.961 1.811 1.961 3.218v5.904H21v-6.657c0-3.27-.704-5.783-4.526-5.783-1.835 0-3.065 1.007-3.568 1.96h-.051v-1.66H9.237zm-6.142 0H6.87v12.139H3.095z" />
  </svg>
);

const GitHubIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465..." />
  </svg>
);

const PortfolioIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M8.465 11.293..." />
  </svg>
);
