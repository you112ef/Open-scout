import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Folder,
  File,
  FileText,
  FileCode,
  FileImage,
  Plus,
  Search,
  MoreHorizontal,
  Download,
  Trash2,
  Edit,
  Share,
  Upload,
  FolderPlus,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Filter
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  lastModified: Date;
  fileType?: 'text' | 'code' | 'image' | 'pdf' | 'other';
  path: string;
}

interface FileManagerProps {
  onFileSelect?: (file: FileItem) => void;
}

export default function FileManager({ onFileSelect }: FileManagerProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState('/workspace');

  const files: FileItem[] = [
    {
      id: '1',
      name: 'المشروع التجاري',
      type: 'folder',
      lastModified: new Date('2024-01-15'),
      path: '/workspace/المشروع التجاري'
    },
    {
      id: '2', 
      name: 'src',
      type: 'folder',
      lastModified: new Date('2024-01-15'),
      path: '/workspace/src'
    },
    {
      id: '3',
      name: 'App.tsx',
      type: 'file',
      fileType: 'code',
      size: 2048,
      lastModified: new Date('2024-01-15'),
      path: '/workspace/src/App.tsx'
    },
    {
      id: '4',
      name: 'README.md',
      type: 'file',
      fileType: 'text',
      size: 1024,
      lastModified: new Date('2024-01-14'),
      path: '/workspace/README.md'
    },
    {
      id: '5',
      name: 'logo.png',
      type: 'file',
      fileType: 'image',
      size: 15360,
      lastModified: new Date('2024-01-13'),
      path: '/workspace/assets/logo.png'
    },
    {
      id: '6',
      name: 'package.json',
      type: 'file',
      fileType: 'code',
      size: 512,
      lastModified: new Date('2024-01-12'),
      path: '/workspace/package.json'
    }
  ];

  const getFileIcon = (item: FileItem) => {
    if (item.type === 'folder') {
      return <Folder className="h-5 w-5 text-blue-500" />;
    }
    
    switch (item.fileType) {
      case 'text':
        return <FileText className="h-5 w-5 text-gray-500" />;
      case 'code':
        return <FileCode className="h-5 w-5 text-green-500" />;
      case 'image':
        return <FileImage className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'date':
        comparison = a.lastModified.getTime() - b.lastModified.getTime();
        break;
      case 'size':
        comparison = (a.size || 0) - (b.size || 0);
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      setCurrentPath(file.path);
    } else {
      onFileSelect?.(file);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">مدير الملفات</h2>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  جديد
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>إنشاء عنصر جديد</DialogTitle>
                  <DialogDescription>
                    اختر نوع العنصر الذي تريد إنشاؤه
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <FileText className="h-6 w-6" />
                    ملف نصي
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <FileCode className="h-6 w-6" />
                    ملف كود
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <FolderPlus className="h-6 w-6" />
                    مجلد جديد
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2">
                    <Upload className="h-6 w-6" />
                    رفع ملف
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في الملفات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>ترتيب حسب</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSortBy('name')}>
                الاسم
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('date')}>
                التاريخ
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('size')}>
                الحجم
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                {sortOrder === 'asc' ? <SortDesc className="h-4 w-4 ml-2" /> : <SortAsc className="h-4 w-4 ml-2" />}
                {sortOrder === 'asc' ? 'تنازلي' : 'تصاعدي'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {currentPath}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* File List */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {viewMode === 'list' ? (
            <div className="space-y-1">
              {sortedFiles.map((file) => (
                <div
                  key={file.id}
                  className={`group flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors ${
                    selectedFiles.includes(file.id) ? 'bg-accent' : ''
                  }`}
                  onClick={() => handleFileClick(file)}
                  onDoubleClick={() => toggleFileSelection(file.id)}
                >
                  <div className="flex-shrink-0">
                    {getFileIcon(file)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{file.name}</span>
                      {file.type === 'file' && file.fileType && (
                        <Badge variant="secondary" className="text-xs">
                          {file.fileType}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatDate(file.lastModified)}</span>
                      {file.size && <span>{formatFileSize(file.size)}</span>}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 ml-2" />
                        إعادة تسمية
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 ml-2" />
                        تحميل
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share className="h-4 w-4 ml-2" />
                        مشاركة
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 ml-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedFiles.map((file) => (
                <Card
                  key={file.id}
                  className={`group cursor-pointer hover:shadow-md transition-shadow ${
                    selectedFiles.includes(file.id) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleFileClick(file)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-shrink-0">
                        {getFileIcon(file)}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>تعديل</DropdownMenuItem>
                          <DropdownMenuItem>تحميل</DropdownMenuItem>
                          <DropdownMenuItem>حذف</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm truncate">{file.name}</h4>
                      <div className="text-xs text-muted-foreground">
                        <div>{formatDate(file.lastModified)}</div>
                        {file.size && <div>{formatFileSize(file.size)}</div>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {sortedFiles.length === 0 && (
            <div className="text-center py-12">
              <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                لا توجد ملفات
              </h3>
              <p className="text-sm text-muted-foreground">
                ابدأ بإنشاء ملف أو مجلد جديد
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Selection Footer */}
      {selectedFiles.length > 0 && (
        <div className="border-t border-border p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              تم اختيار {selectedFiles.length} عنصر
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 ml-2" />
                تحميل
              </Button>
              <Button size="sm" variant="outline">
                <Share className="h-4 w-4 ml-2" />
                مشاركة
              </Button>
              <Button size="sm" variant="destructive">
                <Trash2 className="h-4 w-4 ml-2" />
                حذف
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}