import { Button, Popconfirm, Space } from "antd";
import { TrackPlayer } from "./TrackPlayer";

interface AudioPlayerSectionProps {
  fileUrl: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRemove: () => void;
  uploading: boolean;
  trackId: string;
};

export const AudioPlayerSection = ({
  fileUrl,
  isPlaying,
  onTogglePlay,
  onRemove,
  uploading,
  trackId,
}: AudioPlayerSectionProps) => (
  <div data-testid="audio-player">
    <Space direction="vertical" style={{ width: '100%' }}>
      <TrackPlayer
        id={trackId}
        fileUrl={fileUrl}
        isPlaying={isPlaying}
        onToggle={onTogglePlay}
      />
      <Popconfirm
        title="Remove audio?"
        onConfirm={onRemove}
        okButtonProps={{ 'data-testid': 'confirm-delete' }}
        cancelButtonProps={{ 'data-testid': 'cancel-delete' }}
      >
        <Button
          danger
          loading={uploading}
          disabled={uploading}
          aria-disabled={uploading}
        >
          Remove File
        </Button>
      </Popconfirm>
    </Space>
  </div>
);