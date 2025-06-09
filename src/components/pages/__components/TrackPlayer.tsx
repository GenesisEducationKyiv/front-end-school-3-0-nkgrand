import React from 'react';
import { Button } from 'antd';
import { Waveform } from './Waweform';
import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';

interface TrackPlayerProps {
  id: string;
  fileUrl: string;
  isPlaying: boolean;
  onToggle: () => void;
};

export const TrackPlayer = React.memo(
  ({ id, fileUrl, isPlaying, onToggle }: TrackPlayerProps) => (
    <div data-testid={`audio-player-${id}`}>
      <Waveform
        src={fileUrl}
        playing={isPlaying}
        dataTestId={`audio-progress-${id}`}
      />
      <Button
        icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
        type="link"
        onClick={onToggle}
        data-testid={`${isPlaying ? 'pause' : 'play'}-button-${id}`}
      />
    </div>
  )
);
