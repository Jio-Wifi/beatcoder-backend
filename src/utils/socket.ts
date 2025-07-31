interface RoomUser {
  id: string;         // Socket ID
  username: string;
  video?: boolean;    // Whether user has video enabled
}

const rooms: Record<string, RoomUser[]> = {};
const directChats: Record<string, string[]> = {};

// Add user to a room (no duplicates)
export const addUserToRoom = (roomId: string, id: string, username: string): RoomUser[] => {
  if (!rooms[roomId]) rooms[roomId] = [];

  const exists = rooms[roomId].some((u) => u.id === id);
  if (!exists) {
    rooms[roomId].push({ id, username, video: false });
  }

  return rooms[roomId];
};

// Remove user from any room
export const removeUserFromRoom = (id: string): { roomId: string; username: string } | null => {
  for (const [roomId, users] of Object.entries(rooms)) {
    const idx = users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      const [removed] = users.splice(idx, 1);

      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }

      return { roomId, username: removed.username };
    }
  }
  return null;
};

// Get all users in a room
export const getUsersInRoom = (roomId: string): RoomUser[] => rooms[roomId] || [];

// Toggle video status
export const toggleUserVideo = (roomId: string, id: string, enabled: boolean): RoomUser[] => {
  if (!rooms[roomId]) return [];
  rooms[roomId] = rooms[roomId].map((u) =>
    u.id === id ? { ...u, video: enabled } : u
  );
  return rooms[roomId];
};

// Direct chat helpers (unchanged)
export const createDirectChat = (user1: string, user2: string): string => {
  const chatId = [user1, user2].sort().join("-");
  directChats[chatId] = [user1, user2];
  return chatId;
};

export const getDirectChatUsers = (chatId: string): string[] => directChats[chatId] || [];

export const removeUserFromDirectChats = (id: string): void => {
  for (const chatId of Object.keys(directChats)) {
    if (directChats[chatId].includes(id)) {
      delete directChats[chatId];
    }
  }
};
