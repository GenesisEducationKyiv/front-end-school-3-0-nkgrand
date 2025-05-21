import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Header: AntdHeader } = Layout;

export const Header = () => {
  const items = [
    { label: 'Albums', key: 'albums', path: '/albums' },
    { label: 'Artists', key: 'artists', path: '/artists' },
    { label: 'Genres', key: 'genres', path: '/genres' },
    { label: 'Tracks', key: 'tracks', path: '/tracks' },
    { label: 'Settings', key: 'settings', path: '/settings' },
  ];

  return (
    <AntdHeader>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['tracks']}
        items={items.map((item) => ({
          label: <Link to={item.path}>{item.label}</Link>,
          key: item.key,
        }))}
      />
    </AntdHeader>
  );
};
