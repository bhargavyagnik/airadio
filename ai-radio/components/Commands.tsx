'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send, Play, Radio, Pause, SkipForward, Volume2, Volume1 } from "lucide-react";
import VoiceSelector from './VoiceSelector';
import Personalization from './Personalization';
import { Settings } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  path: string;
  duration: number;
}

export default function Commands() {
  const [command, setCommand] = useState('');
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [currentNews, setCurrentNews] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);

  useEffect(() => {
    // Create audio element for radio stream
    audioRef.current = new Audio();
    
    // Subscribe to SSE events
    const eventSource = new EventSource('/api/radio');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'song':
          setCurrentSong({
            id: data.id,
            title: data.title,
            path: data.path,
            duration: data.duration
          });
          // Play the song
          if (audioRef.current) {
            audioRef.current.src = data.path;
            audioRef.current.play();
          }
          setCurrentNews(null);
          break;
        case 'news':
          setCurrentNews(data.text);
          if (audioRef.current) {
            audioRef.current.src = data.content;
            audioRef.current.play();
          }
          break;
        case 'command':
          // Handle command response
          break;
      }
    };

    return () => {
      eventSource.close();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    try {
      const response = await fetch('/api/radio/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      const data = await response.json();
      if (data.success) {
        // Store current audio state
        const wasPlaying = isPlaying;
        const currentTime = audioRef.current?.currentTime;
        const currentSrc = audioRef.current?.src;

        // Play the command response
        if (audioRef.current) {
          audioRef.current.src = data.audio;
          audioRef.current.play();
          setIsPlaying(true);

          // When command audio ends, resume previous audio if it was playing
          audioRef.current.onended = () => {
            if (currentSrc && wasPlaying) {
              audioRef.current!.src = currentSrc;
              audioRef.current!.currentTime = currentTime || 0;
              audioRef.current!.play();
            }
          };
        }
        
        setCommand('');
      }
    } catch (error) {
      console.error('Error processing command:', error);
    }
  };

  const playAudio = async () => {
    if (audioQueue.length > 0) {
      const audioSrc = audioQueue[0];
      
      // Use the same audio element for command playback
      if (audioRef.current) {
        audioRef.current.src = audioSrc;
        audioRef.current.play();
        
        // When command audio ends, resume radio stream
        audioRef.current.onended = () => {
          setAudioQueue((prev) => prev.slice(1));
          if (audioQueue.length <= 1 && currentSong) {
            audioRef.current!.src = currentSong.path;
            audioRef.current!.play();
          }
        };
      }
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (change: number) => {
    if (audioRef.current) {
      const newVolume = Math.min(Math.max(audioRef.current.volume + change, 0), 1);
      audioRef.current.volume = newVolume;
    }
  };

  const handleVoiceSelect = async (id: string) => {
    setSelectedVoiceId(id);
    // Send the selected voice ID to the backend
    await fetch('/api/radio/set-voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ voiceId: id }),
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Personalization Sidebar */}

      {/* Current Playing Info */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-2 text-center">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Radio className="h-4 w-4" />
          <span className="font-medium">Now Playing:</span>
        </div>
        {currentSong && (
          <div className="text-lg font-semibold">
            {currentSong.title}
          </div>
        )}
        {currentNews && (
          <div className="text-sm italic">
            News Update: {currentNews}
          </div>
        )}
      </div>

      {/* iPod Controller */}
      <div className="relative w-48 h-48 mx-auto mb-6">
        <div className="absolute w-full h-full rounded-full bg-gradient-to-b from-gray-100 to-gray-300 shadow-lg">
          {/* Center Button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white shadow-inner flex items-center justify-center">
            <button 
              onClick={handlePlayPause}
              className="w-full h-full rounded-full flex items-center justify-center hover:bg-gray-50"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-gray-700" />
              ) : (
                <Play className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>


          {/* Control Buttons */}
          <button 
            onClick={() => handleVolumeChange(0.1)}
            className="absolute top-4 left-1/2 -translate-x-1/2 p-4 hover:text-blue-500"
          >
            <Volume2 className="h-5 w-5" />
          </button>
          
          <button 
            onClick={() => handleVolumeChange(-0.1)}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 p-4 hover:text-blue-500"
          >
            <Volume1 className="h-5 w-5" />
          </button>
          
          <button 
            onClick={playAudio}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 hover:text-blue-500"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>
      </div>

      

      {/* Command Input */}
      <form onSubmit={handleCommand} className="flex gap-2">
        <Input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Type a command..."
          className="flex-1"
        />
        <Button type="submit" size="icon" variant="outline">
          <Send className="h-4 w-4" />
        </Button>
      </form>
      
      {/* Audio Queue */}
      {audioQueue.length > 0 && (
        <div className="flex items-center gap-2">
          <Button 
            onClick={playAudio} 
            variant="secondary"
            className="w-full"
          >
            <Play className="h-4 w-4 mr-2" />
            Play Next Audio ({audioQueue.length} in queue)
          </Button>
        </div>
      )}

      {/* Floating Button for Personalization */}
      <button
        onClick={() => setIsPersonalizationOpen(true)}
        className="fixed bottom-4 right-4 bg-black text-white rounded-full p-3 shadow-lg hover:bg-grey-600 transition"
      >
        <Settings className="h-5 w-5" />
      </button>

      {/* Personalization Modal */}
      {isPersonalizationOpen && (
        <Personalization onClose={() => setIsPersonalizationOpen(false)} />
      )}
    </div>
  );
} 