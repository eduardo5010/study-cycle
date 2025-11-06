import React from "react";
import { cn } from "@/lib/utils";
import type { Course } from "@shared/types/course";
import { SubjectCard } from "@/components/subject-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface CourseViewProps extends React.HTMLAttributes<HTMLDivElement> {
  course: Course;
  onSkillClick?: (skillId: string) => void;
}

export function CourseView({
  course,
  onSkillClick,
  className,
  ...props
}: CourseViewProps) {
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{course.title}</CardTitle>
          <Badge variant={course.isPublished ? "default" : "secondary"}>
            {course.isPublished ? "Publicado" : "Rascunho"}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Criado por {course.createdBy.name}</span>
          <Badge variant="outline" className="ml-2">
            {course.createdBy.type === "ADMIN"
              ? "Administrador"
              : course.createdBy.type === "TEACHER"
              ? "Professor"
              : "IA"}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mt-2">{course.description}</p>
      </CardHeader>
      <CardContent>
        {course.subjects.length > 0 && (
          <Tabs defaultValue={course.subjects[0].id} className="w-full">
            <TabsList className="w-full justify-start mb-4">
              {course.subjects.map((subject, index) => (
                <TabsTrigger key={subject.id} value={subject.id}>
                  Disciplina {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            {course.subjects.map((subject) => (
              <TabsContent key={subject.id} value={subject.id}>
                <SubjectCard subject={subject} onSkillClick={onSkillClick} />
              </TabsContent>
            ))}
          </Tabs>
        )}

        {course.courseTest && (
          <div className="mt-4 p-4 border rounded-md bg-purple-50">
            <h4 className="font-semibold mb-2">Teste do Curso</h4>
            <p className="text-sm">{course.courseTest.title}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
