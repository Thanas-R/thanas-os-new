import { Mail, Github, Linkedin, Copy, ExternalLink, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export const ContactApp = () => {
  const { toast } = useToast();

  const copyEmail = () => {
    navigator.clipboard.writeText('thanas5.rd@gmail.com');
    toast({
      title: 'Email Copied!',
      description: 'thanas5.rd@gmail.com copied to clipboard',
    });
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

        <div className="mb-8 p-6 bg-destructive/10 border border-destructive/30 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-destructive mb-1">Contact form is no longer active</h3>
              <p className="text-sm text-muted-foreground mb-3">
                This version of the portfolio is no longer functional. Please use my main website to get in touch.
              </p>
              <a
                href="https://thanas.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Visit thanas.vercel.app
                </Button>
              </a>
            </div>
          </div>
        </div>

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
            <button
              onClick={copyEmail}
              className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-accent transition-colors cursor-pointer"
            >
              <Mail className="w-5 h-5" />
              <div className="flex flex-col items-start flex-1">
                <span className="text-sm font-medium">Email</span>
                <span className="text-xs text-muted-foreground">thanas5.rd@gmail.com</span>
              </div>
              <Copy className="w-4 h-4 opacity-50" />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText('darkspacepirate');
                toast({
                  title: 'Discord Username Copied!',
                  description: 'darkspacepirate copied to clipboard',
                });
              }}
              className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-accent transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <div className="flex flex-col items-start flex-1">
                <span className="text-sm font-medium">Discord</span>
                <span className="text-xs text-muted-foreground">darkspacepirate</span>
              </div>
              <Copy className="w-4 h-4 opacity-50" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
