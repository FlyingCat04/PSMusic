using PSMusic.Server.Models.DTO.Music;

namespace PSMusic.Server.Services.Interfaces
{
    public interface IMusicService
    {
        Task<SongDetailDTO?> GetSongDetailAsync(int songId, int userId);
        Task<List<ArtistDTO>> GetArtistsBySongIdAsync(int songId);
        Task<List<RelatedSongDTO>> GetRelatedSongsAsync(int songId);
    }
}
