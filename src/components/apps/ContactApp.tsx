import { useState } from 'react';
import { Send, Mail, Github, Linkedin, Twitter, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export const ContactApp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'Message Sent! ✓',
      description: "Thanks for reaching out! I'll get back to you soon.",
    });

    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Get in Touch</h1>
          <p className="text-muted-foreground">
            Have a question or want to work together? I'd love to hear from you!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message</label>
            <Textarea
              placeholder="Your message..."
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2 animate-pulse-glow" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </form>

        <div className="bg-secondary rounded-xl p-6">
          <h3 className="font-semibold mb-4">Connect with me</h3>
          <div className="grid grid-cols-2 gap-3">
            <a
              href="https://github.com/Thanas-R"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-accent transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm font-medium">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/thanasr/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-accent transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span className="text-sm font-medium">LinkedIn</span>
            </a>
            <a
              href="mailto:thanas@example.com"
              className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-accent transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span className="text-sm font-medium">Email</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-accent transition-colors"
            >
              <Twitter className="w-5 h-5" />
              <span className="text-sm font-medium">Twitter</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
