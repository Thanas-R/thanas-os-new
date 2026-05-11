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
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3c-.161.287-.35.674-.479.979a18.27 18.27 0 0 0-8.158 0 9.755 9.755 0 0 0-.487-.979 19.736 19.736 0 0 0-3.76 1.37C1.298 8.037.653 11.617.977 15.147A19.9 19.9 0 0 0 6.13 17.7c.42-.574.794-1.181 1.11-1.82-.607-.23-1.186-.516-1.726-.85.144-.105.285-.215.42-.328 3.327 1.56 6.937 1.56 10.224 0 .137.113.278.223.42.328-.54.334-1.12.62-1.727.85.317.639.69 1.246 1.111 1.82a19.87 19.87 0 0 0 5.153-2.553c.38-4.09-.65-7.637-2.798-10.778zM8.02 13.12c-.998 0-1.818-.92-1.818-2.05 0-1.13.805-2.05 1.818-2.05 1.02 0 1.833.928 1.818 2.05 0 1.13-.805 2.05-1.818 2.05zm7.96 0c-.998 0-1.818-.92-1.818-2.05 0-1.13.805-2.05 1.818-2.05 1.02 0 1.833.928 1.818 2.05 0 1.13-.798 2.05-1.818 2.05z"/>
  </svg>
);

const LinkedInIcon = ({ className = '' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="currentColor">
    <circle cx="4.983" cy="5.009" r="2.188" />
    <path d="M9.237 8.855v12.139h3.769v-6.003c0-1.584.298-3.118 2.262-3.118 1.937 0 1.961 1.811 1.961 3.218v5.904H21v-6.657c0-3.27-.704-5.783-4.526-5.783-1.835 0-3.065 1.007-3.568 1.96h-.051v-1.66H9.237zm-6.142 0H6.87v12.139H3.095z" />
  </svg>
);

const GitHubIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 .5C5.648.5.5 5.648.5 12a11.5 11.5 0 0 0 7.86 10.92c.575.106.785-.25.785-.556 0-.274-.01-1-.015-1.962-3.197.695-3.872-1.54-3.872-1.54-.523-1.328-1.277-1.682-1.277-1.682-1.045-.714.08-.7.08-.7 1.155.082 1.763 1.186 1.763 1.186 1.026 1.758 2.69 1.25 3.345.956.104-.743.402-1.25.732-1.538-2.552-.29-5.236-1.276-5.236-5.682 0-1.255.45-2.282 1.186-3.086-.12-.29-.514-1.46.112-3.043 0 0 .967-.31 3.17 1.178a10.99 10.99 0 0 1 5.77 0c2.2-1.488 3.165-1.178 3.165-1.178.628 1.583.234 2.753.115 3.043.74.804 1.184 1.831 1.184 3.086 0 4.418-2.688 5.388-5.25 5.673.413.356.78 1.058.78 2.133 0 1.54-.014 2.78-.014 3.16 0 .31.207.668.79.555A11.502 11.502 0 0 0 23.5 12C23.5 5.648 18.352.5 12 .5z"/>
  </svg>
);

const PortfolioIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 14L21 3"/>
    <path d="M15 3h6v6"/>
    <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>
  </svg>
);
