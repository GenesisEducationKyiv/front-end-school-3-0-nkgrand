import { Button } from 'antd';
import { observer } from 'mobx-react-lite';
import { Waveform } from './Waweform';
import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { player } from '../../../stores/Player';

interface TrackPlayerProps {
  id: string;
  fileUrl: string;
}

export const TrackPlayer = observer(({ id, fileUrl }: TrackPlayerProps) => {
  const isCurrent = player.activeTrackId === id;
  return (
    <div
      data-testid={`audio-player-${id}`}
      style={{ display: 'flex', alignItems: 'center', width: '100%' }}
    >
      <Button
        icon={isCurrent ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
        type="link"
        size="small"
        onClick={() => {
          if (isCurrent) {
            player.pause();
          } else {
            player.play(id);
          }
        }}
        data-testid={`${isCurrent ? 'pause' : 'play'}-button-${id}`}
        style={{ marginRight: 8 }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <Waveform
          src={fileUrl}
          playing={isCurrent}
          dataTestId={`audio-progress-${id}`}
        />
      </div>
    </div>
  );
});
