import { useState, useEffect, useCallback, useMemo } from 'react';
import Modal from 'antd/es/modal';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Select from 'antd/es/select';
import Space from 'antd/es/space';
import { type Track } from '../../../schemas/track.schema';
import { useTrackStore } from '../../../context/TrackStoreContext';
import type { NotificationInstance } from 'antd/es/notification/interface';
import { Button } from '../../common/Button/Button';
import { Tag } from '../../common/Tag/Tag';

interface CreateEditTrackModalProps {
  visible: boolean;
  onClose: () => void;
  track?: Track | null;
  notificationApi: NotificationInstance;
}

interface TrackFormValues {
  title: string;
  artist: string;
  album: string;
  coverImage: string;
}

export const CreateEditTrackModal = ({
  visible,
  onClose,
  track,
  notificationApi,
}: CreateEditTrackModalProps) => {
  const [form] = Form.useForm();
  const trackStore = useTrackStore();
  const [genres, setGenres] = useState<string[]>([]);

  const availableGenres = useMemo(
    () => trackStore.genres.filter((g) => !genres.includes(g)),
    [trackStore.genres, genres]
  );

  const handleAddGenre = useCallback((genre: string) => {
    setGenres((prev) => (prev.includes(genre) ? prev : [...prev, genre]));
  }, []);

  const handleRemoveGenre = useCallback((genre: string) => {
    setGenres((prev) => prev.filter((g) => g !== genre));
  }, []);

  const handleSubmit = useCallback(
    async (values: TrackFormValues) => {
      if (genres.length === 0) {
        notificationApi.error({
          message: <span data-testid="toast-error">Validation failed</span>,
          description: 'Please select at least one genre',
        });
        return;
      }

      const payload = {
        ...values,
        genres,
        ...(track ? { id: track.id } : {}),
      };

      const result = track
        ? await trackStore.updateTrack(payload as Track)
        : await trackStore.addTrack(payload as Track);

      await result.match(
        async () => {
          notificationApi.success({
            message: (
              <span data-testid="toast-success">
                {track ? 'Track updated' : 'Track created'}
              </span>
            ),
          });

          await trackStore.fetchTracks();
          onClose();
          form.resetFields();
        },
        (e) => {
          notificationApi.error({
            message: <span data-testid="toast-error">Save failed</span>,
            description: e.message,
          });
        }
      );
    },
    [track, genres, trackStore, onClose, form, notificationApi]
  );


  useEffect(() => {
    if (visible) {
      if (track) {
        form.setFieldsValue({
          title: track.title || '',
          artist: track.artist || '',
          album: track.album || '',
          coverImage: track.coverImage || '',
        });
        setGenres(track.genres);
      } else {
        form.resetFields();
        setGenres([]);
      }
    }
  }, [visible, track, form]);

  const modalTitle = track ? 'Edit Track' : 'Create New Track';

  return (
    <Modal
      title={modalTitle}
      open={visible}
      footer={null}
      onCancel={onClose}
      destroyOnClose={true}
    >
      {visible && (
        <Form
          form={form}
          onFinish={(values) => {
            void handleSubmit(values as TrackFormValues);
          }}
          layout="vertical"
          data-testid="track-form"
        >
          <Form.Item
            label="Track Title"
            name="title"
            rules={[
              {
                required: true,
                message: (
                  <span data-testid="error-title">
                    Please enter the track title!
                  </span>
                ),
              },
            ]}
            validateStatus={form.getFieldError('title').length ? 'error' : ''}
          >
            <Input data-testid="input-title" />
          </Form.Item>

          <Form.Item
            label="Artist"
            name="artist"
            rules={[
              {
                required: true,
                message: (
                  <span data-testid="error-artist">
                    Please enter the artist name!
                  </span>
                ),
              },
            ]}
            validateStatus={form.getFieldError('artist').length ? 'error' : ''}
          >
            <Input data-testid="input-artist" />
          </Form.Item>

          <Form.Item
            label="Album"
            name="album"
            rules={[
              {
                required: true,
                message: (
                  <span data-testid="error-album">
                    Please enter the album name!
                  </span>
                ),
              },
            ]}
            validateStatus={form.getFieldError('album').length ? 'error' : ''}
          >
            <Input data-testid="input-album" />
          </Form.Item>

          <Form.Item
            label="Genres"
            required
            validateStatus={genres.length === 0 ? 'error' : ''}
            help={
              genres.length === 0 ? (
                <span data-testid="error-genre">
                  Please select at least one genre
                </span>
              ) : null
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {genres.length > 0 && (
                <div>
                  {genres.map((g) => (
                    <Tag
                      key={g}
                      closable
                      onClose={() => {
                        handleRemoveGenre(g);
                      }}
                    >
                      {g}
                    </Tag>
                  ))}
                </div>
              )}
              <Select
                style={{ width: '100%' }}
                placeholder="Add genre"
                onChange={handleAddGenre}
                options={availableGenres.map((g) => ({ label: g, value: g }))}
                allowClear
                data-testid="genre-selector"
              />
            </Space>
          </Form.Item>

          <Form.Item
            label="Cover Image URL"
            name="coverImage"
            rules={[
              {
                required: true,
                message: (
                  <span data-testid="error-coverImage">
                    Please provide a cover image URL!
                  </span>
                ),
              },
              {
                validator(_, value: string) {
                  if (!/^https?:\/\/.+/.test(value)) {
                    return Promise.reject(
                      new Error('URL must start with http:// or https://')
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            validateStatus={
              form.getFieldError('coverImage').length ? 'error' : ''
            }
          >
            <Input data-testid="input-cover-image" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              data-testid="submit-button"
              aria-disabled={trackStore.loading}
              disabled={trackStore.loading}
              loading={trackStore.loading}
            >
              {track ? 'Save Changes' : 'Create Track'}
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};
