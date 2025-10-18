import { User, MapPin, GraduationCap, Cake } from 'lucide-react';

export const AboutApp = () => {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start gap-6">
        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-6xl shadow-lg">
          👨‍💻
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">Thanas R</h1>
          <p className="text-muted-foreground text-lg mb-4">AI/ML Engineering Student</p>
          
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
          Hello! I'm Thanas — a passionate learner who believes in growing a little every day. I'm deeply 
          interested in coding and problem-solving, and I enjoy the challenge of turning complex problems 
          into simple, effective solutions.
        </p>
        <p className="text-base leading-relaxed mt-3">
          While I take my work seriously, I also value creating a positive and cheerful environment. I believe 
          a good laugh and a positive attitude can make all the difference in overcoming challenges and achieving 
          great results.
        </p>
        <p className="text-base leading-relaxed mt-3">
          Currently pursuing B.Tech in Computer Science Engineering with a specialization in AI/ML at PES University, 
          I'm constantly exploring new technologies and building projects that solve real-world problems.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-secondary rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-primary">2+</div>
          <div className="text-sm text-muted-foreground mt-1">Years Coding</div>
        </div>
        <div className="bg-secondary rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-primary">15+</div>
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
