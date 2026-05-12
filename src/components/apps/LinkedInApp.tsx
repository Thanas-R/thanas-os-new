import { GraduationCap, MapPin, ThumbsUp, MessageSquare, Repeat2, Send, MoreHorizontal, ShieldCheck, Award, Globe, UserPlus } from 'lucide-react';
import { useMacOS } from '@/contexts/MacOSContext';
import linkedinPhoto from '@/assets/linkedin-profile-new.jpg';
import linkedinBanner from '@/assets/linkedin-banner.png';
import pesLogo from '@/assets/pes-logo.png';
import allenLogo from '@/assets/allen-logo.png';
import sriVaniLogo from '@/assets/sri-vani-logo.png';
import virdisProject from '@/assets/virdis-project.png';

export const LinkedInApp = () => {
  const { settings } = useMacOS();
  const dark = settings.theme === 'dark';

  const t = dark
    ? {
        page: '#1b1f23', card: '#1d2226', cardBorder: 'rgba(255,255,255,0.08)',
        text: '#e8e6e3', sub: '#a8aeb4', muted: '#8b9298',
        link: '#70b5f9', divider: 'rgba(255,255,255,0.08)', chipBg: 'rgba(255,255,255,0.06)',
      }
    : {
        page: '#f4f2ee', card: '#ffffff', cardBorder: 'rgba(0,0,0,0.08)',
        text: '#1d2226', sub: '#404a52', muted: '#666',
        link: '#0a66c2', divider: 'rgba(0,0,0,0.08)', chipBg: '#f3f2ef',
      };

  const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-lg overflow-hidden ${className}`} style={{ background: t.card, border: `1px solid ${t.cardBorder}` }}>
      {children}
    </div>
  );

  return (
    <div className="min-h-full pb-10" style={{ background: t.page, color: t.text }}>
      <div className="max-w-3xl mx-auto px-4 pt-5 space-y-3">
        {/* Profile */}
        <Card>
          <div className="h-36 relative overflow-hidden">
            <img src={linkedinBanner} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="px-6 pb-5 -mt-14 relative">
            <div className="flex items-end justify-between">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 shadow-md" style={{ background: t.card, ['--tw-ring-color' as any]: t.card }}>
                <img src={linkedinPhoto} alt="Thanas R" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <img src={pesLogo} alt="PES" className="w-7 h-7 rounded object-contain" />
                <span className="text-[13px] font-semibold">PES University</span>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[24px] font-bold leading-tight">Thanas R</h1>
                <ShieldCheck className="w-5 h-5" style={{ color: t.link }} />
                <span className="text-[13px]" style={{ color: t.sub }}>He/Him</span>
              </div>
              <div className="text-[15px] mt-1" style={{ color: t.text }}>
                B.Tech CSE [AIML] Student | PES University
              </div>
              <div className="flex items-center gap-1 text-[13px] mt-1" style={{ color: t.sub }}>
                <MapPin className="w-3.5 h-3.5" />
                <span>Bengaluru, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-2 text-[13px] mt-1">
                <img src={pesLogo} alt="PES" className="w-4 h-4 object-contain" />
                <span style={{ color: t.sub }}>PES University</span>
              </div>
              <div className="text-[13px] font-semibold mt-1" style={{ color: t.link }}>
                98 connections
              </div>

              <div className="mt-4">
                <a
                  href="https://www.linkedin.com/in/thanasr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 h-9 rounded-full text-[14px] font-semibold text-white"
                  style={{ background: '#0a66c2' }}
                >
                  <UserPlus className="w-4 h-4" /> Connect
                </a>
              </div>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card>
          <div className="p-5">
            <h2 className="text-[20px] font-semibold mb-2">About</h2>
            <div className="text-[14px] leading-relaxed space-y-3" style={{ color: t.sub }}>
              <p>I am a passionate learner who believes in growing a little every day. I'm genuinely interested in coding and problem-solving, and I enjoy turning complex challenges into simple, effective solutions.</p>
              <p>While I take my work seriously, I also value creating a positive and cheerful environment. I believe a good laugh can go a long way in building strong, collaborative teams.</p>
              <p>I strive to be honest, supportive, and reliable, taking responsibility or leading when needed while contributing and learning with the team.</p>
              <p>More about me on: <span style={{ color: t.link }} className="hover:underline cursor-pointer">thanas.vercel.app</span></p>
            </div>
            <div className="mt-4 rounded-lg border p-4 flex items-center gap-3" style={{ borderColor: t.divider }}>
              <Award className="w-5 h-5" style={{ color: t.text }} />
              <div>
                <div className="text-[14px] font-semibold">Top skills</div>
                <div className="text-[13px]" style={{ color: t.sub }}>Artificial Intelligence (AI) • Full-Stack Development • Team Leadership • Creative Problem Solving</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Activity */}
        <Card>
          <div className="p-5">
            <h2 className="text-[20px] font-semibold">Activity</h2>
            <div className="text-[13px] font-semibold mb-4" style={{ color: t.link }}>101 followers</div>

            <div className="rounded-lg border p-4" style={{ borderColor: t.divider }}>
              <div className="flex items-start gap-3">
                <img src={linkedinPhoto} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-[14px] font-semibold">
                    Thanas R <ShieldCheck className="w-3.5 h-3.5" style={{ color: t.link }} /> <span className="font-normal" style={{ color: t.sub }}>· You</span>
                  </div>
                  <div className="text-[12px]" style={{ color: t.sub }}>B.Tech CSE [AIML] Student | PES University</div>
                  <div className="text-[12px] flex items-center gap-1" style={{ color: t.sub }}>4w · <Globe className="w-3 h-3" /></div>
                </div>
                <MoreHorizontal className="w-5 h-5 opacity-70" />
              </div>
              <div className="text-[14px] mt-2 space-y-2" style={{ color: t.text }}>
                <p>Our team made it to the final round of the SustainX hackathon, finishing in the top 6 at an event hosted by <span style={{ color: t.link }}>Solaris PESU</span> at PESU EC Campus</p>
                <p>Along with <span style={{ color: t.link }}>Tanay S</span> and <span style={{ color: t.link }}>Vajjhala Sai Muralidhar</span>, we built "Virdis", a satellite powered platform for agricultural and land analytics that helps users analyze regions and get automated, visual crop planning insights based on real geospatial data and databases</p>
                <p>Would love for you to check it out:</p>
                <p>Live demo: <span style={{ color: t.link }}>https://virdis.vercel.app/</span></p>
                <p>GitHub Repository: <span style={{ color: t.link }}>https://lnkd.in/gPMM86GZ</span></p>
                <p>Project Detail page: <span style={{ color: t.link }}>https://lnkd.in/gV_Rqfhj</span></p>
                <p>Hope you like it. Always open to feedback</p>
              </div>
              <div className="mt-3 rounded-lg overflow-hidden border" style={{ borderColor: t.divider }}>
                <img src={virdisProject} alt="Virdis project" className="w-full h-auto block" />
              </div>
              <div className="flex items-center gap-5 mt-3 text-[12.5px]" style={{ color: t.sub }}>
                <span className="inline-flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" />46</span>
                <span className="inline-flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />5 comments</span>
                <span className="inline-flex items-center gap-1"><Repeat2 className="w-3.5 h-3.5" />1 repost</span>
                <span className="inline-flex items-center gap-1 ml-auto"><Send className="w-3.5 h-3.5" />Send</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Education */}
        <Card>
          <div className="p-5">
            <h2 className="text-[20px] font-semibold mb-3">Education</h2>
            <div className="space-y-4">
              {[
                { title: 'PES University', sub: 'Bachelor of Technology, Computer Science and Engineering (AI&ML)', when: '2025 – 2029', logo: pesLogo },
                { title: 'ALLEN', sub: 'JEE Preparation', when: '2023 – 2025', logo: allenLogo },
                { title: 'Sri Vani Education Centre', sub: 'Schooling', when: '2013 – 2023', logo: sriVaniLogo },
              ].map((e) => (
                <div key={e.title} className="flex gap-3">
                  <div className="w-12 h-12 rounded-md flex items-center justify-center" style={{ background: t.chipBg }}>
                    {e.logo
                      ? <img src={e.logo} alt="" className="w-10 h-10 object-contain" />
                      : <GraduationCap className="w-6 h-6" style={{ color: t.link }} />}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-[15px]">{e.title}</div>
                    {e.sub && <div className="text-[13px]" style={{ color: t.sub }}>{e.sub}</div>}
                    <div className="text-[12.5px]" style={{ color: t.muted }}>{e.when}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Skills */}
        <Card>
          <div className="p-5">
            <h2 className="text-[20px] font-semibold mb-3">Skills</h2>
            <div className="space-y-3">
              <div>
                <div className="text-[15px] font-semibold">Python (Programming Language)</div>
                <div className="text-[13px] mt-0.5" style={{ color: t.sub }}>1 endorsement</div>
              </div>
              <div className="border-t" style={{ borderColor: t.divider }} />
              <div className="text-[15px] font-semibold">Full-Stack Development</div>
              <div className="border-t" style={{ borderColor: t.divider }} />
              <div className="text-[15px] font-semibold">Artificial Intelligence (AI)</div>
            </div>
          </div>
        </Card>

        {/* Languages */}
        <Card>
          <div className="p-5">
            <h2 className="text-[20px] font-semibold mb-3">Languages</h2>
            <div className="space-y-3">
              <div>
                <div className="text-[15px] font-semibold">English</div>
                <div className="text-[13px]" style={{ color: t.sub }}>Native or bilingual proficiency</div>
              </div>
              <div className="border-t" style={{ borderColor: t.divider }} />
              <div>
                <div className="text-[15px] font-semibold">Hindi</div>
                <div className="text-[13px]" style={{ color: t.sub }}>Limited working proficiency</div>
              </div>
              <div className="border-t" style={{ borderColor: t.divider }} />
              <div>
                <div className="text-[15px] font-semibold">Tamil</div>
                <div className="text-[13px]" style={{ color: t.sub }}>Native proficiency</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
