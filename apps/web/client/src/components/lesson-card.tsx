import React from "react";
import { cn } from "@/lib/utils";
import type { Lesson } from "@shared/types/course";
import { SkillCard } from "@/components/skill-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VideoIcon, FileTextIcon, Brain } from "lucide-react";
import { VideoPlayer } from "@/components/video-player";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useReview } from "@/hooks/use-review";
import { useAuth } from "@/contexts/auth-context";

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
  const { getVariantFor, reportOutcome, getNextInterval } = useReview();
  const { user } = useAuth();
  const [currentVariant, setCurrentVariant] = useState<any | null>(null);
  const [isLoadingVariant, setIsLoadingVariant] = useState(false);
  const [lastRecommendation, setLastRecommendation] = useState<number | null>(
    null
  );
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
              <div className="text-sm flex items-center justify-between">
                <div>
                  <span className="font-semibold">Questionário:</span>{" "}
                  {lesson.quiz.title}
                </div>
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Revisar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Revisão: {lesson.quiz.title}</DialogTitle>
                        <DialogDescription>
                          Pratique com variantes geradas automaticamente ou
                          fornecidas por instrutores.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">
                        {isLoadingVariant && <div>Carregando variante...</div>}
                        {!isLoadingVariant && !currentVariant && (
                          <div className="text-sm text-muted-foreground">
                            Clique em "Carregar" para obter uma variante de
                            revisão.
                          </div>
                        )}
                        {!isLoadingVariant && currentVariant && (
                          <div className="space-y-3">
                            <div className="font-semibold">
                              {currentVariant.content?.question ||
                                currentVariant.content?.prompt ||
                                currentVariant.title ||
                                "Pergunta"}
                            </div>
                            {currentVariant.content?.choices && (
                              <ul className="list-disc list-inside ml-4">
                                {currentVariant.content.choices.map(
                                  (c: string, i: number) => (
                                    <li key={i}>{c}</li>
                                  )
                                )}
                              </ul>
                            )}
                            {lastRecommendation && (
                              <div className="text-sm text-muted-foreground">
                                Próxima revisão recomendada em{" "}
                                {Math.round(lastRecommendation / 86400)} dias
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            onClick={async () => {
                              // load variant
                              setIsLoadingVariant(true);
                              const v = await getVariantFor(
                                lesson.quiz!.id,
                                user?.id
                              );
                              setCurrentVariant(v);
                              setIsLoadingVariant(false);
                            }}
                          >
                            Carregar
                          </Button>
                          <Button
                            variant="outline"
                            onClick={async () => {
                              if (!currentVariant) return;
                              // mark incorrect
                              await reportOutcome({
                                userId: user?.id || "anonymous",
                                itemId: lesson.quiz!.id,
                                variantId: currentVariant.id || null,
                                correctness: 0,
                              });
                              const rec = await getNextInterval({
                                userId: user?.id,
                                itemId: lesson.quiz!.id,
                              });
                              setLastRecommendation(
                                rec?.recommendedIntervalSec || null
                              );
                              // clear variant to avoid repeat
                              setCurrentVariant(null);
                            }}
                          >
                            Não lembro
                          </Button>
                          <Button
                            onClick={async () => {
                              if (!currentVariant) return;
                              await reportOutcome({
                                userId: user?.id || "anonymous",
                                itemId: lesson.quiz!.id,
                                variantId: currentVariant.id || null,
                                correctness: 1,
                              });
                              const rec = await getNextInterval({
                                userId: user?.id,
                                itemId: lesson.quiz!.id,
                              });
                              setLastRecommendation(
                                rec?.recommendedIntervalSec || null
                              );
                              setCurrentVariant(null);
                            }}
                          >
                            Lembrei
                          </Button>
                        </div>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
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
