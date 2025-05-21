import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { Divider, Layout } from 'antd';
import { Tracks } from './components/pages/Tracks';
import { Header } from './components/Header/Header';
import { Artists } from './components/pages/Artists';
import { Albums } from './components/pages/Albums';
import { Genres } from './components/pages/Genres';
import { Settings } from './components/pages/Settings';
import { TrackStoreProvider } from './provider/TrackStoreProvider';

const { Content, Footer } = Layout;

const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh', width: '100vw' }}>
        <Header />
        <Content style={{ padding: '20px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/tracks" replace />} />
            <Route
              path="/tracks"
              element={
                <TrackStoreProvider>
                  <Tracks />
                </TrackStoreProvider>
              }
            />
            <Route path="/artists" element={<Artists />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Content>
        <Divider />
        <Footer style={{ textAlign: 'center' }}>
          Used Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Router>
  );
};

export default App;
