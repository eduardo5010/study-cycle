import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Plus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type CardType = "subject" | "module" | "unit" | "chapter" | "lesson" | "skill";

interface CardItem {
  id: string;
  type: CardType;
  title: string;
  description?: string;
  progress?: number;
  items?: CardItem[];
}

interface Props {
  courseId?: string;
  initialData?: CardItem[];
  onChange?: (data: CardItem[]) => void;
}

export function CourseEditor({ courseId, initialData = [], onChange }: Props) {
  const { t } = useLanguage();
  const [cards, setCards] = useState<CardItem[]>(initialData);
  const [availableCards, setAvailableCards] = useState<CardItem[]>([]);

  useEffect(() => {
    // Carregar cards disponíveis do backend
    // TODO: Implementar chamada à API
    setAvailableCards([
      {
        id: "new-subject",
        type: "subject",
        title: "Nova Disciplina",
        progress: 0,
        items: [],
      },
      {
        id: "new-module",
        type: "module",
        title: "Novo Módulo",
        progress: 0,
        items: [],
      },
      // ... outros tipos de cards
    ]);
  }, []);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceList = [...cards];
    let movedItem: CardItem | undefined;

    // Se for um novo card do painel de disponíveis
    if (source.droppableId === "available-cards") {
      const newCard = { ...availableCards[source.index] };
      newCard.id = `${newCard.type}-${Date.now()}`;
      movedItem = newCard;
    } else {
      // Se for movendo um card existente
      movedItem = sourceList.splice(source.index, 1)[0];
    }

    if (movedItem) {
      sourceList.splice(destination.index, 0, movedItem);
      setCards(sourceList);
      onChange?.(sourceList);
    }
  };

  const updateProgress = (cardId: string, progress: number) => {
    const updateCardProgress = (items: CardItem[]): CardItem[] => {
      return items.map((item) => {
        if (item.id === cardId) {
          return { ...item, progress };
        }
        if (item.items) {
          return {
            ...item,
            items: updateCardProgress(item.items),
            // Atualizar progresso do card pai baseado na média dos filhos
            progress:
              item.items.reduce((acc, curr) => acc + (curr.progress || 0), 0) /
              item.items.length,
          };
        }
        return item;
      });
    };

    const updatedCards = updateCardProgress(cards);
    setCards(updatedCards);
    onChange?.(updatedCards);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-4 gap-4">
        {/* Painel de cards disponíveis */}
        <div className="col-span-1 bg-muted p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">{t("available_cards")}</h3>
          <Droppable droppableId="available-cards">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2"
              >
                {availableCards.map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card className="bg-card hover:bg-accent cursor-move">
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm">
                              {card.title}
                            </CardTitle>
                          </CardHeader>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Área de edição do curso */}
        <div className="col-span-3">
          <Droppable droppableId="course-content">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {cards.map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card className="bg-card">
                          <CardHeader className="p-4">
                            <CardTitle>{card.title}</CardTitle>
                            {card.description && (
                              <p className="text-sm text-muted-foreground">
                                {card.description}
                              </p>
                            )}
                          </CardHeader>
                          <CardContent>
                            <Progress value={card.progress || 0} />
                            {card.items && card.items.length > 0 && (
                              <div className="mt-4 space-y-2">
                                {card.items.map((item) => (
                                  <Card key={item.id} className="bg-background">
                                    <CardHeader className="p-3">
                                      <CardTitle className="text-sm">
                                        {item.title}
                                      </CardTitle>
                                      <Progress value={item.progress || 0} />
                                    </CardHeader>
                                  </Card>
                                ))}
                              </div>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2"
                              onClick={() => {
                                // TODO: Implementar adição de sub-items
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              {t("add_item")}
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
}
