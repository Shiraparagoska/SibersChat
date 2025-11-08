import { useMemo, useCallback, memo } from 'react';
import './ChannelList.css';

const ChannelList = memo(
  ({
    channels,
    currentChannelId,
    onSelectChannel,
    onCreateChannel,
    currentUser,
  }) => {
    // Memoize channel list to avoid recalculating on every render
    const channelList = useMemo(() => Object.values(channels), [channels]);

    // Memoize channel selection handler
    const handleSelectChannel = useCallback(
      channelId => {
        onSelectChannel(channelId);
      },
      [onSelectChannel]
    );

    return (
      <div className="channel-list">
        <div className="channel-list-header">
          <h3>Channels</h3>
          <button
            onClick={onCreateChannel}
            className="add-channel-btn"
            title="Create channel"
          >
            +
          </button>
        </div>
        <div className="channels">
          {channelList.length === 0 ? (
            <p className="no-channels">No channels yet. Create one!</p>
          ) : (
            channelList.map(channel => (
              <div
                key={channel.id}
                className={`channel-item ${currentChannelId === channel.id ? 'active' : ''}`}
                onClick={() => handleSelectChannel(channel.id)}
              >
                <div className="channel-name">
                  <span className="channel-icon">#</span>
                  {channel.name}
                  {channel.messages && channel.messages.length > 0 && (
                    <span className="message-count">
                      {channel.messages.length}
                    </span>
                  )}
                </div>
                {channel.creatorId === currentUser.id && (
                  <span className="creator-badge" title="You are the creator">
                    Admin
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
);

ChannelList.displayName = 'ChannelList';

export default ChannelList;
