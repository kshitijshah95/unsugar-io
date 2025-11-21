import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { ApiError } from '@/lib/apiClient';
import '@/styles/pages/Profile.css';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [readingStats, setReadingStats] = useState<any>(null);

  useEffect(() => {
    // Fetch reading stats
    // TODO: Implement this API call when backend is ready
    // fetchReadingStats();
    setReadingStats({
      uniqueBlogs: 0,
      completedBlogs: 0,
      totalReadingTime: 0
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const updated = await authService.updateProfile({ name, avatar });
      updateUser(updated);
      setEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      if (error instanceof ApiError) {
        setMessage(error.message);
      } else {
        setMessage('Failed to update profile');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-card">
          <h1>Profile</h1>

          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <div className="profile-avatar-section">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <form onSubmit={handleSave} className="profile-form">
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={user?.email} disabled />
              <small>Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!editing}
                required
              />
            </div>

            <div className="form-group">
              <label>Avatar URL</label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                disabled={!editing}
                placeholder="https://..."
              />
            </div>

            {editing ? (
              <div className="button-group">
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => {
                    setEditing(false);
                    setName(user?.name || '');
                    setAvatar(user?.avatar || '');
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button 
                type="button" 
                className="btn-edit"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </form>

          {/* Reading Stats Section */}
          <div className="reading-stats">
            <h2>Reading Stats</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{readingStats?.uniqueBlogs || 0}</div>
                <div className="stat-label">Blogs Read</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{readingStats?.completedBlogs || 0}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {Math.floor((readingStats?.totalReadingTime || 0) / 60)} min
                </div>
                <div className="stat-label">Reading Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
