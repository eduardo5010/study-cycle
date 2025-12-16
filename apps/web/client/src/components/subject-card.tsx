import React from "react";
import { cn } from "@/lib/utils";
import type { Subject } from "@shared/types/course";
import { ModuleCard } from "@/components/module-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SubjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  subject: Subject;
  onSkillClick?: (skillId: string) => void;
}

export function SubjectCard({
  subject,
  onSkillClick,
  className,
  ...props
}: SubjectCardProps) {
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>{subject.title}</CardTitle>
        <p className="text-sm text-gray-600">{subject.description}</p>
      </CardHeader>
      <CardContent>
        {subject.modules.length > 0 && (
          <ScrollArea className="h-[600px]">
            <Accordion type="single" collapsible className="w-full">
              {subject.modules.map((module, index) => (
                <AccordionItem key={module.id} value={module.id}>
                  <AccordionTrigger className="px-4">
                    Módulo {index + 1}: {module.title}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    <ModuleCard module={module} onSkillClick={onSkillClick} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        )}

        {subject.subjectTest && (
          <div className="mt-4 p-4 border rounded-md bg-red-50">
            <h4 className="font-semibold mb-2">Teste da Disciplina</h4>
            <p className="text-sm">{subject.subjectTest.title}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
