import { ExternalLink, GraduationCap, MapPin, Users, Briefcase, ThumbsUp, MessageSquare, Repeat2, Send, MoreHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import linkedinPhoto from '@/assets/linkedin-profile-new.jpg';

export const LinkedInApp = () => {
  return (
    <div className="min-h-full bg-[#f4f2ee] text-neutral-900 pb-10">
      <div className="max-w-3xl mx-auto px-4 pt-5 space-y-3">
        {/* Profile card with banner */}
        <Card className="overflow-hidden p-0 bg-white border border-black/10">
          <div className="h-32 bg-gradient-to-r from-[#0A66C2] via-[#1e88e5] to-[#0A66C2]" />
          <div className="px-6 pb-5 -mt-12">
            <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white shadow-md bg-white">
              <img src={linkedinPhoto} alt="Thanas R" className="w-full h-full object-cover" />
            </div>
            <div className="mt-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-[22px] font-bold leading-tight">Thanas R</h1>
                  <div className="text-[14px] text-neutral-700 mt-0.5">
                    B.Tech CSE (AI/ML) Student at PES University · Builder of 11 Projects
                  </div>
                  <div className="flex items-center gap-1 text-[12.5px] text-neutral-500 mt-1">
                    <MapPin className="w-3.5 h-3.5" /> Bangalore, India · <span className="text-[#0A66C2] font-medium ml-1">Contact info</span>
                  </div>
                  <div className="flex items-center gap-1 text-[12.5px] text-[#0A66C2] font-semibold mt-1">
                    <Users className="w-3.5 h-3.5" /> 100+ followers · 80+ connections
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Button className="bg-[#0A66C2] hover:bg-[#08518f] rounded-full h-8 text-[13px] font-semibold">+ Follow</Button>
                <Button variant="outline" className="rounded-full h-8 text-[13px] font-semibold border-[#0A66C2] text-[#0A66C2] hover:bg-[#eaf3fb]">Message</Button>
                <Button asChild variant="outline" className="rounded-full h-8 text-[13px] font-semibold">
                  <a href="https://www.linkedin.com/in/thanasr/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" /> Open
                  </a>
                </Button>
                <Button variant="outline" className="rounded-full h-8 w-8 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
              </div>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="p-5 bg-white border border-black/10">
          <h2 className="text-[18px] font-semibold mb-2">About</h2>
          <p className="text-[14px] text-neutral-700 leading-relaxed">
            I am a passionate learner who believes in growing a little every day. I'm genuinely interested in coding
            and problem-solving, and I enjoy turning complex challenges into simple, effective solutions. I strive to
            be honest, supportive, and reliable.
          </p>
        </Card>

        {/* Activity */}
        <Card className="p-5 bg-white border border-black/10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[18px] font-semibold">Activity</h2>
            <span className="text-[12px] text-neutral-500">100+ followers</span>
          </div>
          <div className="space-y-3">
            {[
              { who: 'Thanas R posted this', text: 'Just shipped ThanasOS — a desktop-OS-style portfolio built with React + Tailwind. Open to feedback!', likes: 142, comments: 23 },
              { who: 'Thanas R reposted', text: 'Great deep-dive on building real-time UIs. Worth a read for anyone learning React.', likes: 58, comments: 7 },
            ].map((p, i) => (
              <div key={i} className="border border-black/10 rounded-lg p-3">
                <div className="text-[12px] text-neutral-500 mb-1">{p.who}</div>
                <div className="text-[13.5px] text-neutral-800">{p.text}</div>
                <div className="flex items-center gap-5 mt-3 text-[12.5px] text-neutral-600">
                  <span className="inline-flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" />{p.likes}</span>
                  <span className="inline-flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{p.comments}</span>
                  <span className="inline-flex items-center gap-1"><Repeat2 className="w-3.5 h-3.5" />Repost</span>
                  <span className="inline-flex items-center gap-1"><Send className="w-3.5 h-3.5" />Send</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Experience */}
        <Card className="p-5 bg-white border border-black/10">
          <h2 className="text-[18px] font-semibold mb-3">Experience</h2>
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-[#0A66C2] to-[#0a3d7a] flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-[14px]">Independent Builder</div>
              <div className="text-[13px] text-neutral-700">Self · Full-time</div>
              <div className="text-[12px] text-neutral-500">2023 — Present · Bangalore, India</div>
              <div className="text-[13px] text-neutral-700 mt-1">Building web apps, ML experiments and developer tooling.</div>
            </div>
          </div>
        </Card>

        {/* Education */}
        <Card className="p-5 bg-white border border-black/10">
          <h2 className="text-[18px] font-semibold mb-3">Education</h2>
          <div className="space-y-4">
            {[
              { title: 'PES University', sub: 'B.Tech CSE (AI/ML)', when: '2025 - 2029' },
              { title: 'Allen Career Institute', sub: '11th–12th', when: '2023 - 2025' },
              { title: 'Sri Vani Education Centre', sub: '1st–10th', when: '2013 - 2023' },
            ].map((e) => (
              <div key={e.title} className="flex gap-3">
                <div className="w-12 h-12 rounded-md bg-[#eaf3fb] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[#0A66C2]" />
                </div>
                <div>
                  <div className="font-semibold text-[14px]">{e.title}</div>
                  <div className="text-[13px] text-neutral-700">{e.sub}</div>
                  <div className="text-[12px] text-neutral-500">{e.when}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
