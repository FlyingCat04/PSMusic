using System.Collections.Concurrent;
using PSMusic.Server.Services.Interfaces;

namespace PSMusic.Server.Services.Implementations
{
    public class ActiveUserTracker : IActiveUserTracker
    {
        private readonly ConcurrentDictionary<int, DateTime> _lastSeenByUserId = new();

        public void MarkActive(int userId)
        {
            if (userId <= 0) return;
            _lastSeenByUserId[userId] = DateTime.UtcNow;
        }

        public int GetActiveUserCount(TimeSpan activeWindow)
        {
            var threshold = DateTime.UtcNow.Subtract(activeWindow);

            foreach (var item in _lastSeenByUserId)
            {
                if (item.Value < threshold)
                {
                    _lastSeenByUserId.TryRemove(item.Key, out _);
                }
            }

            return _lastSeenByUserId.Count;
        }
    }
}
