import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsClient, play } from 'elevenlabs';
import Groq from 'groq-sdk';
import { getCurrentVoiceId } from '../../radio/set-voice/route'; // Import the function to get the current voice ID
import { Readable } from 'stream';

const eleven = new ElevenLabsClient();
const groq = new Groq();

async function streamToArrayBuffer(stream: ReadableStream): Promise<ArrayBuffer> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  
  return result.buffer;
}

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json();
    console.log(command);
    
    // Get response from Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: `You are a fun chatbot that acts as an AI radio jockey! You can do many things, but remember, you can only respond once to each command. If the user asks for a reminder, respond with {"reminder":"the reminder topic...."}. Now, let's see what you can do with this command: ${command}` }],
      model: "llama-3.1-8b-instant",
      temperature: 1,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || '';
    console.log(aiResponse);
    if (aiResponse.includes("{reminder:")) {
      const reminder = aiResponse.split(":")[1].trim();
      return NextResponse.json({ 
        success: true, 
        audio: null,
        text: "reminder set for " + reminder,
        command: command 
      });
    }
    console.log(aiResponse);
    // Get the current voice ID
    const voiceId = getCurrentVoiceId() || "pNInz6obpgDQGcFmaJgB"; // Use a default if none is set

    // Convert response to speech
    const audioStream = await eleven.textToSpeech.convert(voiceId, {
      text: aiResponse,
      model_id: "eleven_flash_v2_5",
      output_format: "mp3_44100_128",
    });

    // Play the audio directly
    await play(audioStream);
    
    // Convert the stream to base64 for sending to client
    const arrayBuffer = await streamToArrayBuffer(audioStream);
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;

    return NextResponse.json({ 
      success: true, 
      audio: audioUrl,
      text: aiResponse,
      command: command 
    });
    
  } catch (error) {
    console.error('Error processing command:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process command' 
    }, { status: 500 });
  }
}
