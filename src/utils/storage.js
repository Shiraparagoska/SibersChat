const STORAGE_KEY = 'sibers_chat_channels';

export const getChannels = () => {
  try {
    const channels = localStorage.getItem(STORAGE_KEY);
    return channels ? JSON.parse(channels) : {};
  } catch (error) {
    console.error('Error reading channels from storage:', error);
    return {};
  }
};

export const saveChannels = channels => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(channels));
  } catch (error) {
    console.error('Error reading channels from storage:', error);
  }
};

export const getChannel = channelId => {
  const channels = getChannels();
  return channels[channelId] || null;
};

export const createChannel = (channelId, channelName, creatorId) => {
  const channels = getChannels();
  channels[channelId] = {
    id: channelId,
    name: channelName,
    creatorId: creatorId,
    participants: [creatorId],
    messages: [],
    createdAt: Date.now(),
  };
  saveChannels(channels);
  return channels[channelId];
};

export const addMessage = (channelId, userId, text) => {
  const channels = getChannels();
  if (!channels[channelId]) return null;

  const message = {
    id: Date.now() + Math.random(),
    userId: userId,
    text: text,
    timestamp: Date.now(),
  };

  channels[channelId].messages.push(message);
  saveChannels(channels);
  return message;
};

export const addParticipant = (channelId, userId) => {
  const channels = getChannels();
  if (!channels[channelId]) return false;

  if (!channels[channelId].participants.includes(userId)) {
    channels[channelId].participants.push(userId);
    saveChannels(channels);
  }
  return true;
};

export const removeParticipant = (channelId, userId) => {
  const channels = getChannels();
  if (!channels[channelId]) return false;

  channels[channelId].participants = channels[channelId].participants.filter(
    id => id !== userId
  );
  saveChannels(channels);
  return true;
};

export const isChannelCreator = (channelId, userId) => {
  const channel = getChannel(channelId);
  return channel && channel.creatorId === userId;
};
