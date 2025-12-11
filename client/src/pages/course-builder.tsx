import React, { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Save,
  Eye,
  Settings,
  Trash2,
  Move,
  Copy,
  Edit3,
  FileText,
  Video,
  Image,
  Code,
  CheckSquare,
  Brain,
  Target,
  BookOpen,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  SkipForward,
  SkipBack,
  Zap,
  Sparkles,
  Wand2
} from "lucide-react";

interface CourseComponent {
  id: string;
  type: 'text' | 'video' | 'image' | 'quiz' | 'exercise' | 'code' | 'skill';
  title: string;
  content: any;
  order: number;
  isRequired: boolean;
  estimatedTime?: number; // minutes
}

interface SkillNode {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prerequisites: string[]; // skill IDs
  exercises: CourseComponent[];
  isCompleted: boolean;
  progress: number;
  estimatedTime: number;
}

export default function CourseBuilderPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseLevel, setCourseLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [components, setComponents] = useState<CourseComponent[]>([]);
  const [skillTree, setSkillTree] = useState<SkillNode[]>([]);
  const [draggedComponent, setDraggedComponent] = useState<CourseComponent | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<CourseComponent | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [useSkillTree, setUseSkillTree] = useState(false);

  const componentTypes = [
    { type: 'text', label: 'Text Block', icon: FileText, color: 'text-blue-500' },
    { type: 'video', label: 'Video', icon: Video, color: 'text-red-500' },
    { type: 'image', label: 'Image', icon: Image, color: 'text-green-500' },
    { type: 'quiz', label: 'Quiz', icon: CheckSquare, color: 'text-purple-500' },
    { type: 'exercise', label: 'Exercise', icon: Brain, color: 'text-orange-500' },
    { type: 'code', label: 'Code Block', icon: Code, color: 'text-gray-500' },
    { type: 'skill', label: 'Skill Node', icon: Target, color: 'text-indigo-500' }
  ];

  const addComponent = (type: CourseComponent['type']) => {
    const newComponent: CourseComponent = {
      id: `comp-${Date.now()}`,
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      content: getDefaultContent(type),
      order: components.length,
      isRequired: true,
      estimatedTime: 5
    };

    setComponents([...components, newComponent]);
  };

  const getDefaultContent = (type: CourseComponent['type']) => {
    switch (type) {
      case 'text':
        return { text: 'Enter your content here...' };
      case 'video':
        return { url: '', caption: '' };
      case 'image':
        return { url: '', alt: '', caption: '' };
      case 'quiz':
        return {
          questions: [{
            question: 'Sample question?',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: 0,
            explanation: 'Explanation here...'
          }]
        };
      case 'exercise':
        return {
          problem: 'Exercise description...',
          solution: '',
          hints: []
        };
      case 'code':
        return {
          language: 'javascript',
          code: '// Write your code here',
          editable: true,
          solution: ''
        };
      case 'skill':
        return {
          skillId: '',
          description: 'Skill description...',
          requirements: []
        };
      default:
        return {};
    }
  };

  const updateComponent = (id: string, updates: Partial<CourseComponent>) => {
    setComponents(components.map(comp =>
      comp.id === id ? { ...comp, ...updates } : comp
    ));
  };

  const deleteComponent = (id: string) => {
    setComponents(components.filter(comp => comp.id !== id));
  };

  const moveComponent = (fromIndex: number, toIndex: number) => {
    const newComponents = [...components];
    const [moved] = newComponents.splice(fromIndex, 1);
    newComponents.splice(toIndex, 0, moved);

    // Update order
    newComponents.forEach((comp, index) => {
      comp.order = index;
    });

    setComponents(newComponents);
  };

  const duplicateComponent = (component: CourseComponent) => {
    const duplicated = {
      ...component,
      id: `comp-${Date.now()}`,
      title: `${component.title} (Copy)`,
      order: components.length
    };
    setComponents([...components, duplicated]);
  };

  const saveCourse = useMutation({
    mutationFn: async () => {
      const courseData = {
        title: courseTitle,
        description: courseDescription,
        level: courseLevel,
        components,
        skillTree: useSkillTree ? skillTree : null,
        teacherId: user?.id
      };

      // In real app, this would save to API
      await new Promise(resolve => setTimeout(resolve, 2000));
      return courseData;
    },
    onSuccess: () => {
      toast({
        title: "Course saved successfully!",
        description: "Your course has been published and is now available to students."
      });
    }
  });

  const generateWithAI = useMutation({
    mutationFn: async (prompt: string) => {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const generatedComponents: CourseComponent[] = [
        {
          id: `ai-comp-${Date.now()}`,
          type: 'text',
          title: 'AI Generated Introduction',
          content: { text: 'This content was generated by AI based on your prompt.' },
          order: components.length,
          isRequired: true,
          estimatedTime: 5
        }
      ];

      return generatedComponents;
    },
    onSuccess: (newComponents) => {
      setComponents([...components, ...newComponents]);
      toast({
        title: "AI content generated!",
        description: `${newComponents.length} components added to your course.`
      });
    }
  });

  const renderComponentEditor = (component: CourseComponent) => {
    switch (component.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label>Content</Label>
              <Textarea
                value={component.content.text}
                onChange={(e) => updateComponent(component.id, {
                  content: { ...component.content, text: e.target.value }
                })}
                rows={6}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <Label>Video URL</Label>
              <Input
                value={component.content.url}
                onChange={(e) => updateComponent(component.id, {
                  content: { ...component.content, url: e.target.value }
                })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div>
              <Label>Caption</Label>
              <Input
                value={component.content.caption}
                onChange={(e) => updateComponent(component.id, {
                  content: { ...component.content, caption: e.target.value }
                })}
                placeholder="Video description..."
              />
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-4">
            <div>
              <Label>Questions</Label>
              {component.content.questions?.map((q: any, index: number) => (
                <Card key={index} className="mt-2">
                  <CardContent className="pt-4">
                    <Input
                      value={q.question}
                      onChange={(e) => {
                        const newQuestions = [...component.content.questions];
                        newQuestions[index].question = e.target.value;
                        updateComponent(component.id, {
                          content: { ...component.content, questions: newQuestions }
                        });
                      }}
                      placeholder="Question text..."
                      className="mb-2"
                    />
                    {q.options?.map((option: string, optIndex: number) => (
                      <div key={optIndex} className="flex items-center gap-2 mb-1">
                        <input
                          type="radio"
                          name={`q-${index}`}
                          checked={optIndex === q.correctAnswer}
                          onChange={() => {
                            const newQuestions = [...component.content.questions];
                            newQuestions[index].correctAnswer = optIndex;
                            updateComponent(component.id, {
                              content: { ...component.content, questions: newQuestions }
                            });
                          }}
                        />
                        <Input
                          value={option}
                          onChange={(e) => {
                            const newQuestions = [...component.content.questions];
                            newQuestions[index].options[optIndex] = e.target.value;
                            updateComponent(component.id, {
                              content: { ...component.content, questions: newQuestions }
                            });
                          }}
                          placeholder={`Option ${optIndex + 1}`}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="space-y-4">
            <div>
              <Label>Language</Label>
              <Select
                value={component.content.language}
                onValueChange={(value) => updateComponent(component.id, {
                  content: { ...component.content, language: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Code</Label>
              <Textarea
                value={component.content.code}
                onChange={(e) => updateComponent(component.id, {
                  content: { ...component.content, code: e.target.value }
                })}
                rows={10}
                className="font-mono text-sm mt-1"
                placeholder="Write your code here..."
              />
            </div>
          </div>
        );

      default:
        return <div>Editor for {component.type} coming soon...</div>;
    }
  };

  const renderComponentPreview = (component: CourseComponent) => {
    switch (component.type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            <p>{component.content.text}</p>
          </div>
        );

      case 'video':
        return (
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Video Player</p>
              <p className="text-xs text-muted-foreground mt-1">{component.content.caption}</p>
            </div>
          </div>
        );

      case 'code':
        return (
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{component.content.code}</pre>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-4">
            {component.content.questions?.map((q: any, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">{q.question}</h4>
                <div className="space-y-2">
                  {q.options?.map((option: string, optIndex: number) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        optIndex === q.correctAnswer ? 'bg-green-500 border-green-500' : 'border-gray-300'
                      }`} />
                      <span className="text-sm">{option}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return <div className="text-muted-foreground">Preview for {component.type}</div>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary" />
          Course Builder
        </h1>
        <p className="text-muted-foreground">
          Create engaging courses with drag-and-drop components
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Course Settings Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Course Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="Enter course title..."
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  rows={3}
                  placeholder="Course description..."
                />
              </div>

              <div>
                <Label>Level</Label>
                <Select value={courseLevel} onValueChange={(value: any) => setCourseLevel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="skillTree"
                  checked={useSkillTree}
                  onChange={(e) => setUseSkillTree(e.target.checked)}
                />
                <Label htmlFor="skillTree">Use Skill Tree Structure</Label>
              </div>

              <div className="pt-4 space-y-2">
                <Button
                  onClick={() => saveCourse.mutate()}
                  disabled={saveCourse.isPending || !courseTitle.trim()}
                  className="w-full"
                >
                  {saveCourse.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Course
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  className="w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Builder Area */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="builder" className="space-y-6">
            <TabsList>
              <TabsTrigger value="builder">Course Builder</TabsTrigger>
              <TabsTrigger value="skills">Skill Tree</TabsTrigger>
              <TabsTrigger value="ai">AI Assistant</TabsTrigger>
            </TabsList>

            {/* Course Builder Tab */}
            <TabsContent value="builder" className="space-y-6">
              {/* Component Palette */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Components</CardTitle>
                  <CardDescription>
                    Drag and drop components to build your course
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {componentTypes.map(({ type, label, icon: Icon, color }) => (
                      <button
                        key={type}
                        onClick={() => addComponent(type as CourseComponent['type'])}
                        className="p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-colors text-center"
                      >
                        <Icon className={`h-8 w-8 mx-auto mb-2 ${color}`} />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Course Components */}
              <div className="space-y-4">
                {components.length === 0 ? (
                  <Card>
                    <CardContent className="pt-12 pb-12 text-center">
                      <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Start Building Your Course</h3>
                      <p className="text-muted-foreground mb-4">
                        Add components from the palette above to create engaging course content.
                      </p>
                      <Button onClick={() => addComponent('text')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Component
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  components
                    .sort((a, b) => a.order - b.order)
                    .map((component, index) => {
                      const ComponentIcon = componentTypes.find(ct => ct.type === component.type)?.icon || FileText;

                      return (
                        <Card key={component.id} className="group hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="cursor-move">
                                  <Move className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <ComponentIcon className="h-5 w-5 text-primary" />
                                <div>
                                  <h3 className="font-medium">{component.title}</h3>
                                  <Badge variant="outline" className="text-xs">
                                    {component.type}
                                  </Badge>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedComponent(component)}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => duplicateComponent(component)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteComponent(component.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent>
                            {isPreviewMode ? (
                              renderComponentPreview(component)
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                {component.type === 'text' && component.content.text?.slice(0, 100) + '...'}
                                {component.type === 'video' && `Video: ${component.content.caption || 'No caption'}`}
                                {component.type === 'quiz' && `${component.content.questions?.length || 0} questions`}
                                {component.type === 'code' && `Code block (${component.content.language})`}
                                {!['text', 'video', 'quiz', 'code'].includes(component.type) && `Component: ${component.type}`}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })
                )}
              </div>
            </TabsContent>

            {/* Skill Tree Tab */}
            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Skill Tree Builder
                  </CardTitle>
                  <CardDescription>
                    Create a structured learning path with interconnected skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Skill tree builder coming soon! This will allow you to create
                      Khan Academy-style learning paths with prerequisites and progress tracking.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Assistant Tab */}
            <TabsContent value="ai" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    AI Course Assistant
                  </CardTitle>
                  <CardDescription>
                    Generate course content with artificial intelligence
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Describe what you want to create</Label>
                    <Textarea
                      placeholder="e.g., Create an introduction to algorithms with examples in Python, including quiz questions..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Content Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lesson">Lesson</SelectItem>
                        <SelectItem value="exercise">Exercise</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={() => generateWithAI.mutate("Sample prompt")}
                      disabled={generateWithAI.isPending}
                    >
                      {generateWithAI.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Component Editor Dialog */}
      {selectedComponent && (
        <Dialog open={!!selectedComponent} onOpenChange={() => setSelectedComponent(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit {selectedComponent.type} Component</DialogTitle>
              <DialogDescription>
                Configure the content and settings for this component
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="comp-title">Title</Label>
                <Input
                  id="comp-title"
                  value={selectedComponent.title}
                  onChange={(e) => updateComponent(selectedComponent.id, { title: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="required"
                    checked={selectedComponent.isRequired}
                    onChange={(e) => updateComponent(selectedComponent.id, { isRequired: e.target.checked })}
                  />
                  <Label htmlFor="required">Required</Label>
                </div>

                <div>
                  <Label htmlFor="time">Estimated Time (minutes)</Label>
                  <Input
                    id="time"
                    type="number"
                    value={selectedComponent.estimatedTime || 5}
                    onChange={(e) => updateComponent(selectedComponent.id, { estimatedTime: parseInt(e.target.value) })}
                    className="w-24"
                  />
                </div>
              </div>

              {renderComponentEditor(selectedComponent)}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedComponent(null)}>
                  Cancel
                </Button>
                <Button onClick={() => setSelectedComponent(null)}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
