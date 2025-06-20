import { Upload, Button, Popconfirm, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { type Track } from '../../../schemas/track.schema';
import { TrackPlayer } from './TrackPlayer';
import useNotification from 'antd/es/notification/useNotification';
import { useTrackStore } from '../../../context/TrackStoreContext';
import { type Result, ok, err } from 'neverthrow';
import { isError } from '../../../utils/isError';

interface Props {
  track: Track;
}

export const CellAudioPlayer = ({ track }: Props) => {
  const trackStore = useTrackStore();
  const [notif, contextHolder] = useNotification();

  const handleUpload = async ({ file }: { file: File }) => {
    const result = await trackStore
      .uploadTrackFile(track.id, file)
      .then(() => ok(undefined))
      .catch((e: unknown) => err(isError(e) ? e : new Error(String(e))));

    await result.match(
      async () => {
        await trackStore.fetchTracks();
        notif.success({
          message: <span data-testid="toast-success">Audio uploaded</span>,
        });
      },
      (e) => {
        notif.error({
          message: <span data-testid="toast-error">Upload failed</span>,
          description: e.message,
        });
      }
    );
  };

  const handleRemove = async () => {
    const result: Result<void, Error> = await trackStore
      .removeTrackFile(track.id)
      .then(() => ok(undefined))
      .catch((e: unknown) => err(isError(e) ? e : new Error(String(e))));

    await result.match(
      async () => {
        await trackStore.fetchTracks();
        notif.success({
          message: <span data-testid="toast-success">Audio removed</span>,
        });
      },
      (e) => {
        notif.error({
          message: <span data-testid="toast-error">Removal failed</span>,
          description: e.message,
        });
      }
    );
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
            fileUrl={`/api/files/${track.audioFile ?? ''}`}
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
