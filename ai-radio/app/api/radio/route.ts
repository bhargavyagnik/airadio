import { NextResponse } from "next/server"
import { ElevenLabsClient, play } from "elevenlabs";
import { headers } from "next/headers"
import { promises as fs } from "fs"
import path from "path"
import * as dotenv from "dotenv";
import { parseFile } from 'music-metadata';
import Groq from 'groq-sdk';
import { NextRequest } from 'next/server';
import { Readable } from 'stream';
import { getCurrentVoiceId } from './set-voice/route';

dotenv.config();
// Initialize ElevenLabs
const eleven = new ElevenLabsClient();
const groq = new Groq();

// Function to get all MP3 files from the music directory
async function getMusicFiles() {
  const musicDir = path.join(process.cwd(), "public/music")
  const files = await fs.readdir(musicDir)
  const musicFiles = []

  for (const file of files) {
    if (file.endsWith(".mp3")) {
      const filePath = path.join(musicDir, file)
      const metadata = await parseFile(filePath)
      const duration = metadata.format.duration || 180 // Default to 180 if duration is not available

      musicFiles.push({
        id: file,
        title: file.replace(".mp3", ""),
        path: `/music/${file}`,
        duration: duration, // Use dynamic duration
      })
    }
  }

  return musicFiles
}

let songQueue: Array<{
  id: string
  title: string
  path: string
  duration: number
}> = []

let songCount = 0

// Initialize song queue
getMusicFiles().then((files) => {
  songQueue = files
})

// Add these at the top with other state variables
let isPlaying = true;
let currentCommand: string | null = null;

// Ensure isPlaying is set to false when a command is received
if (currentCommand) {
  // Stop current playback
  isPlaying = false;
  songQueue = [];
  songCount = 0;
}

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

async function generateNews(): Promise<string> {
  const chatCompletion = await groq.chat.completions.create({
    messages: [{ 
      role: "user", 
      content: "Generate a brief 2-3 sentence news update about current technology or AI trends. Make it sound like a radio news segment." 
    }],
    model: "llama-3.1-8b-instant",
    temperature: 0.9,
    max_completion_tokens: 256,
    stream: false
  });

  return chatCompletion.choices[0]?.message?.content || '';
}

async function generateNewsAudio(newsText: string): Promise<string> {
  const voiceId = getCurrentVoiceId() || "pNInz6obpgDQGcFmaJgB";
  
  const audioStream = await eleven.textToSpeech.convert(voiceId, {
    text: newsText,
    model_id: "eleven_flash_v2_5",
    output_format: "mp3_44100_128",
  });

  const audioBuffer = await streamToBuffer(audioStream as unknown as Readable);
  const base64Audio = audioBuffer.toString('base64');
  return `data:audio/mp3;base64,${base64Audio}`;
}

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const sendEvent = async (data: any) => {
    await writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  // Simulate radio stream
  const streamRadio = async () => {
    while (true) {
      songCount++;
      
      // Play a random song
      const song = songQueue[Math.floor(Math.random() * songQueue.length)];
      await sendEvent({
        type: 'song',
        ...song
      });

      // After every 3 songs, play a news segment
      if (songCount % 1 === 0) {
        const newsText = await generateNews();
        const newsAudio = await generateNewsAudio(newsText);
        
        await sendEvent({
          type: 'news',
          text: newsText,
          content: newsAudio
        });
      }

      // Wait for song duration before playing next
      await new Promise(resolve => setTimeout(resolve, song.duration * 1000));
    }
  };

  streamRadio().catch(console.error);

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Add this new endpoint to handle command updates
export async function POST(request: Request) {
  const { command } = await request.json();
  currentCommand = command;
  return NextResponse.json({ success: true });
}

