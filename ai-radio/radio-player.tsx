"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { PauseCircle, PlayCircle, Volume2 } from "lucide-react"

export function RadioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([0.8])
  const [currentTrack, setCurrentTrack] = useState<{
    title: string
    type: "song" | "news"
    path?: string
  } | null>(null)

  const audioContext = useRef<AudioContext>()
  const audioElement = useRef<HTMLAudioElement>()
  const gainNode = useRef<GainNode>()

  useEffect(() => {
    // Initialize Web Audio API
    audioContext.current = new AudioContext()
    audioElement.current = new Audio()
    gainNode.current = audioContext.current.createGain()

    const source = audioContext.current.createMediaElementSource(audioElement.current)
    source.connect(gainNode.current)
    gainNode.current.connect(audioContext.current.destination)

    // Set up SSE connection
    const eventSource = new EventSource("/api/radio")

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === "song") {
        setCurrentTrack({
          title: data.title,
          type: "song",
          path: data.path,
        })
        audioElement.current!.src = data.path
        if (isPlaying) {
          audioElement.current!.play()
        }
      } else if (data.type === "news") {
        setCurrentTrack({
          title: "Latest News Update",
          type: "news",
        })
        // Convert the audio buffer to a playable format
        const blob = new Blob([data.content], { type: "audio/mpeg" })
        const url = URL.createObjectURL(blob)
        audioElement.current!.src = url
        if (isPlaying) {
          audioElement.current!.play()
        }
      }
    }

    return () => {
      eventSource.close()
      audioContext.current?.close()
    }
  }, [isPlaying])

  useEffect(() => {
    if (gainNode.current) {
      gainNode.current.gain.value = volume[0]
    }
  }, [volume])

  const togglePlayback = () => {
    if (!isPlaying) {
      audioContext.current?.resume()
      audioElement.current?.play()
    } else {
      audioElement.current?.pause()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold">AI Radio</h2>
            <p className="text-sm text-muted-foreground">
              {currentTrack ? (
                <>
                  Now Playing: {currentTrack.title}
                  <span className="ml-2 inline-block px-2 py-1 text-xs bg-primary/10 rounded-full">
                    {currentTrack.type === "news" ? "News" : "Music"}
                  </span>
                </>
              ) : (
                "Ready to Play"
              )}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon" className="w-12 h-12" onClick={togglePlayback}>
              {isPlaying ? <PauseCircle className="w-8 h-8" /> : <PlayCircle className="w-8 h-8" />}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <Slider value={volume} onValueChange={setVolume} max={1} step={0.01} className="w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

