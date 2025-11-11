import React from "react";
import { cn } from "@/lib/utils";
import type { Unit } from "@shared/types/course";
import { ChapterCard } from "@/components/chapter-card";
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
  const { getVariantFor, reportOutcome, getNextInterval } = useReview();
  const { user } = useAuth();
  const [currentVariant, setCurrentVariant] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRec, setLastRec] = useState<number | null>(null);

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{unit.title}</span>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                Revisar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Revisão: {unit.title}</DialogTitle>
                <DialogDescription>
                  Pratique este conteúdo com variantes de revisão.
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
                      const v = await getVariantFor(unit.id, user?.id);
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
                        itemId: unit.id,
                        variantId: currentVariant.id || null,
                        correctness: 0,
                      });
                      const rec = await getNextInterval({
                        userId: user?.id,
                        itemId: unit.id,
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
                        itemId: unit.id,
                        variantId: currentVariant.id || null,
                        correctness: 1,
                      });
                      const rec = await getNextInterval({
                        userId: user?.id,
                        itemId: unit.id,
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
        </CardTitle>
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
