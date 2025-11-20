using Microsoft.EntityFrameworkCore;
using PSMusic.Server.Models.DTO.Music;
using PSMusic.Server.Data;
using PSMusic.Server.Services.Interfaces;

namespace PSMusic.Server.Services.Implementations
{
    public class MusicService : IMusicService
    {
        private readonly DBContext _context;

        public MusicService(DBContext context)
        {
            _context = context;
        }

        public async Task<SongDetailDTO?> GetSongDetailAsync(int songId, int userId)
        {
            var songDto = await _context.Song
                .Where(s => s.Id == songId)
                .Select(s => new SongDetailDTO {
                    Id = s.Id,
                    Title = s.Name, 
                    ImageUrl = s.AvatarUrl, 
                    LyricUrl = s.LrcUrl ?? "", 
                    Artist = string.Join(", ", s.SongArtists.Select(sa => sa.Artist.Name)),
                    Favorite = s.Favorites.Count(f => f.IsFavorite),
                    Reviews = s.Ratings.Count(),
                    IsFavorited = userId != 0 && s.Favorites.Any(f => f.UserId == userId && f.IsFavorite),
                    IsReviewed = userId != 0 && s.Ratings.Any(r => r.UserId == userId)
                })
                .FirstOrDefaultAsync();

            return songDto;
        }

        public async Task<List<ArtistDTO>> GetArtistsBySongIdAsync(int songId)
        {
            return await _context.SongArtist
                .AsNoTracking()
                .Where(sa => sa.SongId == songId)
                .Select(sa => new ArtistDTO {
                    Name = sa.Artist.Name,
                    AvatarURL = sa.Artist.AvatarURL ?? "" // Xử lý null nếu có
                })
                .ToListAsync();
        }

        public async Task<List<RelatedSongDTO>> GetRelatedSongsAsync(int songId)
        {
            var artistIds = await _context.SongArtist
                .Where(sa => sa.SongId == songId)
                .Select(sa => sa.ArtistId)
                .ToListAsync();

            if (artistIds.Count == 0) return new List<RelatedSongDTO>();

            var relatedSongs = await _context.SongArtist
                .AsNoTracking()
                .Where(sa => artistIds.Contains(sa.ArtistId) && sa.SongId != songId)
                .Select(sa => sa.Song) 
                .Distinct() 
                .Take(10) 
                .Select(s => new RelatedSongDTO {
                    Id = s.Id,
                    Title = s.Name,
                    ImageUrl = s.AvatarUrl,
                    Mp3Url = s.Mp3Url
                })
                .ToListAsync();

            return relatedSongs;
        }

    }
}
