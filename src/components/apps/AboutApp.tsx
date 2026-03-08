import { MapPin, GraduationCap, Cake } from 'lucide-react';
import profilePhoto from '@/assets/profile-photo-new.jpg';

export const AboutApp = () => {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start gap-6">
        <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg">
          <img src={profilePhoto} alt="Thanas R" className="w-full h-full object-cover" loading="eager" decoding="async" />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">Thanas R</h1>
          <p className="text-muted-foreground text-lg mb-4">Developer & creative problem-solver. Building thoughtful digital experiences with code.</p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Cake className="w-4 h-4" />
              <span>18 years old</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="w-4 h-4" />
              <span>B.Tech CSE (AI/ML) at PES University</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Bangalore, India</span>
            </div>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold mb-3">About Me</h2>
        <p className="text-base leading-relaxed">
          I am a passionate learner who believes in growing a little every day. I'm genuinely interested in coding 
          and problem-solving, and I enjoy turning complex challenges into simple, effective solutions. While I take 
          my work seriously, I also value creating a positive and cheerful environment.
        </p>
        <p className="text-base leading-relaxed mt-3">
          I strive to be honest, supportive, and reliable. I combine technical skills with UI/UX knowledge to create 
          intuitive, powerful applications. Currently pursuing B.Tech in Computer Science Engineering with a specialization 
          in AI/ML at PES University.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-secondary rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-primary">6+</div>
          <div className="text-sm text-muted-foreground mt-1">Years Coding</div>
        </div>
        <div className="bg-secondary rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-primary">11</div>
          <div className="text-sm text-muted-foreground mt-1">Projects Built</div>
        </div>
        <div className="bg-secondary rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-primary">∞</div>
          <div className="text-sm text-muted-foreground mt-1">Learning Goals</div>
        </div>
      </div>

      <a
        href="https://thanas.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-4 bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors mt-4"
      >
        <ExternalLink className="w-5 h-5 text-primary" />
        <div>
          <span className="text-sm font-semibold text-primary">Visit my main portfolio</span>
          <p className="text-xs text-muted-foreground">thanas.vercel.app — the latest and fully functional version</p>
        </div>
      </a>
    </div>
  );
};
