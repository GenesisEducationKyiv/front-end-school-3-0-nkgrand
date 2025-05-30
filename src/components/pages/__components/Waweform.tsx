import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

interface WaveformProps {
  src: string;
  playing: boolean;
  dataTestId: string;
}

export const Waveform: React.FC<WaveformProps> = React.memo(
  ({ src, playing, dataTestId }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const prevSrcRef = useRef<string>('');
    const prevPlayingRef = useRef<boolean>(false);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      if (prevSrcRef.current !== src) {
        prevSrcRef.current = src;

        if (wavesurferRef.current) {
          wavesurferRef.current.unAll();
          wavesurferRef.current.destroy();
          wavesurferRef.current = null;
        }

        const wavesurfer = WaveSurfer.create({
          container,
          waveColor: '#d9d9d9',
          progressColor: '#1890ff',
          cursorColor: '#1890ff',
          height: 30,
          normalize: true,
        });

        wavesurfer.load(src).catch((err: unknown) => {
          if (
            typeof err === 'object' &&
            err !== null &&
            'name' in err &&
            (err as { name?: string }).name !== 'AbortError'
          ) {
            console.error('WaveSurfer load error:', err);
          }
        });

        wavesurferRef.current = wavesurfer;
      }

      return () => {
        wavesurferRef.current?.unAll();
        wavesurferRef.current?.destroy();
        wavesurferRef.current = null;
      };
    }, [src]);

    useEffect(() => {
      const ws = wavesurferRef.current;
      if (!ws) return;

      const wasPlaying = prevPlayingRef.current;
      prevPlayingRef.current = playing;

      if (playing && !wasPlaying && !ws.isPlaying()) {
        const playPromise = ws.play();
        if (playPromise instanceof Promise) {
          playPromise.catch((err: unknown) => {
            if (
              typeof err === 'object' &&
              err !== null &&
              'name' in err &&
              typeof (err as { name: unknown }).name === 'string'
            ) {
              const errorName = (err as { name: string }).name;
              if (
                errorName !== 'AbortError' &&
                errorName !== 'NotAllowedError' &&
                errorName !== 'NotSupportedError'
              ) {
                console.error('WaveSurfer play() error:', err);
              }
            } else {
              console.error('WaveSurfer play() unknown error:', err);
            }
          });
        }
      }

      if (!playing && wasPlaying && ws.isPlaying()) {
        ws.pause();
      }
    }, [playing]);

    return (
      <div
        ref={containerRef}
        style={{ width: '100%' }}
        data-testid={dataTestId}
      />
    );
  },
  (prevProps, nextProps) =>
    prevProps.src === nextProps.src && prevProps.playing === nextProps.playing
);
