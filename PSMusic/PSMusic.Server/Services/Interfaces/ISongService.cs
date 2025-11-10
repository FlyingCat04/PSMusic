using PSMusic.Server.Models.DTO.Song;

namespace PSMusic.Server.Services.Interfaces
{
    public interface ISongService
    {
        Task<IEnumerable<SongDTO>> GetAll(int page, int size);
        Task<SongDetailDTO?> GetById(int id); 
    }
}
