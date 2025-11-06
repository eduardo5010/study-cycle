import { SkillLevel } from "@shared/types/course";

export function getSkillLevelColor(level: SkillLevel): string {
  switch (level) {
    case SkillLevel.NOT_STARTED:
      return "bg-gray-200";
    case SkillLevel.ATTEMPTED:
      return "bg-yellow-200";
    case SkillLevel.FAMILIAR:
      return "bg-blue-200";
    case SkillLevel.PROFICIENT:
      return "bg-green-200";
    case SkillLevel.MASTERED:
      return "bg-purple-200";
    default:
      return "bg-gray-200";
  }
}

export function getSkillLevelLabel(level: SkillLevel): string {
  switch (level) {
    case SkillLevel.NOT_STARTED:
      return "Não iniciado";
    case SkillLevel.ATTEMPTED:
      return "Tentativa";
    case SkillLevel.FAMILIAR:
      return "Familiar";
    case SkillLevel.PROFICIENT:
      return "Proficiente";
    case SkillLevel.MASTERED:
      return "Dominado";
    default:
      return "Desconhecido";
  }
}
