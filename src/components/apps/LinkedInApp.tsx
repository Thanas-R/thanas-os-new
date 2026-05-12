import { ExternalLink, GraduationCap, MapPin, Plus, Pencil, ArrowRight, ThumbsUp, MessageSquare, Repeat2, Send, MoreHorizontal, ShieldCheck, Award, Globe } from 'lucide-react';
import { useMacOS } from '@/contexts/MacOSContext';
import linkedinPhoto from '@/assets/linkedin-profile-new.jpg';

const PES_LOGO = 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c1/PES_University_logo.png/120px-PES_University_logo.png';

export const LinkedInApp = () => {
  const { settings } = useMacOS();
  const dark = settings.theme === 'dark';

  // Theme tokens
  const t = dark
    ? {
        page: '#1b1f23',
        card: '#1d2226',
        cardBorder: 'rgba(255,255,255,0.08)',
        text: '#e8e6e3',
        sub: '#a8aeb4',
        muted: '#8b9298',
        link: '#70b5f9',
        linkBg: 'rgba(112,181,249,0.12)',
        chipBg: 'rgba(255,255,255,0.06)',
        divider: 'rgba(255,255,255,0.08)',
        pillBg: 'transparent',
        pillBorder: '#70b5f9',
      }
    : {
        page: '#f4f2ee',
        card: '#ffffff',
        cardBorder: 'rgba(0,0,0,0.08)',
        text: '#1d2226',
        sub: '#404a52',
        muted: '#666',
        link: '#0a66c2',
        linkBg: '#eaf3fb',
        chipBg: '#f3f2ef',
        divider: 'rgba(0,0,0,0.08)',
        pillBg: '#ffffff',
        pillBorder: '#0a66c2',
      };

  const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-lg overflow-hidden ${className}`} style={{ background: t.card, border: `1px solid ${t.cardBorder}` }}>
      {children}
    </div>
  );

  return (
    <div className="min-h-full pb-10" style={{ background: t.page, color: t.text }}>
      <div className="max-w-3xl mx-auto px-4 pt-5 space-y-3">
        {/* Profile card */}
        <Card>
          <div className="h-36 relative" style={{ background: 'linear-gradient(135deg,#1a2a1f 0%,#2c3a2a 60%,#161e1a 100%)' }}>
            <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center"><Pencil className="w-3.5 h-3.5" /></button>
          </div>
          <div className="px-6 pb-5 -mt-14 relative">
            <div className="flex items-end justify-between">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 shadow-md" style={{ background: t.card, ['--tw-ring-color' as any]: t.card }}>
                <img src={linkedinPhoto} alt="Thanas R" className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <img src={PES_LOGO} alt="PES" className="w-7 h-7 rounded" />
                <span className="text-[13px] font-semibold">PES University</span>
              </div>
            </div>
            <button className="absolute right-6 top-16 w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center" style={{ color: t.text }}><Pencil className="w-3.5 h-3.5" /></button>

            <div className="mt-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[24px] font-bold leading-tight">Thanas (Thanas Ramesh) R</h1>
                <ShieldCheck className="w-5 h-5" style={{ color: t.link }} />
                <span className="text-[13px]" style={{ color: t.sub }}>He/Him</span>
              </div>
              <div className="text-[15px] mt-1" style={{ color: t.text }}>
                B.Tech CSE [AIML] Student | PES University
              </div>
              <div className="flex items-center gap-1 text-[13px] mt-1" style={{ color: t.sub }}>
                <span>Bengaluru, Karnataka, India</span>
                <span>·</span>
                <span style={{ color: t.link }} className="font-medium hover:underline cursor-pointer">Contact info</span>
              </div>
              <div className="text-[13px] font-semibold mt-1" style={{ color: t.link }}>
                98 connections
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <button className="px-4 h-8 rounded-full text-[13px] font-semibold text-white" style={{ background: '#0a66c2' }}>Open to</button>
                <button className="px-4 h-8 rounded-full text-[13px] font-semibold border" style={{ borderColor: t.pillBorder, color: t.link, background: t.pillBg }}>
                  <span className="inline-flex items-center gap-1"><Plus className="w-3.5 h-3.5" />Add section</span>
                </button>
                <button className="px-4 h-8 rounded-full text-[13px] font-semibold border" style={{ borderColor: t.pillBorder, color: t.link, background: t.pillBg }}>
                  Enhance profile
                </button>
                <button className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ borderColor: t.divider, color: t.text }}><MoreHorizontal className="w-4 h-4" /></button>
                <a href="https://www.linkedin.com/in/thanasr/" target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-semibold px-3 h-8 rounded-full border" style={{ borderColor: t.divider, color: t.text }}>
                  <ExternalLink className="w-3.5 h-3.5" /> Open
                </a>
              </div>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card>
          <div className="p-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[20px] font-semibold">About</h2>
              <Pencil className="w-4 h-4 opacity-70" />
            </div>
            <div className="text-[14px] leading-relaxed space-y-3" style={{ color: t.sub }}>
              <p>I am a passionate learner who believes in growing a little every day. I'm genuinely interested in coding and problem-solving, and I enjoy turning complex challenges into simple, effective solutions.</p>
              <p>While I take my work seriously, I also value creating a positive and cheerful environment. I believe a good laugh can go a long way in building strong, collaborative teams.</p>
              <p>I strive to be honest, supportive, and reliable, taking responsibility or leading when needed while contributing and learning with the team.</p>
              <p>More about me on: <span style={{ color: t.link }} className="hover:underline cursor-pointer">thanas.vercel.app</span></p>
            </div>
            <div className="mt-4 rounded-lg border p-4 flex items-center justify-between" style={{ borderColor: t.divider }}>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5" style={{ color: t.text }} />
                <div>
                  <div className="text-[14px] font-semibold">Top skills</div>
                  <div className="text-[13px]" style={{ color: t.sub }}>Artificial Intelligence (AI) • Full-Stack Development • Team Leadership • Creative Problem Solving</div>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 opacity-70" />
            </div>
          </div>
        </Card>

        {/* Activity */}
        <Card>
          <div className="p-5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[20px] font-semibold">Activity</h2>
              <div className="flex items-center gap-2">
                <button className="px-3 h-8 rounded-full text-[13px] font-semibold border" style={{ borderColor: t.pillBorder, color: t.link }}>Create a post</button>
                <Pencil className="w-4 h-4 opacity-70" />
              </div>
            </div>
            <div className="text-[13px] font-semibold mb-3" style={{ color: t.link }}>101 followers</div>
            <div className="flex gap-2 mb-3">
              {['Posts','Comments','Images'].map((p, i) => (
                <button key={p} className={`px-3 py-1 text-[13px] rounded-full font-semibold ${i===0 ? 'text-white' : ''}`}
                  style={i===0 ? { background: '#0e6938' } : { border: `1px solid ${t.divider}`, color: t.text }}>{p}</button>
              ))}
            </div>
            <div className="rounded-lg border p-4" style={{ borderColor: t.divider }}>
              <div className="flex items-start gap-3">
                <img src={linkedinPhoto} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-[14px] font-semibold">Thanas R <ShieldCheck className="w-3.5 h-3.5" style={{ color: t.link }} /> <span className="font-normal" style={{ color: t.sub }}>· You</span></div>
                  <div className="text-[12px]" style={{ color: t.sub }}>B.Tech CSE [AIML] Student | PES University</div>
                  <div className="text-[12px] flex items-center gap-1" style={{ color: t.sub }}>4w · <Globe className="w-3 h-3" /></div>
                </div>
                <MoreHorizontal className="w-5 h-5 opacity-70" />
              </div>
              <div className="text-[14px] mt-2" style={{ color: t.text }}>
                Our team made it to the final round of the SustainX hackathon, finishing in the top 6 at an event hosted… <span style={{ color: t.muted }}>more</span>
              </div>
              <div className="flex items-center gap-5 mt-3 text-[12.5px]" style={{ color: t.sub }}>
                <span className="inline-flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" />5</span>
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
                { title: 'PES University', sub: 'Bachelor of Technology, Computer Science and Engineering (AI&ML)', when: '2025 – 2029', logo: PES_LOGO },
                { title: 'ALLEN', sub: '', when: '2023 – 2025', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/ALLEN_Career_Institute_Logo.png/120px-ALLEN_Career_Institute_Logo.png' },
                { title: 'Sri Vani Education Centre', sub: '', when: '2013 – 2023' },
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
                  <Pencil className="w-4 h-4 opacity-70" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Skills */}
        <Card>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[20px] font-semibold">Skills (12)</h2>
              <div className="flex items-center gap-2 opacity-70"><Plus className="w-4 h-4" /><Pencil className="w-4 h-4" /></div>
            </div>
            <div className="text-[15px] font-semibold">Python (Programming Language)</div>
            <div className="text-[13px] mt-1" style={{ color: t.sub }}>1 endorsement</div>
            <div className="border-t my-3" style={{ borderColor: t.divider }} />
            <div className="text-[15px] font-semibold">Full-Stack Development</div>
            <div className="border-t mt-3 mb-2" style={{ borderColor: t.divider }} />
            <button className="w-full text-center py-2 text-[14px] font-semibold rounded hover:bg-white/5">Show all <ArrowRight className="inline w-4 h-4 ml-1" /></button>
          </div>
        </Card>

        {/* Languages */}
        <Card>
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[20px] font-semibold">Languages (3)</h2>
              <div className="flex items-center gap-2 opacity-70"><Plus className="w-4 h-4" /><Pencil className="w-4 h-4" /></div>
            </div>
            <div className="text-[15px] font-semibold">English</div>
            <div className="text-[13px]" style={{ color: t.sub }}>Native or bilingual proficiency</div>
            <div className="border-t my-3" style={{ borderColor: t.divider }} />
            <div className="text-[15px] font-semibold">Hindi</div>
            <div className="text-[13px]" style={{ color: t.sub }}>Limited working proficiency</div>
            <div className="border-t mt-3 mb-2" style={{ borderColor: t.divider }} />
            <button className="w-full text-center py-2 text-[14px] font-semibold rounded hover:bg-white/5">Show all <ArrowRight className="inline w-4 h-4 ml-1" /></button>
          </div>
        </Card>
      </div>
    </div>
  );
};
