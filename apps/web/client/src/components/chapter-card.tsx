import React from "react";
import { cn } from "@/lib/utils";
import type { Chapter } from "@shared/types/course";
import { LessonCard } from "@/components/lesson-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ChapterCardProps extends React.HTMLAttributes<HTMLDivElement> {
  chapter: Chapter;
  onSkillClick?: (skillId: string) => void;
}

export function ChapterCard({
  chapter,
  onSkillClick,
  className,
  ...props
}: ChapterCardProps) {
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>{chapter.title}</CardTitle>
        <p className="text-sm text-gray-600">{chapter.description}</p>
      </CardHeader>
      <CardContent>
        {chapter.lessons.length > 0 && (
          <ScrollArea className="h-[400px]">
            <Accordion type="single" collapsible className="w-full">
              {chapter.lessons.map((lesson, index) => (
                <AccordionItem key={lesson.id} value={lesson.id}>
                  <AccordionTrigger className="px-4">
                    Lição {index + 1}: {lesson.title}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <LessonCard lesson={lesson} onSkillClick={onSkillClick} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
