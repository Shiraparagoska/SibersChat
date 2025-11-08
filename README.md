# Sibers Chat - Real-time Chat Application

Test task for Frontend Developer position at Sibers.

## Features

✅ **Real-time chat** - real-time communication (simulated via localStorage and setInterval)

✅ **Channel creation** - users can create their own channels for communication

✅ **Join channels** - users can join existing channels

✅ **Participants display** - list of participants in each channel

✅ **User search** - search when selecting a user and when adding to a channel

✅ **Remove participants** - channel creator can remove participants

✅ **Pretty UI** - modern and user-friendly interface

✅ **Performance optimization** - React.memo, useMemo, and useCallback for efficient rendering

✅ **Message timestamps** - relative time display (e.g., "5m ago", "Just now")

✅ **Auto-scroll** - automatic scroll to new messages

✅ **Message count** - display message count in channel list

✅ **Own messages styling** - distinct styling for user's own messages

✅ **Smooth animations** - slide-in animations for new messages

## Technologies

- **React 18** - library for building user interfaces
- **Vite** - build tool and development server
- **HTML + CSS** - styles written manually
- **localStorage** - for data storage (channels, messages, users)

## Installation and Setup

1. **Install dependencies:**

```bash
npm install
```

2. **Make sure `users.json` file exists**

3. **Run the application:**

```bash
npm run dev
```

4. **Open browser** at the address shown by Vite (usually http://localhost:5173)

## Project Structure

```
src/
  ├── components/
  │   ├── UserSelection.jsx    # User selection screen
  │   ├── UserSelection.css
  │   ├── ChannelList.jsx      # Channel list
  │   ├── ChannelList.css
  │   ├── ChatWindow.jsx        # Chat window with messages
  │   └── ChatWindow.css
  ├── utils/
  │   └── storage.js        # Utilities for working with localStorage
  ├── App.jsx                   # Main component
  ├── App.css
  ├── main.jsx                  # Entry point
  └── index.css                 # Global styles
```

## How to Use

1. **Select User:**
   - On first launch, select a user from the list
   - Use search to quickly find a user

2. **Create Channel:**
   - Click the "+" button in the channel list
   - Enter channel name

3. **Send Messages:**
   - Select a channel
   - Type a message in the input field
   - Press Enter or click "Send" button

4. **Add Users:**
   - Channel creator can add users via "+" button in participants panel
   - Use search to find users

5. **Remove Users:**
   - Channel creator can remove participants via "×" button next to participant

## Code Comments

All code comments are written in English, as required in the task.

## Code Formatting

The project uses Prettier for code formatting:

```bash
npm run format        # Format code
npm run format:check  # Check formatting
```

## Build for Production

```bash
npm run build
```

Built files will be in the `dist/` folder.
