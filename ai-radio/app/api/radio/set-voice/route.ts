import { NextRequest, NextResponse } from 'next/server';

let currentVoiceId: string  = "21m00Tcm4TlvDq8ikWAM";

export async function POST(request: NextRequest) {
  try {
    const { voiceId } = await request.json();
    currentVoiceId = voiceId; // Store the selected voice ID
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error setting voice ID:', error);
    return NextResponse.json({ success: false, error: 'Failed to set voice ID' }, { status: 500 });
  }
}

export function getCurrentVoiceId() {
  return currentVoiceId; // Function to retrieve the current voice ID
} 