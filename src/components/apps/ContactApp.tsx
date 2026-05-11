import type { ReactNode } from 'react';
import {
  Phone,
  MessageSquare,
  Mail,
} from 'lucide-react';
import contactImg from '@/assets/contact-img.png';

// iOS-26 liquid-glass contact card updated to use contact-img.png everywhere.
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
      {/* Heavy darkening + blur layer for legibility */}
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
        {/* Top title */}
        <div className="flex flex-col items-center pt-10 px-4">
          <h1 className="text-[44px] font-bold tracking-tight leading-none drop-shadow-lg text-center">
            Thanas R
          </h1>
        </div>

        {/* Action circles */}
        <div className="flex justify-center gap-4 mt-6 px-4">
          <GlassCircle href="sms:+919141944808" icon={<MessageSquare className="w-6 h-6" strokeWidth={2.4} />} />
          <GlassCircle href="tel:+919141944808" icon={<Phone className="w-6 h-6" strokeWidth={2.4} />} />
          <GlassCircle
            href="https://discord.com/users/677174403859087378"
            icon={<DiscordIcon className="w-6 h-6" />}
          />
          <GlassCircle href="mailto:thanas5.rd@gmail.com" icon={<Mail className="w-6 h-6" strokeWidth={2.4} />} />
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
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z" />
  </svg>
);

const LinkedInIcon = ({ className = '' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <circle cx="4.983" cy="5.009" r="2.188" />
    <path d="M9.237 8.855v12.139h3.769v-6.003c0-1.584.298-3.118 2.262-3.118 1.937 0 1.961 1.811 1.961 3.218v5.904H21v-6.657c0-3.27-.704-5.783-4.526-5.783-1.835 0-3.065 1.007-3.568 1.96h-.051v-1.66H9.237zm-6.142 0H6.87v12.139H3.095z" />
  </svg>
);

const GitHubIcon = ({ className = '' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
    />
  </svg>
);

const PortfolioIcon = ({ className = '' }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M8.465 11.293c1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707c-.943-.944-2.199-1.465-3.535-1.465s-2.592.521-3.535 1.465L4.929 12a5.008 5.008 0 0 0 0 7.071 4.983 4.983 0 0 0 3.535 1.462A4.982 4.982 0 0 0 12 19.071l.707-.707-1.414-1.414-.707.707a3.007 3.007 0 0 1-4.243 0 3.005 3.005 0 0 1 0-4.243l2.122-2.121z" />
    <path d="m12 4.929-.707.707 1.414 1.414.707-.707a3.007 3.007 0 0 1 4.243 0 3.005 3.005 0 0 1 0 4.243l-2.122 2.121c-1.133 1.133-3.109 1.133-4.242 0L10.586 12l-1.414 1.414.707.707c.943.944 2.199 1.465 3.535 1.465s2.592-.521 3.535-1.465L19.071 12a5.008 5.008 0 0 0 0-7.071 5.006 5.006 0 0 0-7.071 0z" />
  </svg>
);
