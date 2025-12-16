import React from "react";
import { cn } from "@/lib/utils";
import { getSkillLevelColor, getSkillLevelLabel } from "@/lib/skill-utils";
import type { Skill } from "@shared/types/course";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface SkillCardProps extends React.HTMLAttributes<HTMLDivElement> {
  skill: Skill;
}

export function SkillCard({ skill, className, ...props }: SkillCardProps) {
  const { getVariantFor, reportOutcome, getNextInterval } = useReview();
  const { user } = useAuth();
  const [currentVariant, setCurrentVariant] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRec, setLastRec] = useState<number | null>(null);

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <span>{skill.title}</span>
            <div className="text-xs text-muted-foreground">
              {skill.exercises.length} exercício(s)
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={cn("ml-2", getSkillLevelColor(skill.level))}>
              {getSkillLevelLabel(skill.level)}
            </Badge>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  Revisar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Revisão: {skill.title}</DialogTitle>
                  <DialogDescription>
                    Obtenha variantes de revisão para praticar esta habilidade.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  {isLoading && <div>Carregando...</div>}
                  {!isLoading && !currentVariant && (
                    <div className="text-sm text-muted-foreground">
                      Clique em Carregar para obter uma variante.
                    </div>
                  )}
                  {!isLoading && currentVariant && (
                    <div>
                      <div className="font-semibold">
                        {currentVariant.content?.question ||
                          currentVariant.content?.prompt}
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
                      {lastRec && (
                        <div className="text-sm text-muted-foreground mt-2">
                          Próxima revisão em {Math.round(lastRec / 86400)} dias
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
                        setIsLoading(true);
                        const v = await getVariantFor(
                          skill.exercises?.[0]?.id || skill.id,
                          user?.id
                        );
                        setCurrentVariant(v);
                        setIsLoading(false);
                      }}
                    >
                      Carregar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        if (!currentVariant) return;
                        await reportOutcome({
                          userId: user?.id || "anonymous",
                          itemId: skill.exercises?.[0]?.id || skill.id,
                          variantId: currentVariant.id || null,
                          correctness: 0,
                        });
                        const rec = await getNextInterval({
                          userId: user?.id,
                          itemId: skill.exercises?.[0]?.id || skill.id,
                        });
                        setLastRec(rec?.recommendedIntervalSec || null);
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
                          itemId: skill.exercises?.[0]?.id || skill.id,
                          variantId: currentVariant.id || null,
                          correctness: 1,
                        });
                        const rec = await getNextInterval({
                          userId: user?.id,
                          itemId: skill.exercises?.[0]?.id || skill.id,
                        });
                        setLastRec(rec?.recommendedIntervalSec || null);
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
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{skill.description}</p>
      </CardContent>
    </Card>
  );
}
