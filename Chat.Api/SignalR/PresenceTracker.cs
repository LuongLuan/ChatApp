namespace Chat.Api.SignalR
{
    public class PresenceTracker
    {
        // Using ConcurrentDictionary for thread-safe operations on the dictionary itself.
        // The List<string> still requires locking for modifications.
        private static readonly System.Collections.Concurrent.ConcurrentDictionary<string, List<string>> OnlineUsers =
            new System.Collections.Concurrent.ConcurrentDictionary<string, List<string>>();

        public Task<bool> UserConnected(string username, string connectionId)
        {
            bool isNewUserOnline = false; // Renamed for clarity
            List<string> connections;

            // GetOrAdd is atomic for adding the username key if it doesn't exist.
            // The valueFactory is executed if the key is not found.
            connections = OnlineUsers.GetOrAdd(username, _ =>
            {
                // This block is executed if the username was not present.
                // It means this is the first connection for this user.
                isNewUserOnline = true;
                return new List<string>(); // Return a new list for the new user
            });

            // Lock the specific list of connections for the username to add the connectionId
            lock (connections) // Locking on the specific list instance
            {
                connections.Add(connectionId);
            }

            return Task.FromResult(isNewUserOnline);
        }

        public Task<bool> UserDisconnected(string username, string connectionId)
        {
            bool isUserOffline = false; // Renamed for clarity
            List<string>? connections;

            if (OnlineUsers.TryGetValue(username, out connections))
            {
                lock (connections) // Lock the specific list instance
                {
                    connections.Remove(connectionId);
                    if (connections.Count == 0)
                    {
                        // If the list is empty, try to remove the user from the dictionary.
                        // TryRemove is atomic and returns true if successful.
                        if (OnlineUsers.TryRemove(username, out _))
                        {
                            isUserOffline = true;
                        }
                    }
                }
            }

            return Task.FromResult(isUserOffline);
        }

        public Task<string[]> GetOnlineUsers()
        {
            // ConcurrentDictionary allows safe enumeration without explicit locking.
            // ToArray() creates a snapshot, so it's safe.
            string[] onlineUsers = OnlineUsers.Keys.OrderBy(k => k).ToArray();
            return Task.FromResult(onlineUsers);
        }

        public Task<List<string>?> GetConnectionsForUser(string username)
        {
            // TryGetValue is thread-safe for ConcurrentDictionary.
            if (OnlineUsers.TryGetValue(username, out List<string>? connections))
            {
                // Return a copy of the list to prevent external modifications
                // while another thread might be modifying the original list.
                // Or, if you trust the caller not to modify, you can return `connections` directly.
                return Task.FromResult(new List<string>(connections));
            }
            return Task.FromResult<List<string>?>(null);
        }

        /// <summary>
        /// true if online else false is offline
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public Task<bool> CheckUsernameIsOnline(string username)
        {
            // ContainsKey is thread-safe for ConcurrentDictionary.
            return Task.FromResult(OnlineUsers.ContainsKey(username));
        }
    }
}
