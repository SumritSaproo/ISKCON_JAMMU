import { Routes, Route } from 'react-router-dom';
import { useSettings } from './api/content';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { SiteAudioProvider } from './components/layout/SiteAudio';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Donate from './pages/Donate';
import Gallery from './pages/Gallery';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Volunteer from './pages/Volunteer';

import ProtectedRoute from './admin/ProtectedRoute';
import AdminLayout from './admin/AdminLayout';
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import EventsAdmin from './admin/pages/EventsAdmin';
import DonationsAdmin from './admin/pages/DonationsAdmin';
import GalleryAdmin from './admin/pages/GalleryAdmin';
import BlogAdmin from './admin/pages/BlogAdmin';
import VolunteersAdmin from './admin/pages/VolunteersAdmin';
import MessagesAdmin from './admin/pages/MessagesAdmin';
import SettingsAdmin from './admin/pages/SettingsAdmin';

function PublicLayout({ children }) {
  const { data: settings } = useSettings();
  const backgroundStyle = settings?.backgroundImage
    ? {
        '--site-background-image': `url(${settings.backgroundImage})`,
        '--site-background-opacity': settings.backgroundImageOpacity ?? 1,
      }
    : undefined;

  return (
    <SiteAudioProvider settings={settings}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="site-main flex-1" style={backgroundStyle}>
          <div className="site-main-content">{children}</div>
        </main>
        <Footer />
      </div>
    </SiteAudioProvider>
  );
}

export default function App() {
  return (
    <Routes>
      {/* ---- Public site ---- */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
      <Route path="/events/:slug" element={<PublicLayout><Events /></PublicLayout>} />
      <Route path="/donate" element={<PublicLayout><Donate /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
      <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
      <Route path="/blog/:slug" element={<PublicLayout><Blog /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/volunteer" element={<PublicLayout><Volunteer /></PublicLayout>} />

      {/* ---- Admin ---- */}
      <Route path="/admin/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="events" element={<EventsAdmin />} />
          <Route path="donations" element={<DonationsAdmin />} />
          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="blog" element={<BlogAdmin />} />
          <Route path="volunteers" element={<VolunteersAdmin />} />
          <Route path="messages" element={<MessagesAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>
      </Route>
    </Routes>
  );
}
