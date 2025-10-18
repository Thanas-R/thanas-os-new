import { Linkedin, ExternalLink, GraduationCap, MapPin, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import linkedinPhoto from '@/assets/linkedin-profile.jpg';

export const LinkedInApp = () => {
  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Linkedin className="w-8 h-8 text-[#0077B5]" />
            <h1 className="text-3xl font-bold">LinkedIn Profile</h1>
          </div>
          <p className="text-muted-foreground">
            Connect with me on LinkedIn to stay updated on my professional journey
          </p>
        </div>

        <Card className="p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-macos-glass">
              <img src={linkedinPhoto} alt="Thanas R LinkedIn profile photo" className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">Thanas R</h2>
              <p className="text-lg text-muted-foreground mb-3">
                B.Tech CSE [AIML] Student | PES University
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  <span>PES University</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Bangalore, India</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>14 followers</span>
                </div>
              </div>

              <Button asChild className="bg-[#0077B5] hover:bg-[#006399]">
                <a
                  href="https://www.linkedin.com/in/thanasr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View LinkedIn Profile
                </a>
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-lg mb-3">About</h3>
          <p className="text-muted-foreground leading-relaxed">
            Hello! I'm Thanas — a passionate learner who believes in growing a little every day. I'm deeply 
            interested in coding and problem-solving, and I enjoy the challenge of turning complex problems 
            into simple, effective solutions.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            While I take my work seriously, I also value creating a positive and cheerful environment. I believe 
            a good laugh and a positive attitude can make all the difference in overcoming challenges and achieving 
            great results.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Education</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl flex-shrink-0">
                🎓
              </div>
              <div>
                <h4 className="font-semibold">PES University</h4>
                <p className="text-sm text-muted-foreground">
                  Bachelor of Technology - BTech, Computer Science and Engineering (AI&ML)
                </p>
                <p className="text-xs text-muted-foreground mt-1">2025 - 2029</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-xl flex-shrink-0">
                📚
              </div>
              <div>
                <h4 className="font-semibold">Allen Career Institute</h4>
                <p className="text-sm text-muted-foreground">
                  JEE Preparation
                </p>
                <p className="text-xs text-muted-foreground mt-1">2023 - 2025</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Want to connect? Send me a message on LinkedIn!</p>
        </div>
      </div>
    </div>
  );
};
