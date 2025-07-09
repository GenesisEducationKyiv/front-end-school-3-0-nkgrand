import { makeAutoObservable } from "mobx"

/**
 * Contain all the info related to the current playing track
 */
export class Player {
  activeTrackId: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  get isPlaying() {
    return this.activeTrackId != null
  }

  togglePlay = (trackId: string) => {
    if (this.isPlaying) {
      this.pause()
      return this
    }

    this.play(trackId)
    return this
  }

  play = (trackId: string) => {
    this.activeTrackId = trackId
    return this
  }

  pause = () => {
    this.activeTrackId = null
    return
  }
}

export const player = new Player()
