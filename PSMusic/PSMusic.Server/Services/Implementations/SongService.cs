using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using PSMusic.Server.Models.DTO.Artist;
using PSMusic.Server.Models.DTO.Search;
using PSMusic.Server.Models.DTO.Song;
using PSMusic.Server.Models.Entities;
using PSMusic.Server.Repositories.Interfaces;
using PSMusic.Server.Services.Interfaces;
using PSMusic.Server.Helpers;

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

        public async Task<IEnumerable<SongDTO>> GetAll(int page = 1, int size = 20)
        {
            if (page < 1) page = 1;
            if (size < 20) size = 20;

            var query = _songRepository.GetAll();

            var pagedSongs = await query
                .Skip((page - 1) * size)
                .Take(size)
                .ProjectTo<SongDTO>(_mapper.ConfigurationProvider)
                .ToListAsync();
            
            return pagedSongs;
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

        public async Task<SearchResponseDTO?> SearchAll(string keyword, int page, int size)
        {
            if (page < 1) page = 1;
            if (size < 10) size = 10;

            var songs = await SearchByName(keyword) ?? Enumerable.Empty<SongDTO>();
            
            var songResults = new List<SearchResultDTO>();
            foreach (var song in songs)
            {
                var artistsForSong = new List<string>();

                foreach (var artistId in song.ArtistIds)
                {
                    var artist = await _artistService.GetById(artistId);
                    if (artist == null) continue;
                    artistsForSong.Add(artist.Name);
                }

                songResults.Add(new SearchResultDTO
                {
                    Id = song.Id,
                    Type = "song",
                    Name = song.Name,
                    ArtistsName = artistsForSong
                });
            }


            var artists = await _artistService.SearchByName(keyword) ?? Enumerable.Empty<ArtistDTO>();
            var artistResults = artists.Select(a => new SearchResultDTO
            {
                Id = a.Id,
                Type = "artist",
                Name = a.Name,
            })
            .ToList();

            SearchResultDTO? topResult = null;
            string normalizedKeyword = TextHelper.Normalize(keyword);
            topResult = artistResults.FirstOrDefault(a =>
                TextHelper.Normalize(a.Name).Equals(normalizedKeyword, StringComparison.OrdinalIgnoreCase));
            if (topResult == null)
            {
                topResult = songResults.FirstOrDefault(s =>
                    TextHelper.Normalize(s.Name).Equals(normalizedKeyword, StringComparison.OrdinalIgnoreCase));
            }

            if (topResult != null)
            {
                artistResults.Remove(topResult);
                songResults.Remove(topResult);
            }

            var combinedResults = artistResults
                .Concat(songResults)
                .Skip((page - 1) * size)
                .Take(size)
                .ToList();

            return new SearchResponseDTO
            {
                Results = combinedResults,
                TopResult = topResult
            };
        }
    }
}
