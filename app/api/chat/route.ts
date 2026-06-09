import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey: apiKey });
    console.log("GELEN API ANAHTARI:", apiKey);

    if (!apiKey) {
      return NextResponse.json(
        { error: "API anahtarı eksik!" },
        { status: 500 },
      );
    }
    const systemInstruction =
      'Sen KRTS Güzellik Merkezi asistanısın. Tek görevin cevabını tırnak işaretlerine uygun, düzgün bir JSON objesi olarak dönmektir. Asla JSON dışında açıklama yazma. Format: {"reply": "mesajın", "extractedData": {"service": "", "location": "", "status": "PENDING"}}';
    const contents = (history || []).map((msg: any) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text || "İşlem." }],
    }));
    contents.unshift({ role: "user", parts: [{ text: systemInstruction }] });
    contents.push({ role: "user", parts: [{ text: message }] });

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "KRTS Assistant",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          max_tokens: 1000, 
          messages: [
            { role: "system", content: systemInstruction },
            ...contents.map((c: any) => ({
              role: c.role === "user" ? "user" : "assistant",
              content: c.parts[0].text,
            })),
          ],
          response_format: { type: "json_object" },
        }),
      },
    );

    const data = await response.json();

    if (data.error) {
      console.error("OpenRouter Hatası:", data.error);
      throw new Error(data.error.message);
    }

    const aiAnswer = data.choices[0].message.content.trim();
    console.log("GEMINI'DAN GELEN CEVAP:", aiAnswer);
    try {
      const cleanJson = aiAnswer.replace(/```json|```/g, "").trim();
      return NextResponse.json(JSON.parse(cleanJson));
    } catch (e) {
      return NextResponse.json({
        reply: aiAnswer,
        extractedData: { service: "", location: "", status: "PENDING" },
      });
    }
  } catch (error: any) {
    console.error("KODUN ÇÖKME SEBEBİ (GERÇEK HATA):", error);

    return NextResponse.json({
      reply:
        "Sohbet odasında ufak bir yenileme yaptım. Bana yardımcı olmamı istediğiniz konuyu tekrar yazar mısınız? 😊",
      extractedData: { status: "PENDING" },
    });
  }
}
