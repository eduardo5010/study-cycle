import React from "react";
import { cn } from "@/lib/utils";
import { getSkillLevelColor, getSkillLevelLabel } from "@/lib/skill-utils";
import type { Skill } from "@shared/types/course";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SkillCardProps extends React.HTMLAttributes<HTMLDivElement> {
  skill: Skill;
}

export function SkillCard({ skill, className, ...props }: SkillCardProps) {
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{skill.title}</span>
          <Badge className={cn("ml-2", getSkillLevelColor(skill.level))}>
            {getSkillLevelLabel(skill.level)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{skill.description}</p>
        <div className="mt-4">
          <span className="text-sm font-semibold">
            {skill.exercises.length} exercício(s)
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
