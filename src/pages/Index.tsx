import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BookSection {
  id: string;
  title: string;
  type: 'toc' | 'intro' | 'chapter' | 'bookmark' | 'note' | 'appendix';
  content: string[];
}

const initialSections: BookSection[] = [
  {
    id: 'toc',
    title: 'Оглавление',
    type: 'toc',
    content: ['Введение', 'Глава 1: Начало путешествия', 'Глава 2: Открытия', 'Глава 3: Испытания', 'Примечания', 'Приложения']
  },
  {
    id: 'intro',
    title: 'Введение',
    type: 'intro',
    content: [
      'Добро пожаловать в эту цифровую книгу с эффектом реального перелистывания страниц.',
      '',
      'Эта книга создана с вниманием к деталям и комфортному чтению. Темная тема специально разработана для вечернего использования, чтобы не утомлять глаза.',
      '',
      'Используйте навигацию слева для быстрого перехода между разделами. Все ваши закладки и прогресс чтения будут сохранены.',
      '',
      'Приятного чтения!'
    ]
  },
  {
    id: 'ch1',
    title: 'Глава 1: Начало путешествия',
    type: 'chapter',
    content: [
      'В тихом городке, окруженном лесами и горами, жил мальчик по имени Алекс. Он всегда мечтал о приключениях.',
      '',
      'Каждый день после школы Алекс убегал на старый чердак, где хранились книги его деда. Среди пыльных томов он находил истории о далеких странах, древних цивилизациях и невероятных открытиях.',
      '',
      'Но однажды он нашел нечто особенное — старую карту с загадочными символами. Это открытие изменило всё.',
      '',
      'Карта указывала на место в лесу, где, по легенде, был спрятан древний артефакт. Алекс решил отправиться туда на следующий день.',
    ]
  },
  {
    id: 'ch2',
    title: 'Глава 2: Открытия',
    type: 'chapter',
    content: [
      'Утро выдалось туманным. Алекс взял рюкзак, компас и ту самую карту.',
      '',
      'Лес встретил его шелестом листвы и пением птиц. Чем дальше он углублялся в чащу, тем необычнее становились деревья — их стволы были покрыты странными знаками.',
      '',
      'Внезапно Алекс вышел на поляну. В её центре возвышался каменный обелиск, весь исписанный теми же символами, что и на карте.',
      '',
      'Подойдя ближе, он заметил углубление в форме ладони. Когда он приложил руку, обелиск начал светиться...',
    ]
  },
  {
    id: 'ch3',
    title: 'Глава 3: Испытания',
    type: 'chapter',
    content: [
      'Земля под ногами задрожала. Из обелиска вырвался луч света, указывающий на скрытый проход под корнями древнего дуба.',
      '',
      'Алекс спустился в подземелье. Факелы загорались сами собой, освещая длинный коридор с фресками на стенах.',
      '',
      'Фрески рассказывали историю древней цивилизации, которая обладала удивительными знаниями. Но эти знания нужно было заслужить.',
      '',
      'Впереди показались три двери. На каждой — загадка. Алекс понял, что это испытание его мудрости...',
    ]
  },
  {
    id: 'notes',
    title: 'Примечания',
    type: 'note',
    content: [
      'Примечание 1: Символы на карте соответствуют древнему языку, изученному дедом Алекса.',
      '',
      'Примечание 2: Обелиск датируется примерно 3000 годом до н.э.',
      '',
      'Примечание 3: Подземелье было построено как хранилище знаний.',
    ]
  },
  {
    id: 'appendix',
    title: 'Приложения',
    type: 'appendix',
    content: [
      'Приложение A: Расшифровка древних символов',
      'Приложение B: Карты местности',
      'Приложение C: Исторический контекст',
    ]
  }
];

const Index = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [sections, setSections] = useState<BookSection[]>(initialSections);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newChapter, setNewChapter] = useState({
    title: '',
    type: 'chapter' as BookSection['type'],
    content: ''
  });

  const toggleBookmark = () => {
    if (bookmarks.includes(currentPage)) {
      setBookmarks(bookmarks.filter(p => p !== currentPage));
    } else {
      setBookmarks([...bookmarks, currentPage]);
    }
  };

  const goToNextPage = () => {
    if (currentPage < sections.length - 1) {
      setIsFlipping(true);
      setFlipDirection('next');
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setIsFlipping(true);
      setFlipDirection('prev');
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsFlipping(false);
      }, 600);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      setSidebarOpen(false);
    }
  };

  const addNewChapter = () => {
    const contentArray = newChapter.content.split('\n\n');
    const newSection: BookSection = {
      id: `custom-${Date.now()}`,
      title: newChapter.title,
      type: newChapter.type,
      content: contentArray
    };
    setSections([...sections, newSection]);
    setNewChapter({ title: '', type: 'chapter', content: '' });
    setDialogOpen(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNextPage();
      if (e.key === 'ArrowLeft') goToPrevPage();
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, sections.length]);

  const currentSection = sections[currentPage];
  const progress = ((currentPage + 1) / sections.length) * 100;

  return (
    <div className="min-h-screen bg-background font-sans flex">
      <div 
        className={`fixed left-0 top-0 h-full bg-sidebar border-r border-sidebar-border transition-transform duration-300 z-50 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-80`}
      >
        <div className="p-6 flex items-center justify-between border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-sidebar-foreground flex items-center gap-2">
            <Icon name="BookOpen" size={28} />
            Книга
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-6 space-y-2">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Прогресс чтения</p>
              <div className="w-full bg-sidebar-accent rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {currentPage + 1} из {sections.length}
              </p>
            </div>

            <Separator className="my-4" />

            <div className="space-y-1">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setCurrentPage(index)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 group ${
                    currentPage === index
                      ? 'bg-sidebar-accent text-sidebar-primary'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <Icon 
                    name={
                      section.type === 'toc' ? 'List' :
                      section.type === 'intro' ? 'BookMarked' :
                      section.type === 'chapter' ? 'BookOpen' :
                      section.type === 'bookmark' ? 'Bookmark' :
                      section.type === 'note' ? 'StickyNote' :
                      'FileText'
                    }
                    size={18}
                  />
                  <span className="text-sm font-medium">{section.title}</span>
                  {bookmarks.includes(index) && (
                    <Icon name="Bookmark" size={14} className="ml-auto text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-sidebar">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" variant="default">
                <Icon name="Plus" size={18} className="mr-2" />
                Добавить главу
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Создать новую главу</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Название</Label>
                  <Input
                    id="title"
                    placeholder="Название главы"
                    value={newChapter.title}
                    onChange={(e) => setNewChapter({...newChapter, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Тип раздела</Label>
                  <Select
                    value={newChapter.type}
                    onValueChange={(value) => setNewChapter({...newChapter, type: value as BookSection['type']})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chapter">Глава</SelectItem>
                      <SelectItem value="note">Примечание</SelectItem>
                      <SelectItem value="appendix">Приложение</SelectItem>
                      <SelectItem value="intro">Введение</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Содержание</Label>
                  <Textarea
                    id="content"
                    placeholder="Введите текст главы. Разделяйте абзацы пустой строкой."
                    className="min-h-[200px]"
                    value={newChapter.content}
                    onChange={(e) => setNewChapter({...newChapter, content: e.target.value})}
                  />
                </div>
                <Button onClick={addNewChapter} className="w-full">
                  Создать главу
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-80' : 'ml-0'}`}>
        {!isFullscreen && (
          <div className="fixed top-0 right-0 left-0 bg-background/80 backdrop-blur-sm border-b border-border z-40 px-6 py-4">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="flex items-center gap-4">
                {!sidebarOpen && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(true)}
                    className="text-foreground"
                  >
                    <Icon name="Menu" size={20} />
                  </Button>
                )}
                <h2 className="text-lg font-semibold text-foreground">{currentSection.title}</h2>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleBookmark}
                  className={bookmarks.includes(currentPage) ? 'text-primary' : 'text-foreground'}
                  title="Добавить закладку"
                >
                  <Icon name="Bookmark" size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-foreground"
                  title="Полноэкранный режим (F)"
                >
                  <Icon name="Maximize2" size={20} />
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className={`${isFullscreen ? 'pt-12' : 'pt-24'} pb-12 px-6 flex items-center justify-center min-h-screen relative`}>
          {isFullscreen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="fixed top-4 right-4 z-50 text-foreground bg-background/50 hover:bg-background/80"
              title="Выйти из полноэкранного режима (F)"
            >
              <Icon name="Minimize2" size={20} />
            </Button>
          )}

          <div className="max-w-4xl w-full" style={{ perspective: '2000px' }}>
            <Card 
              className={`bg-card text-card-foreground shadow-2xl overflow-hidden transition-all duration-600 ${
                isFlipping 
                  ? flipDirection === 'next' 
                    ? 'animate-page-flip' 
                    : 'animate-page-flip-back'
                  : 'animate-fade-in'
              }`}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="p-12 md:p-16 min-h-[600px] flex flex-col">
                <h2 className="text-3xl md:text-4xl font-bold mb-8 font-serif text-card-foreground">
                  {currentSection.title}
                </h2>
                
                <ScrollArea className="flex-1 pr-4">
                  <div className="space-y-4 font-serif text-lg leading-relaxed text-card-foreground">
                    {currentSection.content.map((paragraph, index) => (
                      <p key={index} className={paragraph === '' ? 'h-4' : ''}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={goToPrevPage}
                    disabled={currentPage === 0 || isFlipping}
                    className="flex items-center gap-2"
                  >
                    <Icon name="ChevronLeft" size={20} />
                    Назад
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    Страница {currentPage + 1} из {sections.length}
                  </span>

                  <Button
                    variant="outline"
                    onClick={goToNextPage}
                    disabled={currentPage === sections.length - 1 || isFlipping}
                    className="flex items-center gap-2"
                  >
                    Вперед
                    <Icon name="ChevronRight" size={20} />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {isFullscreen && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-background/80 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-4 border border-border">
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevPage}
                disabled={currentPage === 0 || isFlipping}
              >
                <Icon name="ChevronLeft" size={20} />
              </Button>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {currentPage + 1} / {sections.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNextPage}
                disabled={currentPage === sections.length - 1 || isFlipping}
              >
                <Icon name="ChevronRight" size={20} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
