import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Subject } from "@shared/types";

interface SubjectFormProps {
  initialData?: Partial<Subject>;
  onSubmit: (data: Partial<Subject>) => void;
}

export function SubjectForm({ initialData, onSubmit }: SubjectFormProps) {
  const [formData, setFormData] = React.useState<Partial<Subject>>(
    initialData || {
      name: "",
      hours: 0,
      minutes: 0,
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hours">Horas</Label>
          <Input
            id="hours"
            type="number"
            min="0"
            value={formData.hours}
            onChange={(e) =>
              setFormData({ ...formData, hours: parseInt(e.target.value) || 0 })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minutes">Minutos</Label>
          <Input
            id="minutes"
            type="number"
            min="0"
            max="59"
            value={formData.minutes}
            onChange={(e) =>
              setFormData({
                ...formData,
                minutes: parseInt(e.target.value) || 0,
              })
            }
            required
          />
        </div>
      </div>

      <button type="submit" className="sr-only">
        Submit
      </button>
    </form>
  );
}
