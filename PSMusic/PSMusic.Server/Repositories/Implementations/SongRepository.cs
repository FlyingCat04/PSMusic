using Microsoft.EntityFrameworkCore;
using PSMusic.Server.Data;
using PSMusic.Server.Models.DTO.Song;
using PSMusic.Server.Models.Entities;
using PSMusic.Server.Repositories.Interfaces;

namespace PSMusic.Server.Repositories.Implementations
{
    public class SongRepository : ISongRepository
    {
        private readonly DBContext _dbContext;

        public SongRepository(DBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public IQueryable<Song> GetAll()
        {
            return _dbContext.Song
                .Where(s => !string.IsNullOrEmpty(s.LrcUrl))
                .Include(s => s.SongArtists)
                    .ThenInclude(sa => sa.Artist)
                .Include(s => s.SongCategories)
                    .ThenInclude(sc => sc.Category)
                .AsNoTracking();
        }

        public async Task<Song?> GetById(int id)
        {
            Song? song = await _dbContext.Song
                .Where(s => !string.IsNullOrEmpty(s.LrcUrl))
                .Include(s => s.SongArtists)
                    .ThenInclude(sa => sa.Artist)
                .Include(s => s.SongCategories)
                    .ThenInclude(sc => sc.Category)
                .FirstOrDefaultAsync(s => s.Id == id);
            return song == null ? null : song;
        }

        public async Task<IEnumerable<Song>?> Search(string keyword)
        {
            return await _dbContext.Song
                .Where(s => !string.IsNullOrEmpty(s.LrcUrl))
                .Include(s => s.SongArtists)
                    .ThenInclude(sa => sa.Artist)
                .Where(s => EF.Functions.ILike(EF.Functions.Unaccent(s.Name), EF.Functions.Unaccent($"%{keyword}%"))
                || s.SongArtists.Any(sa => EF.Functions.ILike(EF.Functions.Unaccent(sa.Artist.Name), EF.Functions.Unaccent($"%{keyword}%"))))
                .ToListAsync();
        }

        public async Task<(IEnumerable<Song> Songs, int TotalCount)> SearchPaging(string keyword, int page, int size)
        {
            var query = _dbContext.Song
                .Where(s => !string.IsNullOrEmpty(s.LrcUrl))
                .Include(s => s.SongArtists).ThenInclude(sa => sa.Artist)
                .Where(s =>
                    EF.Functions.ILike(EF.Functions.Unaccent(s.Name), EF.Functions.Unaccent($"%{keyword}%")) ||
                    s.SongArtists.Any(sa => EF.Functions.ILike(EF.Functions.Unaccent(sa.Artist.Name), EF.Functions.Unaccent($"%{keyword}%")))
                );

            int total = await query.CountAsync();

            var result = await query
                .OrderBy(s => s.Name)             
                .Skip((page - 1) * size)
                .Take(size)
                .ToListAsync();

            return (result, total);
        }

        public IQueryable<Song> GetSongsWithStreamsLast7Days()
        {
            var week = DateTime.UtcNow.AddDays(-7);

            return _dbContext.Song
                .Where(s => !string.IsNullOrEmpty(s.LrcUrl))
                .Where(s => _dbContext.Stream
                    .Any(st => st.SongId == s.Id && st.StreamedAt >= week))
                .Include(s => s.SongArtists)
                    .ThenInclude(sa => sa.Artist)
                .Include(s => s.SongCategories)
                    .ThenInclude(sc => sc.Category)
                .OrderByDescending(s => _dbContext.Stream
                    .Count(st => st.SongId == s.Id && st.StreamedAt >= week));
        }

        public async Task<IEnumerable<Song>> GetRandomSongsAsync(int count)
        {
            return await _dbContext.Song
                .Include(s => s.SongArtists)
                    .ThenInclude(sa => sa.Artist)
                .OrderBy(s => EF.Functions.Random())
                .Take(count)
                .ToListAsync();
        }

        public async Task<IEnumerable<Song>?> GetByArtistId(int id)
        {
            return await _dbContext.Song
                .Where(s => !string.IsNullOrEmpty(s.LrcUrl))
                .Where(s => s.SongArtists.Count == 1)
                .Where(s => s.SongArtists
                    .Any(sa => sa.ArtistId == id))
                .Where(s => _dbContext.Stream
                    .Any(st => st.SongId == s.Id))
                .Include(s => s.SongArtists)
                    .ThenInclude(sa => sa.Artist)
                .OrderByDescending(s => _dbContext.Stream
                    .Count(st => st.SongId == s.Id))
                .ToListAsync();
        }

        public async Task<IEnumerable<Song>?> GetPopularSongWithCategory(int id)
        {
            return await _dbContext.Song
                .Where(s => !string.IsNullOrEmpty(s.LrcUrl))
                .Where(s => s.SongCategories.Any(sc => sc.CategoryId == id))
                .Where(s => _dbContext.Stream
                    .Any(st => st.SongId == s.Id))
                .Include(s => s.SongArtists)
                    .ThenInclude(sa => sa.Artist)
                .Include(s => s.SongCategories)
                    .ThenInclude(sc => sc.Category)
                .OrderByDescending(s => _dbContext.Stream
                    .Count(st => st.SongId == s.Id))
                .ToListAsync();
        }
        public async Task<SongDetail2DTO?> GetSongDetail_DTO(int songId, int userId)
        {
            var songDto = await _dbContext.Song
                .Where(s => s.Id == songId)
                .Select(s => new SongDetail2DTO {
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
        
        public async Task<List<Song>> GetRelatedSongs(int songId)
        {
            var artistIdsQuery = _dbContext.SongArtist
                .Where(sa => sa.SongId == songId)
                .Select(sa => sa.ArtistId);

            return await _dbContext.SongArtist
                .AsNoTracking()
                .Where(sa => artistIdsQuery.Contains(sa.ArtistId) && sa.SongId != songId)
                .Select(sa => sa.Song)
                .Distinct()
                .Take(30)
                .Include(s => s.SongArtists).ThenInclude(sa => sa.Artist)
                .ToListAsync(); 
        } 

        public async Task<SongPlayerDTO?> GetSongForPlayer_DTO(int id)
        {
            return await _dbContext.Song
                .AsNoTracking()
                .Where(s => s.Id == id)
                .Select(s => new SongPlayerDTO {
                    Id = s.Id,
                    Title = s.Name,
                    CoverUrl = s.AvatarUrl,
                    AudioUrl = s.Mp3Url ?? "",
                    LyricUrl = s.LrcUrl ?? "",
                    Artist = string.Join(", ", s.SongArtists.Select(sa => sa.Artist.Name)),
                    SingerUrl = s.SongArtists
                        .Select(sa => sa.Artist.AvatarUrl)
                        .FirstOrDefault() ?? "",
                    Likes = s.Favorites.Count(f => f.IsFavorite)
                })
                .FirstOrDefaultAsync();
        }

        public async Task<List<FavoriteSongDTO>> GetFavoriteSongs(int userId)
        {
            return await _dbContext.Favorite
                .AsNoTracking()
                .Where(f => f.UserId == userId && f.IsFavorite)
                .Select(f => f.Song) 
                .Select(s => new FavoriteSongDTO
                {
                    Id = s.Id,
                    Title = s.Name,
                    ImageUrl = s.AvatarUrl, 
                    LyricUrl = s.LrcUrl ?? "", 
                    Artist = string.Join(", ", s.SongArtists.Select(sa => sa.Artist.Name))
                })
                .ToListAsync();
        }

        public async Task<int> GetFavoriteCount(int songId)
        {
            return await _dbContext.Favorite
                .Where(f => f.SongId == songId && f.IsFavorite)
                .CountAsync();
        }
    }
}
