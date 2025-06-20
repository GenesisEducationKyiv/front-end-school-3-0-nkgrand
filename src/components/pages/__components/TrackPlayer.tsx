import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { Waveform } from './Waweform';
import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { player } from '../../../stores/Player';

interface TrackPlayerProps {
  id: string;
  fileUrl: string;
};

export const TrackPlayer = observer(
  ({ id, fileUrl }: TrackPlayerProps) => {
    return (
      <div data-testid={`audio-player-${id}`}>
        <Waveform
          src={fileUrl}
          playing={player.isPlaying}
          dataTestId={`audio-progress-${id}`}
        />
        <Button
          icon={player.isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          type="link"
          onClick={() => player.togglePlay(id)}
          data-testid={`${player.isPlaying ? 'pause' : 'play'}-button-${id}`}
        />
      </div>
    )
  }
);
