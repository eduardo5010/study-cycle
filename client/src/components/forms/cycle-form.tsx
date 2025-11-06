import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StudyCycle } from "@shared/types";

interface CycleFormProps {
  initialData?: Partial<StudyCycle>;
  onSubmit: (data: Partial<StudyCycle>) => void;
}

export function CycleForm({ initialData, onSubmit }: CycleFormProps) {
  const [formData, setFormData] = React.useState<Partial<StudyCycle>>(
    initialData || {
      name: "",
      totalWeeks: 1,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="totalWeeks">Total de Semanas</Label>
        <Input
          id="totalWeeks"
          type="number"
          min="1"
          value={formData.totalWeeks}
          onChange={(e) =>
            setFormData({
              ...formData,
              totalWeeks: parseInt(e.target.value) || 1,
            })
          }
          required
        />
      </div>

      <button type="submit" className="sr-only">
        Submit
      </button>
    </form>
  );
}
