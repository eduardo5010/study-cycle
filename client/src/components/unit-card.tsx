import React from "react";
import { cn } from "@/lib/utils";
import type { Unit } from "@shared/types/course";
import { ChapterCard } from "@/components/chapter-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface UnitCardProps extends React.HTMLAttributes<HTMLDivElement> {
  unit: Unit;
  onSkillClick?: (skillId: string) => void;
}

export function UnitCard({
  unit,
  onSkillClick,
  className,
  ...props
}: UnitCardProps) {
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>{unit.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{unit.description}</p>

        {unit.chapters.length > 0 && (
          <ScrollArea className="h-[400px] rounded-md border">
            <Accordion type="single" collapsible className="w-full">
              {unit.chapters.map((chapter, index) => (
                <AccordionItem key={chapter.id} value={chapter.id}>
                  <AccordionTrigger className="px-4">
                    Capítulo {index + 1}: {chapter.title}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <ChapterCard
                      chapter={chapter}
                      onSkillClick={onSkillClick}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        )}

        {unit.unitTest && (
          <div className="mt-4 p-4 border rounded-md bg-yellow-50">
            <h4 className="font-semibold mb-2">Teste da Unidade</h4>
            <p className="text-sm">{unit.unitTest.title}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
