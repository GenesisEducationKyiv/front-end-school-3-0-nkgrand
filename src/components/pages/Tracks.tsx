import { useEffect, useState, useCallback, useMemo } from 'react';
import { Space, Col, Typography, notification } from 'antd';
import { observer } from 'mobx-react-lite';
import { type Track } from '../../schemas/track.schema';
import { CreateEditTrackModal } from './__components/CreateEditTrackModal';
import { debounce } from 'lodash';
import { Controls } from './__components/Controls';
import { TracksTable } from './TracksTable';
import { useTrackStore } from '../../context/TrackStoreContext';
import { isError } from '../../utils/isError';

const INITIAL_PAGE = 1;

const { Title } = Typography;

export const Tracks = observer(() => {
  const trackStore = useTrackStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [notif, contextHolder] = notification.useNotification();
  const [playingId, setPlayingId] = useState<string | null>(null);

  const togglePlay = useCallback((id: string) => {
    setPlayingId((prev) => (prev === id ? null : id));
  }, []);

  const debouncedSetSearchTerm = useMemo(
    () => debounce(setSearchTerm, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTerm(e.target.value);
  };

  const showModal = (track?: Track) => {
    setPlayingId(null);
    setCurrentTrack(track ?? null);
    setIsModalVisible(true);
  };

  const handleClose = useCallback(() => {
    setIsModalVisible(false);
    setCurrentTrack(null);
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      trackStore
        .removeTrack(id)
        .then(() => {
          notif.success({
            message: <span data-testid="toast-success">Track was deleted</span>,
          });
        })
        .catch((e: unknown) => {
          const message = isError(e) ? e.message : 'Unknown error';
          notif.error({
            message: (
              <span data-testid="toast-error">Failed to delete track</span>
            ),
            description: message,
          });
        });
    },
    [trackStore, notif]
  );

  const handleBulkDelete = useCallback(() => {
    trackStore
      .removeTracks(selectedRowKeys as string[])
      .then(() => {
        setSelectedRowKeys([]);
        notif.success({
          message: <span data-testid="toast-success">Tracks were deleted</span>,
        });
      })
      .catch((e: unknown) => {
        const message = isError(e) ? e.message : 'Unknown error';
        notif.error({
          message: (
            <span data-testid="toast-error">
              Failed to delete selected tracks
            </span>
          ),
          description: message,
        });
      });
  }, [trackStore, selectedRowKeys, notif]);

  const handleDeleteAll = useCallback(() => {
    trackStore
      .removeAllTracks()
      .then(() => {
        notif.success({
          message: (
            <span data-testid="toast-success">All tracks were deleted</span>
          ),
        });
      })
      .catch((e: unknown) => {
        const message = isError(e) ? e.message : 'Unknown error';
        notif.error({
          message: (
            <span data-testid="toast-error">Failed to delete all tracks</span>
          ),
          description: message,
        });
      });
  }, [trackStore, notif]);

  const filteredTracks = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return trackStore.tracks.filter(
      (t) =>
        t.title.toLowerCase().includes(term) ||
        t.artist.toLowerCase().includes(term) ||
        t.album?.toLowerCase().includes(term)
    );
  }, [searchTerm, trackStore.tracks]);

  useEffect(() => {
    void trackStore.fetchTracks(INITIAL_PAGE);
    void trackStore.fetchGenres();
  }, [trackStore]);

  return (
    <>
      <div id="toast-container" data-testid="toast-container">
        {contextHolder}
      </div>
      <Title
        level={2}
        style={{ textAlign: 'center' }}
        data-testid="tracks-header"
      >
        Tracks list
      </Title>
      <Col span={24}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Controls
            handleSearchChange={handleSearchChange}
            showModal={showModal}
            handleBulkDelete={handleBulkDelete}
            handleDeleteAll={handleDeleteAll}
            selectedRowKeys={selectedRowKeys as string[]}
          />

          <TracksTable
            tracks={filteredTracks}
            genres={trackStore.genres}
            selectedRowKeys={selectedRowKeys}
            onSelectionChange={setSelectedRowKeys}
            playingId={playingId}
            onTogglePlay={togglePlay}
            onEdit={showModal}
            onDelete={handleDelete}
          />

          <CreateEditTrackModal
            visible={isModalVisible}
            onClose={handleClose}
            track={currentTrack}
            notificationApi={notif}
          />
        </Space>
      </Col>
    </>
  );
});
