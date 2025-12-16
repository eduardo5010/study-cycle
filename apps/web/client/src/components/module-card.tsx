import React from "react";
import { cn } from "@/lib/utils";
import type { Module } from "@shared/types/course";
import { UnitCard } from "@/components/unit-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ModuleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  module: Module;
  onSkillClick?: (skillId: string) => void;
}

export function ModuleCard({
  module,
  onSkillClick,
  className,
  ...props
}: ModuleCardProps) {
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>{module.title}</CardTitle>
        <p className="text-sm text-gray-600">{module.description}</p>
      </CardHeader>
      <CardContent>
        {module.units.length > 0 && (
          <Tabs defaultValue={module.units[0].id} className="w-full">
            <TabsList className="w-full justify-start">
              {module.units.map((unit, index) => (
                <TabsTrigger key={unit.id} value={unit.id}>
                  Unidade {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            {module.units.map((unit) => (
              <TabsContent key={unit.id} value={unit.id}>
                <UnitCard unit={unit} onSkillClick={onSkillClick} />
              </TabsContent>
            ))}
          </Tabs>
        )}

        {module.moduleTest && (
          <div className="mt-4 p-4 border rounded-md bg-orange-50">
            <h4 className="font-semibold mb-2">Teste do Módulo</h4>
            <p className="text-sm">{module.moduleTest.title}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
