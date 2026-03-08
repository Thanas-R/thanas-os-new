import { Calendar, Code, GraduationCap, Sparkles } from 'lucide-react';

const milestones = [
{
  year: '2026 (Present)',
  title: 'Agentic AI & Design Mastery',
  description: 'Adopted agentic AI tools, refined UI/UX design skills, elevated prompt engineering to new heights.',
  icon: Sparkles,
  color: 'hsl(280, 70%, 60%)'
},
{
  year: '2025',
  title: 'B.Tech & Production Projects',
  description: 'Began B.Tech in CSE (AI/ML) at PES University. Started building production-ready projects.',
  icon: GraduationCap,
  color: 'hsl(211, 100%, 50%)'
},
{
  year: '2023',
  title: 'C++ & DSA Mastery',
  description: 'Focused on C++ and DSA, strengthening core CS fundamentals.',
  icon: Code,
  color: 'hsl(220, 70%, 50%)'
},
{
  year: '2021',
  title: 'Java Journey Begins',
  description: 'Started learning Java, focusing on OOP principles.',
  icon: Code,
  color: 'hsl(0, 70%, 50%)'
},
{
  year: '2020',
  title: 'First Steps in Programming',
  description: 'First steps in programming with Python.',
  icon: Code,
  color: 'hsl(205, 100%, 50%)'
}];


export const JourneyApp = () => {
  return (
    <div className="p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">My Journey</h1>
        <p className="text-muted-foreground">
          The story of how I fell in love with technology and software development
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary" />

        <div className="space-y-12">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            return (
              <div key={index} className="relative pl-20 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div
                  className="absolute left-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: milestone.color }}>
                  
                  
                </div>

                <div className="bg-secondary rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">{milestone.year}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>);

          })}
        </div>
      </div>

      <div className="mt-12 p-6 bg-secondary rounded-xl">
        <h3 className="text-lg font-bold mb-3">Education</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">PES University</div>
              <div className="text-sm text-muted-foreground">B.Tech CSE (AIML)</div>
            </div>
            <span className="text-sm text-muted-foreground">2025 - 2029</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">Allen Career Institute</div>
              <div className="text-sm text-muted-foreground">11th - 12th</div>
            </div>
            <span className="text-sm text-muted-foreground">2023 - 2025</span>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">Sri Vani Education Centre</div>
              <div className="text-sm text-muted-foreground">1st - 10th</div>
            </div>
            <span className="text-sm text-muted-foreground">2013 - 2023</span>
          </div>
        </div>
      </div>
    </div>);

};