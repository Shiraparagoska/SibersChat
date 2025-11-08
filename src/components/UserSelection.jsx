import { useState, useMemo, useCallback, memo } from 'react';
import './UserSelection.css';

const UserSelection = memo(({ users, onUserSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Memoize filtered users to avoid recalculating on every render
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    const lowerSearch = searchTerm.toLowerCase();
    return users.filter(
      user =>
        user.name.toLowerCase().includes(lowerSearch) ||
        user.username.toLowerCase().includes(lowerSearch) ||
        user.email.toLowerCase().includes(lowerSearch)
    );
  }, [users, searchTerm]);

  // Memoize click handler to prevent unnecessary re-renders
  const handleClick = useCallback(
    user => {
      onUserSelect(user);
    },
    [onUserSelect]
  );

  return (
    <div className="user-selection">
      <div className="user-selection-container">
        <h1>Select User</h1>
        <p className="subtitle">Choose a user to start chatting</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, username or email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="users-list">
          {filteredUsers.length === 0 ? (
            <p className="no-results">No users found</p>
          ) : (
            filteredUsers.map(user => (
              <div
                key={user.id}
                className="user-card"
                onClick={() => handleClick(user)}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="user-avatar"
                  onError={e => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                  }}
                />
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p className="username">@{user.username}</p>
                  <p className="email">{user.email}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
});

UserSelection.displayName = 'UserSelection';

export default UserSelection;
