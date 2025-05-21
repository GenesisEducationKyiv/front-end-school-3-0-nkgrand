import { Button, Input, Popconfirm, Space } from 'antd';
import { useTrackStore } from '../../../context/TrackStoreContext';
import { observer } from 'mobx-react-lite';
import { QuestionCircleOutlined } from '@ant-design/icons';

type ControlsProps = {
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showModal: () => void;
  handleBulkDelete: () => void;
  handleDeleteAll: () => void;
  selectedRowKeys: string[];
};

export const Controls = observer(
  ({
    handleSearchChange,
    showModal,
    handleBulkDelete,
    handleDeleteAll,
    selectedRowKeys,
  }: ControlsProps) => {
    const trackStore = useTrackStore();

    return (
      <Space>
        <Input
          placeholder="Search tracks"
          data-testid="search-input"
          onChange={handleSearchChange}
          style={{ width: 300 }}
          allowClear
        />
        <Button
          data-testid="create-track-button"
          type="primary"
          onClick={() => showModal()}
        >
          Create Track
        </Button>
        <Popconfirm
          title={
            <span data-testid="confirm-dialog">
              Are you sure to delete selected tracks?
            </span>
          }
          onConfirm={handleBulkDelete}
          okButtonProps={{ danger: true }}
          okText="Delete"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        >
          <Button
            danger
            disabled={!selectedRowKeys.length}
            data-testid="bulk-delete-button"
            aria-disabled={!selectedRowKeys.length}
          >
            Delete selected
          </Button>
        </Popconfirm>
        <Popconfirm
          title={
            <span data-testid="confirm-dialog">
              Are you sure to delete all tracks?
            </span>
          }
          onConfirm={handleDeleteAll}
          okButtonProps={{ danger: true }}
          okText="Delete"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        >
          <Button
            danger
            disabled={trackStore.loading}
            aria-disabled={trackStore.loading}
          >
            Delete All
          </Button>
        </Popconfirm>
      </Space>
    );
  }
);
