import { Button, Checkbox, Table, Dropdown, Modal } from 'antd';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { type Track } from '../../schemas/track.schema';
import { CellAudioPlayer } from './__components/CellAudioPlayer';
import type { ColumnsType } from 'antd/es/table';
import { useTrackStore } from '../../context/TrackStoreContext';
import {
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

const DEFAULT_COVER_IMG =
  'https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png';

export interface TracksTableProps {
  tracks: Track[];
  genres: string[];
  selectedRowKeys: React.Key[];
  onSelectionChange: (keys: React.Key[]) => void;
  onEdit: (track?: Track) => void;
  onDelete: (id: string) => void;
}

export const TracksTable = observer((props: TracksTableProps) => {
  const { tracks, selectedRowKeys, onSelectionChange, onDelete, onEdit } =
    props;
  const trackStore = useTrackStore();

  // State for modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const columns: ColumnsType<Track> = useMemo(() => {
    const genreFilters = trackStore.genres.map((g: string) => ({
      text: g,
      value: g,
    }));

    const artistFilters = Array.from(
      new Set(trackStore.tracks.map((t: Track) => t.artist))
    ).map((name: string) => ({ text: name, value: name }));

    return [
      {
        title: 'Cover',
        dataIndex: 'coverImage',
        key: 'coverImage',
        width: 70,
        render: (url: string) => {
          return (
            <img
              src={url || DEFAULT_COVER_IMG}
              alt="Cover"
              style={{
                width: 50,
                height: 50,
                objectFit: 'cover',
                borderRadius: 4,
              }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_COVER_IMG;
              }}
            />
          );
        },
      },
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        width: 200,
        sorter: (a, b) => (a.title || '').localeCompare(b.title),
        render: (text, record) => (
          <span data-testid={`track-item-${record.id}-title`}>{text}</span>
        ),
      },
      {
        title: <span data-testid="filter-artist">Artist</span>,
        dataIndex: 'artist',
        key: 'artist',
        width: 200,
        filters: artistFilters,
        onFilter: (value, record) => record.artist === value,
        sorter: (a, b) => (a.artist || '').localeCompare(b.artist),
        render: (text, record) => (
          <span data-testid={`track-item-${record.id}-artist`}>{text}</span>
        ),
      },
      {
        title: 'Album',
        dataIndex: 'album',
        key: 'album',
        width: 200,
        sorter: (a, b) => (a.album || '').localeCompare(b.album || ''),
      },
      {
        title: <span data-testid="filter-genre">Genres</span>,
        dataIndex: 'genres',
        key: 'genres',
        filters: genreFilters,
        onFilter: (value, record) => record.genres.includes(value as string),
        render: (genres: string[]) => genres.join(', '),
        width: 200,
      },
      {
        title: 'Player',
        key: 'play',
        width: 240,
        render: (_, record) => <CellAudioPlayer track={record} />,
      },
      {
        title: 'Actions',
        key: 'actions',
        align: 'center',
        render: (_, record) => (
          <>
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'edit',
                    label: (
                      <span data-testid={`edit-track-${record.id}`}>Edit</span>
                    ),
                    icon: <EditOutlined />,
                    onClick: () => {
                      onEdit(record);
                    },
                  },
                  {
                    key: 'delete',
                    label: (
                      <span
                        data-testid={`delete-track-${record.id}`}
                        style={{ color: 'red', cursor: 'pointer' }}
                      >
                        Delete
                      </span>
                    ),
                    icon: <DeleteOutlined style={{ color: 'red' }} />,
                    onClick: () => {
                      setDeleteId(record.id);
                    },
                  },
                ],
              }}
              trigger={['click']}
            >
              <Button icon={<EllipsisOutlined />} type="link" />
            </Dropdown>
            <Modal
              open={deleteId === record.id}
              onCancel={() => {
                setDeleteId(null);
              }}
              onOk={() => {
                if (deleteId) onDelete(deleteId);
                setDeleteId(null);
              }}
              okButtonProps={{ danger: true }}
              okText="Delete"
              cancelText="Cancel"
              title={
                <span data-testid="confirm-dialog">
                  Are you sure to delete this track?
                </span>
              }
              centered
              width={320}
              destroyOnClose
            />
          </>
        ),
      },
    ];
  }, [trackStore.tracks, trackStore.genres, onEdit, onDelete, deleteId]);

  return (
    <div data-testid="pagination">
      <Table
        dataSource={tracks}
        columns={columns}
        rowKey="id"
        loading={trackStore.loading}
        data-testid="loading-tracks"
        data-loading={trackStore.loading || undefined}
        size="small"
        pagination={{
          current: trackStore.page,
          total: trackStore.totalTracks,
          onChange: (page) => {
            trackStore.setPage(page);
          },
          showSizeChanger: true,
          onShowSizeChange: (_, size) => {
            trackStore.setLimit(size);
            trackStore.setPage(1);
          },
          pageSizeOptions: ['5', '10', '20', '30'],
          position: ['bottomCenter'],
          defaultPageSize: 10,
          itemRender: (_, type, originalElement) => {
            if (type === 'prev') {
              return (
                <span data-testid="pagination-prev">{originalElement}</span>
              );
            }
            if (type === 'next') {
              return (
                <span data-testid="pagination-next">{originalElement}</span>
              );
            }
            return originalElement;
          },
        }}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectionChange,
          renderCell: (_checked, record, _index, node) => (
            <span data-testid={`track-checkbox-${record.id}`}>{node}</span>
          ),
          columnTitle: (
            <Checkbox
              checked={
                selectedRowKeys.length > 0 &&
                selectedRowKeys.length === trackStore.tracks.length
              }
              indeterminate={
                selectedRowKeys.length > 0 &&
                selectedRowKeys.length < trackStore.tracks.length
              }
              onChange={(e) => {
                if (e.target.checked) {
                  onSelectionChange(trackStore.tracks.map((t) => t.id));
                } else {
                  onSelectionChange([]);
                }
              }}
              data-testid="select-all"
            />
          ),
        }}
        components={{
          body: {
            row: (
              props: React.HTMLAttributes<HTMLTableRowElement> & {
                'data-row-key'?: React.Key;
              }
            ) => (
              <tr
                {...props}
                data-testid={`track-item-${String(props['data-row-key'])}`}
              />
            ),
          },
        }}
      />
    </div>
  );
});
