import Popconfirm from 'antd/es/popconfirm';
import Space from 'antd/es/space';
import { useTrackStore } from '../../../context/TrackStoreContext';
import { observer } from 'mobx-react-lite';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button } from '../../common/Button/Button';
import { SearchInput } from '../../common/Search/Search';

interface ControlsProps {
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchValue: string;
  showModal: () => void;
  handleBulkDelete: () => void;
  handleDeleteAll: () => void;
  selectedRowKeys: string[];
}

export const Controls = observer(
  ({
    handleSearchChange,
    searchValue,
    showModal,
    handleBulkDelete,
    handleDeleteAll,
    selectedRowKeys,
  }: ControlsProps) => {
    const trackStore = useTrackStore();

    return (
      <Space>
        <SearchInput
          data-testid="search-input"
          onChange={handleSearchChange}
          value={searchValue}
          style={{ width: 300 }}
          entity={'tracks'}
        />
        <Button
          data-testid="create-track-button"
          type="primary"
          onClick={() => {
            showModal();
          }}
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
          onConfirm={() => {
            handleDeleteAll();
          }}
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
