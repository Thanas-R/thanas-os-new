import { MapPin, GraduationCap, Cake } from 'lucide-react';
import profilePhoto from '@/assets/profile-photo.jpg';

export const AboutApp = () => {
  return (
    <div className="p-8 space-y-6">
      {/* Welcome Section */}
      <div className="bg-primary/10 border-2 border-primary/20 rounded-xl p-6 text-center">
        <h2 className="text-2xl font-bold mb-3">Welcome to My Portfolio Website!</h2>
        <p className="text-base text-muted-foreground">
          Feel free to navigate around the website to learn more about me, my skills, projects, and journey. 
          Click on the different apps in the dock below to explore!
        </p>
      </div>

      <div className="flex items-start gap-6">
        <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg">
          <img src={profilePhoto} alt="Thanas R" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">Thanas R</h1>
          <p className="text-muted-foreground text-lg mb-4">AI/ML Engineering Student & Prompt Engineering Expert</p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Cake className="w-4 h-4" />
              <span>18 years old</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <GraduationCap className="w-4 h-4" />
              <span>B.Tech CSE [AIML] at PES University</span>
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
          Hello! I'm Thanas — a passionate learner with 5+ years of coding experience. I believe in growing a little every day 
          and I'm deeply interested in coding and problem-solving. I enjoy the challenge of turning complex problems 
          into simple, effective solutions.
        </p>
        <p className="text-base leading-relaxed mt-3">
          What sets me apart is my expertise in <strong>prompt engineering</strong> — I'm known for crafting precise, 
          effective prompts that maximize AI potential. I combine technical skills with UI/UX knowledge to create 
          intuitive, powerful applications.
        </p>
        <p className="text-base leading-relaxed mt-3">
          Currently pursuing B.Tech in Computer Science Engineering with a specialization in AI/ML at PES University, 
          I'm constantly exploring new technologies and building projects that solve real-world problems.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-secondary rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-primary">5+</div>
          <div className="text-sm text-muted-foreground mt-1">Years Coding</div>
        </div>
        <div className="bg-secondary rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-primary">3+</div>
          <div className="text-sm text-muted-foreground mt-1">Projects Built</div>
        </div>
        <div className="bg-secondary rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-primary">∞</div>
          <div className="text-sm text-muted-foreground mt-1">Learning Goals</div>
        </div>
      </div>
    </div>
  );
};
