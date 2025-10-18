import { useState } from 'react';
import { Folder, File, Search, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ViewMode = 'grid' | 'list';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  size?: string;
  modified: string;
}

export const FinderApp = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const files: FileItem[] = [
    { id: '1', name: 'About Me', type: 'folder', modified: 'Today' },
    { id: '2', name: 'Technologies', type: 'folder', modified: 'Today' },
    { id: '3', name: 'Projects', type: 'folder', modified: 'Today' },
    { id: '4', name: 'Journey', type: 'folder', modified: 'Today' },
    { id: '5', name: 'GitHub', type: 'folder', modified: 'Today' },
    { id: '6', name: 'LinkedIn', type: 'folder', modified: 'Today' },
    { id: '7', name: 'Contact', type: 'folder', modified: 'Today' },
    { id: '8', name: 'Settings', type: 'folder', modified: 'Today' },
  ];

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="w-24" />
      </div>

      {/* Files */}
      <div className="flex-1 overflow-auto p-4">
        {filteredFiles.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No files found
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-4">
            {filteredFiles.map(file => (
              <div
                key={file.id}
                className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                  {file.type === 'folder' ? (
                    <Folder className="w-8 h-8 text-primary" />
                  ) : (
                    <File className="w-8 h-8 text-primary" />
                  )}
                </div>
                <div className="text-sm text-center font-medium">{file.name}</div>
                <div className="text-xs text-muted-foreground">{file.modified}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredFiles.map(file => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded flex items-center justify-center bg-primary/10">
                  {file.type === 'folder' ? (
                    <Folder className="w-5 h-5 text-primary" />
                  ) : (
                    <File className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{file.name}</div>
                </div>
                <div className="text-sm text-muted-foreground">{file.size || '--'}</div>
                <div className="text-sm text-muted-foreground w-32">{file.modified}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
