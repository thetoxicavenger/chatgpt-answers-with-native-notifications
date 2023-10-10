import type { APIRoute } from "astro";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.OPEN_AI_SECRET,
});

export const POST: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const { prompt } = await request.json();

    const { choices } = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const [
      {
        message: { content },
      },
    ] = choices;

    return new Response(
      JSON.stringify({
        answer: content,
      }),
      {
        status: 200,
      }
    );
  }

  return new Response(null, { status: 422 });
};
