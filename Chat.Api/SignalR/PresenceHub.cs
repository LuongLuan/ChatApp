using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Chat.Api.SignalR
{
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;

        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;
        }
        public override async Task OnConnectedAsync()
        {
            var user = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isOnline = await _tracker.UserConnected(user, Context.ConnectionId);
            if (isOnline)
            {
                await Clients.Others.SendAsync("UserOnline", user);
            }
            var currentUsers = await _tracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers.Where(x => x != user).ToArray());
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var user = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var isOffline = await _tracker.UserDisconnected(user, Context.ConnectionId);
            if (isOffline)
            {
                await Clients.Others.SendAsync("UserOffline", user);
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}
