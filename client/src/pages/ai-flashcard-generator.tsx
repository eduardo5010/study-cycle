import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  BookOpen,
  FileText,
  Link,
  Wand2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Brain,
  Target,
  Zap,
  Upload,
  ExternalLink
} from "lucide-react";

interface GeneratedFlashcard {
  id: string;
  front: string;
  back: string;
  type: 'text' | 'image' | 'audio' | 'video';
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  subject: string;
  explanation?: string;
}

interface GenerationOptions {
  source: 'text' | 'url' | 'file' | 'topic';
  content: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  count: number;
  types: ('flashcard' | 'quiz' | 'cloze')[];
}

export default function AIFlashcardGeneratorPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("generate");
  const [generationOptions, setGenerationOptions] = useState<GenerationOptions>({
    source: 'text',
    content: '',
    subject: '',
    difficulty: 'medium',
    count: 5,
    types: ['flashcard']
  });

  const [generatedCards, setGeneratedCards] = useState<GeneratedFlashcard[]>([]);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  const generateCards = useMutation({
    mutationFn: async (options: GenerationOptions): Promise<GeneratedFlashcard[]> => {
      // Simulate API call - in real app, this would call OpenAI/our AI service
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock generated cards based on content
      const mockCards: GeneratedFlashcard[] = [];
      const topics = options.content.split(/[.!?]+/).filter(s => s.trim().length > 10);

      for (let i = 0; i < options.count; i++) {
        const topic = topics[i % topics.length] || options.content.slice(0, 50);
        mockCards.push({
          id: `card-${i}`,
          front: `What is the main concept discussed in: "${topic.trim()}"?`,
          back: `This concept refers to ${topic.trim()}. It involves understanding the fundamental principles and applications in the field of ${options.subject || 'the subject'}.`,
          type: 'text',
          difficulty: options.difficulty === 'adaptive' ? ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as any : options.difficulty,
          tags: [options.subject || 'generated', 'ai-generated'],
          subject: options.subject || 'General',
          explanation: 'Generated using AI analysis of the provided content'
        });
      }

      return mockCards;
    },
    onSuccess: (cards) => {
      setGeneratedCards(cards);
      setActiveTab("review");
      toast({
        title: "Flashcards generated successfully!",
        description: `Created ${cards.length} flashcards from your content.`
      });
    },
    onError: () => {
      toast({
        title: "Generation failed",
        description: "Please try again or check your input.",
        variant: "destructive"
      });
    }
  });

  const saveCards = useMutation({
    mutationFn: async (cardsToSave: GeneratedFlashcard[]) => {
      // In real app, save to database
      await new Promise(resolve => setTimeout(resolve, 1000));
      return cardsToSave.length;
    },
    onSuccess: (count) => {
      toast({
        title: "Flashcards saved!",
        description: `Successfully saved ${count} flashcards to your collection.`
      });
      setGeneratedCards([]);
      setSelectedCards(new Set());
      setActiveTab("generate");
    }
  });

  const handleGenerate = () => {
    if (!generationOptions.content.trim()) {
      toast({
        title: "Content required",
        description: "Please provide some content to generate flashcards from.",
        variant: "destructive"
      });
      return;
    }

    generateCards.mutate(generationOptions);
  };

  const handleSaveSelected = () => {
    const cardsToSave = generatedCards.filter(card => selectedCards.has(card.id));
    if (cardsToSave.length === 0) {
      toast({
        title: "No cards selected",
        description: "Please select at least one flashcard to save.",
        variant: "destructive"
      });
      return;
    }

    saveCards.mutate(cardsToSave);
  };

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const selectAllCards = () => {
    setSelectedCards(new Set(generatedCards.map(card => card.id)));
  };

  const clearSelection = () => {
    setSelectedCards(new Set());
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          AI Flashcard Generator
        </h1>
        <p className="text-muted-foreground">
          Generate personalized flashcards using artificial intelligence
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Generate
          </TabsTrigger>
          <TabsTrigger value="review" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Review ({generatedCards.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Generation Options */}
            <Card>
              <CardHeader>
                <CardTitle>Generation Settings</CardTitle>
                <CardDescription>
                  Configure how your flashcards should be generated
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="source">Source Type</Label>
                  <Select
                    value={generationOptions.source}
                    onValueChange={(value: any) => setGenerationOptions(prev => ({ ...prev, source: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Text Content
                        </div>
                      </SelectItem>
                      <SelectItem value="url">
                        <div className="flex items-center gap-2">
                          <Link className="h-4 w-4" />
                          Web URL
                        </div>
                      </SelectItem>
                      <SelectItem value="file">
                        <div className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Upload File
                        </div>
                      </SelectItem>
                      <SelectItem value="topic">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          Topic Description
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics, Physics, History"
                    value={generationOptions.subject}
                    onChange={(e) => setGenerationOptions(prev => ({ ...prev, subject: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={generationOptions.difficulty}
                      onValueChange={(value: any) => setGenerationOptions(prev => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                        <SelectItem value="adaptive">Adaptive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="count">Number of Cards</Label>
                    <Select
                      value={generationOptions.count.toString()}
                      onValueChange={(value) => setGenerationOptions(prev => ({ ...prev, count: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 cards</SelectItem>
                        <SelectItem value="5">5 cards</SelectItem>
                        <SelectItem value="10">10 cards</SelectItem>
                        <SelectItem value="15">15 cards</SelectItem>
                        <SelectItem value="20">20 cards</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Card Types</Label>
                  <div className="flex gap-2 mt-2">
                    {[
                      { value: 'flashcard', label: 'Flashcards' },
                      { value: 'quiz', label: 'Quizzes' },
                      { value: 'cloze', label: 'Cloze Tests' }
                    ].map(type => (
                      <Button
                        key={type.value}
                        variant={generationOptions.types.includes(type.value as any) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {
                          setGenerationOptions(prev => ({
                            ...prev,
                            types: prev.types.includes(type.value as any)
                              ? prev.types.filter(t => t !== type.value)
                              : [...prev.types, type.value as any]
                          }));
                        }}
                      >
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Input */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {generationOptions.source === 'text' && 'Text Content'}
                  {generationOptions.source === 'url' && 'Web URL'}
                  {generationOptions.source === 'file' && 'File Upload'}
                  {generationOptions.source === 'topic' && 'Topic Description'}
                </CardTitle>
                <CardDescription>
                  {generationOptions.source === 'text' && 'Paste or type the content you want to convert to flashcards'}
                  {generationOptions.source === 'url' && 'Enter the URL of the webpage to analyze'}
                  {generationOptions.source === 'file' && 'Upload a document, PDF, or text file'}
                  {generationOptions.source === 'topic' && 'Describe the topic you want to learn about'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generationOptions.source === 'text' && (
                  <Textarea
                    placeholder="Paste your study material here... The AI will analyze it and create relevant flashcards."
                    value={generationOptions.content}
                    onChange={(e) => setGenerationOptions(prev => ({ ...prev, content: e.target.value }))}
                    rows={12}
                    className="resize-none"
                  />
                )}

                {generationOptions.source === 'url' && (
                  <div className="space-y-4">
                    <Input
                      placeholder="https://example.com/article"
                      value={generationOptions.content}
                      onChange={(e) => setGenerationOptions(prev => ({ ...prev, content: e.target.value }))}
                    />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ExternalLink className="h-4 w-4" />
                      The AI will fetch and analyze the webpage content
                    </div>
                  </div>
                )}

                {generationOptions.source === 'file' && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">Drop your file here</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Supports PDF, DOC, DOCX, TXT files up to 10MB
                      </p>
                      <Button variant="outline">
                        Choose File
                      </Button>
                    </div>
                  </div>
                )}

                {generationOptions.source === 'topic' && (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Describe the topic you want to learn about in detail. The AI will generate comprehensive flashcards covering key concepts, definitions, examples, and practice questions."
                      value={generationOptions.content}
                      onChange={(e) => setGenerationOptions(prev => ({ ...prev, content: e.target.value }))}
                      rows={8}
                      className="resize-none"
                    />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Brain className="h-4 w-4" />
                      AI will research and create flashcards about this topic
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleGenerate}
                    disabled={generateCards.isPending || !generationOptions.content.trim()}
                    className="min-w-40"
                  >
                    {generateCards.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Flashcards
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {generateCards.isPending && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <div>
                    <h3 className="font-semibold">Generating your flashcards...</h3>
                    <p className="text-sm text-muted-foreground">
                      AI is analyzing your content and creating personalized flashcards
                    </p>
                  </div>
                </div>
                <Progress value={75} className="mt-4" />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="review" className="space-y-6">
          {generatedCards.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No flashcards generated yet</h3>
                <p className="text-muted-foreground">
                  Go back to the Generate tab to create your first AI-powered flashcards.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Generated Flashcards</h2>
                  <p className="text-muted-foreground">
                    Review and select the flashcards you want to save
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearSelection}>
                    Clear Selection
                  </Button>
                  <Button variant="outline" onClick={selectAllCards}>
                    Select All
                  </Button>
                  <Button onClick={handleSaveSelected} disabled={selectedCards.size === 0 || saveCards.isPending}>
                    {saveCards.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Save Selected ({selectedCards.size})
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedCards.map(card => (
                  <Card
                    key={card.id}
                    className={`cursor-pointer transition-all ${
                      selectedCards.has(card.id)
                        ? 'ring-2 ring-primary border-primary'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => toggleCardSelection(card.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{card.subject}</Badge>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={`${getDifficultyColor(card.difficulty)} text-white`}
                          >
                            {card.difficulty}
                          </Badge>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedCards.has(card.id)
                              ? 'bg-primary border-primary'
                              : 'border-muted-foreground'
                          }`} />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Front:</h4>
                        <p className="text-sm bg-muted/50 p-3 rounded">{card.front}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Back:</h4>
                        <p className="text-sm bg-muted/50 p-3 rounded">{card.back}</p>
                      </div>

                      {card.explanation && (
                        <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                          <Zap className="h-3 w-3 inline mr-1" />
                          {card.explanation}
                        </div>
                      )}

                      <div className="flex gap-1">
                        {card.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generation History</CardTitle>
              <CardDescription>
                View your previously generated flashcard sets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No generation history yet</h3>
                <p className="text-muted-foreground">
                  Your flashcard generation history will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
