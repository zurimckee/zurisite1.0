export interface AudioTrack {
    src: string
    page: string
}

export interface UseAudioPlayerReturn {
    isPlaying: boolean
    togglePlay: () => void
    audioRef: React.RefObject<HTMLAudioElement>
}