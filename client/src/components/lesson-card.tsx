import React from "react";
import { cn } from "@/lib/utils";
import type { Lesson } from "@shared/types/course";
import { SkillCard } from "@/components/skill-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VideoIcon, FileTextIcon, Brain } from "lucide-react";
import { VideoPlayer } from "@/components/video-player";

interface LessonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  lesson: Lesson;
  onSkillClick?: (skillId: string) => void;
}

export function LessonCard({
  lesson,
  onSkillClick,
  className,
  ...props
}: LessonCardProps) {
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>{lesson.title}</CardTitle>
        <div className="flex space-x-2 text-sm text-muted-foreground">
          {lesson.videoUrl && <VideoIcon className="h-4 w-4" />}
          {lesson.theory && <FileTextIcon className="h-4 w-4" />}
          {lesson.skills.length > 0 && <Brain className="h-4 w-4" />}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>

        {lesson.videoUrl && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Vídeo</h4>
            <VideoPlayer url={lesson.videoUrl} title={lesson.title} />
          </div>
        )}

        {lesson.theory && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">Teoria</h4>
            <div className="prose prose-sm max-w-none">{lesson.theory}</div>
          </div>
        )}

        {lesson.skills.length > 0 && (
          <>
            <h4 className="font-semibold mb-2">Habilidades</h4>
            <ScrollArea className="h-[200px] rounded-md border p-4">
              <div className="space-y-2">
                {lesson.skills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    onClick={() => onSkillClick?.(skill.id)}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  />
                ))}
              </div>
            </ScrollArea>
          </>
        )}

        {(lesson.quiz || lesson.assignments.length > 0) && (
          <div className="mt-4 space-y-2">
            {lesson.quiz && (
              <div className="text-sm">
                <span className="font-semibold">Questionário:</span>{" "}
                {lesson.quiz.title}
              </div>
            )}
            {lesson.assignments.length > 0 && (
              <div className="text-sm">
                <span className="font-semibold">Tarefas:</span>
                <ul className="list-disc list-inside ml-2">
                  {lesson.assignments.map((assignment) => (
                    <li key={assignment.id}>{assignment.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
