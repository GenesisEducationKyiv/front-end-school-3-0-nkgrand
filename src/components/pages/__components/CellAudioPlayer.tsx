import { Upload, Button, Popconfirm, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { Track } from '../../../types/trackTypes';
import { TrackPlayer } from './TrackPlayer';
import useNotification from 'antd/es/notification/useNotification';
import { useTrackStore } from '../../../context/TrackStoreContext';

interface Props {
  track: Track;
  isCurrent: boolean;
  onToggle: () => void;
}

export const CellAudioPlayer = ({ track, isCurrent, onToggle }: Props) => {
  const trackStore = useTrackStore();
  const [notif, contextHolder] = useNotification();

  const handleUpload = async ({ file }: { file: File }) => {
    try {
      await trackStore.uploadTrackFile(track.id, file);
      await trackStore.fetchTracks();
      notif.success({
        message: <span data-testid="toast-success">Audio uploaded</span>,
      });
    } catch (e) {
      notif.error({
        message: <span data-testid="toast-error">Upload failed</span>,
        description: String(e),
      });
    }
  };

  const handleRemove = async () => {
    try {
      await trackStore.removeTrackFile(track.id);
      await trackStore.fetchTracks();
      notif.success({
        message: <span data-testid="toast-success">Audio removed</span>,
      });
    } catch (e) {
      notif.error({
        message: <span data-testid="toast-error">Removal failed</span>,
        description: String(e),
      });
    }
  };

  const hasAudio = Boolean(track.audioFile);

  return (
    <>
      {contextHolder}
      {hasAudio ? (
        <Space
          direction="vertical"
          style={{ width: '100%' }}
          data-testid={`audio-block-${track.id}`}
        >
          <TrackPlayer
            id={track.id}
            fileUrl={`/api/files/${track.audioFile}`}
            isPlaying={isCurrent}
            onToggle={onToggle}
          />
          <Popconfirm
            title="Remove audio file?"
            onConfirm={() => {
              void handleRemove();
            }}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ 'data-testid': `remove-confirm-${track.id}` }}
            cancelButtonProps={{ 'data-testid': `remove-cancel-${track.id}` }}
          >
            <Button
              danger
              size="small"
              data-testid={`remove-audio-${track.id}`}
            >
              Remove
            </Button>
          </Popconfirm>
        </Space>
      ) : (
        <Upload
          customRequest={({ file }) => {
            void handleUpload({ file: file as File });
          }}
          showUploadList={false}
          beforeUpload={(file) => {
            const isAudio = file.type.startsWith('audio/');
            const isSmall = file.size / 1024 / 1024 < 10;
            if (!isAudio) {
              notif.error({
                message: (
                  <span data-testid="toast-error">
                    Only audio files allowed
                  </span>
                ),
              });
              return Upload.LIST_IGNORE;
            }
            if (!isSmall) {
              notif.error({
                message: (
                  <span data-testid="toast-error">
                    File must be smaller than 10MB
                  </span>
                ),
              });
              return Upload.LIST_IGNORE;
            }
            return true;
          }}
        >
          <Button
            size="small"
            icon={<UploadOutlined />}
            data-testid={`upload-track-${track.id}`}
          >
            Upload Audio
          </Button>
        </Upload>
      )}
    </>
  );
};
