import React from 'react';
import usersData from '../users.json';
import { useState, useEffect, useCallback, useMemo } from 'react';
import UserSelection from './components/UserSelection';
import ChannelList from './components/ChannelList';
import ChatWindow from './components/ChatWindow';
import { getChannels, createChannel } from './utils/storage';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [channels, setChannels] = useState({});
  const [currentChannelId, setCurrentChannelId] = useState(null);

  useEffect(() => {
    setUsers(usersData);

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing saved user', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    // Load channels from localStorage
    const loadedChannels = getChannels();
    setChannels(loadedChannels);

    // Create default channel if no channels exist
    if (Object.keys(loadedChannels).length === 0) {
      const defaultChannel = createChannel(
        'general',
        'General',
        currentUser.id
      );
      setChannels({ [defaultChannel.id]: defaultChannel });
      setCurrentChannelId(defaultChannel.id);
    } else if (Object.keys(loadedChannels).length > 0) {
      // Select first channel
      setCurrentChannelId(Object.keys(loadedChannels)[0]);
    }
  }, [currentUser]);

  // Memoize user selection handler
  const handleUserSelect = useCallback(user => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }, []);

  // Memoize logout handler
  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  }, []);

  // Memoize channel selection handler
  const handleSelectChannel = useCallback(channelId => {
    setCurrentChannelId(channelId);
  }, []);

  // Memoize channel creation handler
  const handleCreateChannel = useCallback(() => {
    const channelId = `channel-${Date.now()}`;
    const channelName = prompt('Enter channel name:');
    if (channelName && currentUser) {
      const newChannel = createChannel(channelId, channelName, currentUser.id);
      setChannels(prev => ({ ...prev, [channelId]: newChannel }));
      setCurrentChannelId(channelId);
    }
  }, [currentUser]);

  // Memoize channel update handler
  const handleChannelUpdate = useCallback(() => {
    const updatedChannels = getChannels();
    setChannels(updatedChannels);
  }, []);

  // Memoize current channel
  const currentChannel = useMemo(() => {
    return currentChannelId ? channels[currentChannelId] : null;
  }, [currentChannelId, channels]);

  if (!currentUser) {
    return <UserSelection users={users} onUserSelect={handleUserSelect} />;
  }

  return (
    <div className="app">
      <div className="app-header">
        <div className="app-header-left">
          <h1>Sibers Chat</h1>
          <span className="user-badge">
            {currentUser.name} (@{currentUser.username})
          </span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
      <div className="app-content">
        <ChannelList
          channels={channels}
          currentChannelId={currentChannelId}
          onSelectChannel={handleSelectChannel}
          onCreateChannel={handleCreateChannel}
          currentUser={currentUser}
        />
        {currentChannel ? (
          <ChatWindow
            channel={currentChannel}
            currentUser={currentUser}
            users={users}
            onChannelUpdate={handleChannelUpdate}
          />
        ) : (
          <div className="no-channel-selected">
            <p>Select a channel to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
