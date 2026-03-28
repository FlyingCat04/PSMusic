namespace PSMusic.Server.Services.Interfaces
{
    public interface IActiveUserTracker
    {
        void MarkActive(int userId);
        int GetActiveUserCount(TimeSpan activeWindow);
    }
}
