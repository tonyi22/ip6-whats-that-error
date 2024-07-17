// app/api/chatgpt/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request) {
    const { message } = await request.json();

    const apiKey = process.env.OPENAI_API_KEY;
    console.log(apiKey);
    if (!apiKey) {
        return NextResponse.json({ error: 'OpenAI API key is missing' }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey });

    try {
        console.log("In TRY CATCH")
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: message }
            ],
            model: "gpt-3.5-turbo",
        });

        return NextResponse.json({ reply: completion.choices[0].message.content });
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
