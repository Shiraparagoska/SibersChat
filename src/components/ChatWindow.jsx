import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  addMessage,
  getChannel,
  addParticipant,
  removeParticipant,
  isChannelCreator,
} from '../utils/storage';
import './ChatWindow.css';

function ChatWindow({ channel, currentUser, users, onChannelUpdate }) {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState(channel.messages || []);
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  // Update messages when channel changes
  useEffect(() => {
    setMessages(channel.messages || []);
  }, [channel.id, channel.messages]);

  // Update messages periodically (simulate real-time)
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedChannel = getChannel(channel.id);
      if (updatedChannel && updatedChannel.messages) {
        setMessages(updatedChannel.messages);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [channel.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Memoize getUserById function
  const getUserById = useCallback(
    userId => {
      return users.find(u => u.id === userId) || null;
    },
    [users]
  );

  // Memoize send message handler
  const handleSendMessage = useCallback(() => {
    if (!messageText.trim()) return;

    addMessage(channel.id, currentUser.id, messageText.trim());
    setMessageText('');

    // Update messages immediately from localStorage
    const updatedChannel = getChannel(channel.id);
    if (updatedChannel && updatedChannel.messages) {
      setMessages(updatedChannel.messages);
    }

    onChannelUpdate();
  }, [messageText, channel.id, currentUser.id, onChannelUpdate]);

  // Memoize add user handler
  const handleAddUser = useCallback(
    userId => {
      addParticipant(channel.id, userId);
      onChannelUpdate();
      setShowUserSearch(false);
      setSearchTerm('');
    },
    [channel.id, onChannelUpdate]
  );

  // Memoize remove user handler
  const handleRemoveUser = useCallback(
    userId => {
      const canAddUsers = isChannelCreator(channel.id, currentUser.id);
      if (!canAddUsers) return;

      removeParticipant(channel.id, userId);
      onChannelUpdate();
    },
    [channel.id, currentUser.id, onChannelUpdate]
  );

  // Memoize participants list
  const participants = useMemo(() => {
    return channel.participants
      .map(id => getUserById(id))
      .filter(user => user !== null);
  }, [channel.participants, getUserById]);

  // Memoize canAddUsers check
  const canAddUsers = useMemo(
    () => isChannelCreator(channel.id, currentUser.id),
    [channel.id, currentUser.id]
  );

  // Memoize available users list
  const availableUsers = useMemo(() => {
    if (!searchTerm.trim()) {
      return users.filter(user => !channel.participants.includes(user.id));
    }

    const lowerSearch = searchTerm.toLowerCase();
    return users.filter(
      user =>
        !channel.participants.includes(user.id) &&
        (user.name.toLowerCase().includes(lowerSearch) ||
          user.username.toLowerCase().includes(lowerSearch))
    );
  }, [users, channel.participants, searchTerm]);

  // Format timestamp helper
  const formatTime = useCallback(timestamp => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);
  return (
    <div className="chat-window">
      <div className="chat-header">
        <h3>#{channel.name}</h3>
      </div>
      <div className="chat-main">
        <div className="messages-container">
          <div className="messages">
            {messages.length === 0 ? (
              <p>No messages yet. Start the conversation!</p>
            ) : (
              messages.map(message => {
                const user = getUserById(message.userId);
                if (!user) return null;

                const isOwnMessage = message.userId === currentUser.id;

                return (
                  <div
                    key={message.id}
                    className={`message ${isOwnMessage ? 'own-message' : ''}`}
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="message-avatar"
                      onError={e => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                      }}
                    />
                    <div className="message-content">
                      <div className="message-header">
                        <span className="message-author">{user.name}</span>
                        <span className="message-time">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <div className="message-text">{message.text}</div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="participants-panel">
          <div className="participants-header">
            <h4>Participants ({participants.length})</h4>
            {canAddUsers && (
              <button
                onClick={() => setShowUserSearch(!showUserSearch)}
                className="add-user-btn"
                title="Add user to channel"
              >
                +
              </button>
            )}
          </div>

          {showUserSearch && (
            <div className="user-search-box">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="user-search-input"
              />
              <div className="available-users">
                {availableUsers.length === 0 ? (
                  <p className="no-users">No users found</p>
                ) : (
                  availableUsers.slice(0, 5).map(user => (
                    <div
                      key={user.id}
                      className="available-user-item"
                      onClick={() => handleAddUser(user.id)}
                    >
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="user-avatar-small"
                        onError={e => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                        }}
                      />
                      <span>{user.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {!showUserSearch && (
            <div className="participants-list">
              {participants.map(user => (
                <div key={user.id} className="participant-item">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="participant-avatar"
                    onError={e => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                    }}
                  />
                  <div className="participant-info">
                    <span>{user.name}</span>
                    <span>@{user.username}</span>
                  </div>
                  {canAddUsers && user.id !== currentUser.id && (
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="remove-user-btn"
                      title="Remove user from channel"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="message-input-container">
        <input
          type="text"
          placeholder="Type a message..."
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          onKeyPress={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          className="message-input"
        />
        <button onClick={handleSendMessage} className="send-btn">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatWindow;
