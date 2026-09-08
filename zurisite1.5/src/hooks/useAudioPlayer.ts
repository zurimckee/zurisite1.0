import { useRef, useState, useEffect } from "react"
import type { UseAudioPlayerReturn } from "../types"

export function useAudioPlayer(src: string): UseAudioPlayerReturn {
  const audioRef = useRef<HTMLAudioElement>(null!)
  const [isPlaying, setIsPlaying] = useState(false)

  // reset playback state when the track changes (e.g. navigating pages)
  useEffect(() => {
    setIsPlaying(false)
    audioRef.current?.pause()
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }, [src])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch((err) => {
        // autoplay restrictions or load errors land here
        console.error("Playback failed:", err)
      })
    }
    setIsPlaying(!isPlaying)
  }

  return { isPlaying, togglePlay, audioRef }
}