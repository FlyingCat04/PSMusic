using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using PSMusic.Server.Helpers;
using PSMusic.Server.Models.DTO.Artist;
using PSMusic.Server.Models.DTO.Search;
using PSMusic.Server.Models.DTO.Song;
using PSMusic.Server.Models.Entities;
using PSMusic.Server.Repositories.Implementations;
using PSMusic.Server.Repositories.Interfaces;
using PSMusic.Server.Services.Interfaces;

namespace PSMusic.Server.Services.Implementations
{
    public class SongService : ISongService
    {
        private readonly ISongRepository _songRepository;
        private readonly IMapper _mapper;
        private readonly IArtistService _artistService;


        public SongService(ISongRepository songRepository, IMapper mapper, IArtistService artistService)
        {
            _songRepository = songRepository;
            _mapper = mapper;
            _artistService = artistService;
        }

        public async Task<PagedResult<SongDTO>> GetAll(int page = 1, int size = 10)
        {
            if (page < 1) page = 1;
            if (size < 10) size = 10;

            var query = _songRepository.GetAll();

            var songs = query.Select(s => _mapper.Map<SongDTO>(s));
            
            return await songs.PaginateAsync(page, size);
        }

        public async Task<SongDetailDTO?> GetById(int id)
        {
            Song? song = await _songRepository.GetById(id);
            return song == null ? null : _mapper.Map<SongDetailDTO>(song);
        }

        public async Task<IEnumerable<SongDTO>?> SearchByName(string keyword)
        {
            var songs = await _songRepository.Search(keyword) ?? Enumerable.Empty<Song>();
            return _mapper.Map<IEnumerable<SongDTO>>(songs);
        }

        //public async Task<SearchResponseDTO?> SearchAll(string keyword, int page, int size)
        //{
        //    if (page < 1) page = 1;
        //    if (size < 10) size = 10;

        //    var songs = await SearchByName(keyword) ?? Enumerable.Empty<SongDTO>();

        //    var songResults = new List<SearchResultDTO>();
        //    foreach (var song in songs)
        //    {
        //        var artistsForSong = song.ArtistNames;

        //        songResults.Add(new SearchResultDTO
        //        {
        //            Id = song.Id,
        //            Type = "song",
        //            Name = song.Name,
        //            ArtistsName = artistsForSong
        //        });
        //    }


        //    var artists = await _artistService.SearchByName(keyword) ?? Enumerable.Empty<ArtistDTO>();
        //    var artistResults = artists.Select(a => new SearchResultDTO
        //    {
        //        Id = a.Id,
        //        Type = "artist",
        //        Name = a.Name,
        //    })
        //    .ToList();

        //    SearchResultDTO? topResult = null;
        //    string normalizedKeyword = TextHelper.Normalize(keyword);
        //    topResult = artistResults.FirstOrDefault(a =>
        //        TextHelper.Normalize(a.Name).Equals(normalizedKeyword, StringComparison.OrdinalIgnoreCase));
        //    if (topResult == null)
        //    {
        //        topResult = songResults.FirstOrDefault(s =>
        //            TextHelper.Normalize(s.Name).Equals(normalizedKeyword, StringComparison.OrdinalIgnoreCase));
        //    }

        //    if (topResult != null)
        //    {
        //        artistResults.Remove(topResult);
        //        songResults.Remove(topResult);
        //    }

        //    var combinedResults = artistResults
        //        .Concat(songResults)
        //        .Skip((page - 1) * size)
        //        .Take(size)
        //        .ToList();

        //    return new SearchResponseDTO
        //    {
        //        Results = combinedResults,
        //        TopResult = topResult,
        //        TotalPages = (int)Math.Ceiling((double)artistResults.Count() / size)
        //    };
        //}

        public async Task<SearchResponseDTO?> SearchAll(string keyword, int page, int size)
        {
            if (page < 1) page = 1;
            if (size < 10) size = 10;

            // 1. SONGS
            var songs = await _songRepository.Search(keyword) ?? Enumerable.Empty<Song>();
            var songDTOs = _mapper.Map<IEnumerable<SongDTO>>(songs);

            var songResults = songDTOs.Select(s => new SearchResultDTO
            {
                Id = s.Id,
                Type = "song",
                Name = s.Name,
                ArtistsName = s.ArtistNames?.ToList() ?? new List<string>()
            }).ToList();

            // 2. ARTISTS
            var artists = await _artistService.SearchByName(keyword) ?? Enumerable.Empty<ArtistDTO>();
            var artistResults = artists.Select(a => new SearchResultDTO
            {
                Id = a.Id,
                Type = "artist",
                Name = a.Name,
                ArtistsName = new List<string>() // hoặc null cũng được
            }).ToList();

            // 3. TOP RESULT
            string normalizedKeyword = TextHelper.Normalize(keyword);

            SearchResultDTO? topResult =
                artistResults.FirstOrDefault(a =>
                    TextHelper.Normalize(a.Name).Equals(normalizedKeyword, StringComparison.OrdinalIgnoreCase))
                ??
                songResults.FirstOrDefault(s =>
                    TextHelper.Normalize(s.Name).Equals(normalizedKeyword, StringComparison.OrdinalIgnoreCase));

            if (topResult != null)
            {
                artistResults.Remove(topResult);
                songResults.Remove(topResult);
            }

            // 4. GỘP RỒI MỚI PHÂN TRANG
            var combinedAll = artistResults.Concat(songResults).ToList();

            int totalItems = combinedAll.Count;
            int totalPages = (int)Math.Ceiling(totalItems / (double)size);

            var pagedResults = combinedAll
                .Skip((page - 1) * size)
                .Take(size)
                .ToList();

            return new SearchResponseDTO
            {
                TopResult = topResult,
                Results = pagedResults,
                TotalPages = totalPages
                // Total = pagedResults.Count + (TopResult != null ? 1 : 0)
            };
        }



        public async Task<PagedResult<SongDTO>> GetPopularSongs(int page, int size)
        {
            var query = _songRepository.GetSongsWithStreamsLast7Days();

            var songs = query.Select(s => _mapper.Map<SongDTO>(s));
            return await songs.PaginateAsync(page, size);
        }
    }
}
