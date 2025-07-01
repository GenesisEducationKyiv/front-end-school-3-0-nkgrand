import { useEffect, useState, useCallback, useMemo } from 'react';
import { Space, Col, Typography, notification } from 'antd';
import { observer } from 'mobx-react-lite';
import { useSearchParams } from 'react-router-dom';
import { type Track } from '../../schemas/track.schema';
import { CreateEditTrackModal } from './__components/CreateEditTrackModal';
import { Controls } from './__components/Controls';
import { O, pipe } from '@mobily/ts-belt';
import { TracksTable } from './TracksTable';
import { useTrackStore } from '../../context/TrackStoreContext';
import { isError } from '../../utils/isError';

const INITIAL_PAGE = 1;

const { Title } = Typography;

export const Tracks = observer(() => {
  const trackStore = useTrackStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const initialSearchValue = O.getWithDefault(
    O.fromNullable(searchParams.get('search')),
    ''
  );

  const initialPage = O.getWithDefault(
    O.fromNullable(searchParams.get('page')),
    INITIAL_PAGE.toString()
  );

  const [inputValue, setInputValue] = useState<string>(initialSearchValue);
  const [debouncedValue, setDebouncedValue] = useState(inputValue);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [notif, contextHolder] = notification.useNotification();
  const [playingId, setPlayingId] = useState<string | null>(null);

  const fetchTracks = useCallback(
    async (page: number) => {
      try {
        await trackStore.fetchTracks(page);
        return true;
      } catch (error) {
        const errorMessage = isError(error) ? error.message : 'Unknown error';
        setFetchError(errorMessage);
        notif.error({
          message: 'Failed to load tracks',
          description: errorMessage,
        });
        return false;
      }
    },
    [trackStore, notif]
  );

  const fetchGenres = useCallback(async () => {
    try {
      await trackStore.fetchGenres();
      return true;
    } catch (error) {
      const errorMessage = isError(error) ? error.message : 'Unknown error';
      setFetchError(errorMessage);
      notif.error({
        message: 'Failed to load genres',
        description: errorMessage,
      });
      return false;
    }
  }, [trackStore, notif]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedValue.trim()) {
      params.set('search', debouncedValue.trim());
    }

    if (trackStore.page > 1) {
      params.set('page', trackStore.page.toString());
    }

    setSearchParams(params, { replace: true });
  }, [debouncedValue, trackStore.page, setSearchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  useEffect(() => {
    const loadData = async () => {
      const pageFromUrl = parseInt(initialPage, 10);
      if (pageFromUrl !== trackStore.page) {
        trackStore.setPageFromUrl(pageFromUrl);
      }

      const tracksSuccess = await fetchTracks(pageFromUrl);
      const genresSuccess = await fetchGenres();

      if (tracksSuccess && genresSuccess) {
        setFetchError(null);
      }
    };

    loadData().catch(console.error);
  }, [fetchTracks, fetchGenres, initialPage, trackStore]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      if (trackStore.page !== 1) {
        trackStore.setPage(1);
      }
    },
    [trackStore]
  );

  const handleDelete = useCallback(
    (id: string) => {
      void trackStore
        .removeTrack(id)
        .then(() => {
          notif.success({
            message: <span data-testid="toast-success">Track was deleted</span>,
          });
        })
        .catch((error: unknown) => {
          const message = isError(error) ? error.message : 'Unknown error';
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
    void trackStore
      .removeTracks(selectedRowKeys as string[])
      .then(() => {
        setSelectedRowKeys([]);
        notif.success({
          message: <span data-testid="toast-success">Tracks were deleted</span>,
        });
      })
      .catch((error: unknown) => {
        const message = isError(error) ? error.message : 'Unknown error';
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
    void trackStore
      .removeAllTracks()
      .then(() => {
        notif.success({
          message: (
            <span data-testid="toast-success">All tracks were deleted</span>
          ),
        });
      })
      .catch((error: unknown) => {
        const message = isError(error) ? error.message : 'Unknown error';
        notif.error({
          message: (
            <span data-testid="toast-error">Failed to delete all tracks</span>
          ),
          description: message,
        });
      });
  }, [trackStore, notif]);

  const filteredTracks = useMemo(() => {
    return pipe(
      debouncedValue,
      O.fromNullable,
      O.filter((value) => value.trim().length > 0),
      O.map((term: string) => term.toLowerCase()),
      O.map((term: string) =>
        trackStore.tracks.filter(
          (t) =>
            t.title.toLowerCase().includes(term) ||
            t.artist.toLowerCase().includes(term) ||
            (t.album?.toLowerCase() || '').includes(term)
        )
      ),
      O.getWithDefault(trackStore.tracks)
    );
  }, [debouncedValue, trackStore.tracks]);

  const togglePlay = useCallback((id: string) => {
    setPlayingId((prev) => (prev === id ? null : id));
  }, []);

  const showModal = (track?: Track) => {
    setPlayingId(null);
    setCurrentTrack(track ?? null);
    setIsModalVisible(true);
  };

  const handleClose = useCallback(() => {
    setIsModalVisible(false);
    setCurrentTrack(null);
  }, []);

  if (fetchError) {
    return (
      <div>
        <Title level={2} style={{ color: 'red' }}>
          Error loading data
        </Title>
        <p>{fetchError}</p>
      </div>
    );
  }

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
            searchValue={inputValue}
            handleSearchChange={handleSearchChange}
            showModal={() => {
              showModal();
            }}
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
