export type GeneratedItem = {
  type: "flashcard" | "quiz" | "exercise" | "cloze" | string;
  difficulty: "easy" | "medium" | "hard" | string;
  content: any;
  tags?: string[];
};

export async function generateReviewItems(
  contextText: string,
  difficulty: string | undefined,
  modes: string[] | undefined,
  openAiKey?: string
): Promise<GeneratedItem[]> {
  const diff = difficulty || "medium";
  const modeList =
    Array.isArray(modes) && modes.length > 0 ? modes : ["flashcard", "quiz"];

  const prompt = `You are an assistant that generates short review items (flashcards, quizzes, cloze exercises) from source material. Return a JSON array. Each item should have: type (flashcard|quiz|exercise|cloze), difficulty (easy|medium|hard), content (object). For quizzes, provide question, choices (array), answerIndex (number). Keep items concise. Use difficulty=${diff}. Modes:${modeList.join(
    ","
  )}\n\nSource:\n${contextText.slice(0, 4000)}`;

  if (openAiKey) {
    try {
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openAiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Generate review items from source text.",
            },
            { role: "user", content: prompt },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        console.warn("OpenAI generation error", resp.status, txt);
        return [
          {
            type: "flashcard",
            difficulty: diff,
            content: { text: contextText.slice(0, 200) },
          },
        ];
      }

      const data = await resp.json();
      const msg = data?.choices?.[0]?.message?.content;
      if (!msg)
        return [
          {
            type: "flashcard",
            difficulty: diff,
            content: { text: contextText.slice(0, 200) },
          },
        ];

      try {
        const parsed = JSON.parse(msg);
        if (Array.isArray(parsed)) return parsed as GeneratedItem[];
        // if single object, wrap
        return [parsed as GeneratedItem];
      } catch (e) {
        // not JSON — wrap text
        return [
          {
            type: "flashcard",
            difficulty: diff,
            content: { text: String(msg) },
          },
        ];
      }
    } catch (err) {
      console.error("OpenAI call failed", err);
      return [
        {
          type: "flashcard",
          difficulty: diff,
          content: { text: contextText.slice(0, 200) },
        },
      ];
    }
  }

  // fallback mock
  return [
    {
      type: "flashcard",
      difficulty: diff,
      content: { text: contextText.slice(0, 200) },
    },
  ];
}

export default { generateReviewItems };
