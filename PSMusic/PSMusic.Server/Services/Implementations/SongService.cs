using AutoMapper;
using AutoMapper.QueryableExtensions;
using Elastic.Clients.Elasticsearch;
using Microsoft.EntityFrameworkCore;
using PSMusic.Server.Helpers;
using PSMusic.Server.Models.DTO.Artist;
using PSMusic.Server.Models.DTO.Search;
using PSMusic.Server.Models.DTO.Song;
using PSMusic.Server.Models.Entities;
using PSMusic.Server.Repositories.Implementations;
using PSMusic.Server.Repositories.Interfaces;
using PSMusic.Server.Services.Interfaces;
using System.Text.Json;

namespace PSMusic.Server.Services.Implementations
{
    public class SongService : ISongService
    {
        private readonly ISongRepository _songRepository;
        private readonly IMapper _mapper;
        private readonly IArtistService _artistService;
        private readonly ElasticsearchClient _elasticClient;
        private static bool _hasIndexedArtists = false;

        public SongService(ISongRepository songRepository, IMapper mapper, IArtistService artistService, ElasticsearchClient elasticClient)
        {
            _songRepository = songRepository;
            _mapper = mapper;
            _artistService = artistService;
            _elasticClient = elasticClient;
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

        public async Task<IEnumerable<SongSearchDetailDTO>?> SearchByName(string keyword)
        {
            var songs = await _songRepository.Search(keyword) ?? Enumerable.Empty<Song>();
            return _mapper.Map<IEnumerable<SongSearchDetailDTO>>(songs);
        }

        //public async Task<SearchResponseDTO?> SearchAll(string keyword, int page, int size)
        //{
        //    if (page < 1) page = 1;
        //    if (size < 10) size = 10;
        //    var songs = await SearchByName(keyword) ?? Enumerable.Empty<SongSearchDetailDTO>();
        //    var songResults = new List<SearchResultDTO>();
        //    foreach (var song in songs)
        //    {
        //        var artistsForSong = _mapper.Map<IEnumerable<PartialArtistDTO>>(song.Artists);
        //        TimeSpan duration = TimeSpan.TryParse(song.Duration, out var d) ? d : TimeSpan.Zero;
        //        songResults.Add(new SearchResultDTO
        //        {
        //            Id = song.Id,
        //            Type = "song",
        //            AvatarUrl = song.AvatarUrl,
        //            Mp3Url = song.Mp3Url,
        //            Name = song.Name,
        //            Artists = artistsForSong,
        //            Duration = duration,
        //        });
        //    }


        //    var artists = await _artistService.SearchByName(keyword) ?? Enumerable.Empty<ArtistDTO>();
        //    var artistResults = artists.Select(a => new SearchResultDTO
        //    {
        //        Id = a.Id,
        //        Type = "artist",
        //        AvatarUrl = a.AvatarUrl,
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
        //        TotalPages = (int)Math.Ceiling((double)(artistResults.Count() + songResults.Count()) / size)
        //    };
        //}

        private async Task EnsureArtistsIndexed()
        {
            if (_hasIndexedArtists) return;

            try
            {
                var countResponse = await _elasticClient.CountAsync<ArtistDocument>(c => c
                    .Indices("artists")
                );

                if (countResponse.IsValidResponse && countResponse.Count > 0)
                {
                    _hasIndexedArtists = true;
                    return;
                }

                var artists = await _artistService.GetAll();
                if (artists == null || !artists.Any()) return;

                foreach (var artist in artists)
                {
                    var document = new ArtistDocument
                    {
                        Id = artist.Id,
                        Name = artist.Name,
                        Type = "artist",
                        AvatarUrl = artist.AvatarUrl ?? ""
                    };

                    await _elasticClient.IndexAsync(document, idx => idx
                        .Index("artists")
                        .Id(artist.Id)
                    );
                }

                _hasIndexedArtists = true;
            }
            catch (Exception)
            {
                // Ignore
            }
        }

        public async Task<SearchResponseDTO?> SearchAll(string keyword, int page, int size)
        {
            if (page < 1) page = 1;
            if (size < 10) size = 10;

            await EnsureArtistsIndexed();

            var songResponse = await _elasticClient.SearchAsync<SongDocument>(s => s
                .Indices("songs")
                .From((page - 1) * size)
                .Size(size)
                .Query(q => q
                    .Bool(b => b
                        .Should(
                            sh => sh.MultiMatch(m => m
                                .Fields(new[] { "name^3", "artists.name^2", "category^1.5" })
                                .Query(keyword)
                                .Fuzziness(new Fuzziness("AUTO"))
                            ),
                            sh => sh.Term(t => t
                                .Field("name.keyword")
                                .Value(keyword)
                                .CaseInsensitive(true)
                                .Boost(10)
                            )
                        )
                    )
                )
            );

            var artistResponse = await _elasticClient.SearchAsync<ArtistDocument>(s => s
                .Indices("artists")
                .From(0)
                .Size(size)
                .Query(q => q
                    .Bool(b => b
                        .Should(
                            sh => sh.Match(m => m
                                .Field(f => f.Name)
                                .Query(keyword)
                                .Fuzziness(new Fuzziness("AUTO"))
                            ),
                            sh => sh.Term(t => t
                                .Field("name.keyword")
                                .Value(keyword)
                                .CaseInsensitive(true)
                                .Boost(10)
                            )
                        )
                    )
                )
            );

            var searchResults = new List<SearchResultDTO>();
            SearchResultDTO? topResult = null;

            // Map Artists
            if (artistResponse.IsValidResponse && artistResponse.Hits.Any())
            {
                foreach (var hit in artistResponse.Hits)
                {
                    var doc = hit.Source;
                    if (doc == null) continue;

                    var result = new SearchResultDTO
                    {
                        Id = doc.Id,
                        Type = "artist",
                        Name = doc.Name,
                        AvatarUrl = doc.AvatarUrl,
                        Mp3Url = null,
                        Duration = TimeSpan.Zero,
                        Artists = new List<PartialArtistDTO>()
                    };

                    searchResults.Add(result);

                    // Check for exact match as top result
                    if (topResult == null &&
                        doc.Name.Equals(keyword, StringComparison.OrdinalIgnoreCase))
                    {
                        topResult = result;
                    }
                }
            }

            // Map Songs
            if (songResponse.IsValidResponse && songResponse.Hits.Any())
            {
                foreach (var hit in songResponse.Hits)
                {
                    var doc = hit.Source;
                    if (doc == null) continue;

                    TimeSpan.TryParse(doc.Duration, out var duration);

                    var result = new SearchResultDTO
                    {
                        Id = doc.Id,
                        Type = "song",
                        Name = doc.Name,
                        AvatarUrl = doc.AvatarUrl,
                        Mp3Url = doc.Mp3Url,
                        Duration = duration,
                        Artists = doc.Artists
                    };

                    searchResults.Add(result);

                    // Check for exact match as top result if not found in artists
                    if (topResult == null &&
                        doc.Name.Equals(keyword, StringComparison.OrdinalIgnoreCase))
                    {
                        topResult = result;
                    }
                }
            }

            // Remove top result from main list
            if (topResult != null)
            {
                searchResults.Remove(topResult);
            }

            // Sort: Artists first, then Songs
            searchResults = searchResults
                .OrderBy(r => r.Type == "artist" ? 0 : 1)
                .ToList();

            long totalSongs = songResponse.IsValidResponse ? songResponse.Total : 0;
            long totalArtists = artistResponse.IsValidResponse ? artistResponse.Total : 0;

            return new SearchResponseDTO
            {
                Results = searchResults,
                TopResult = topResult,
                TotalPages = (int)Math.Ceiling((double)(totalSongs + totalArtists) / size)
            };
        }

        //public async Task<SearchResponseDTO?> SearchAll(string keyword, int page, int size)
        //{
        //    if (page < 1) page = 1;
        //    if (size < 10) size = 10;

        //    var response = await _elasticClient.SearchAsync<SongDocument>(s => s
        //        .Indices(new[] { "songs", "artists" })
        //        .IgnoreUnavailable(true)
        //        .From((page - 1) * size)
        //        .Size(size)
        //        .Query(q => q
        //            .Bool(b => b
        //                .Should(
        //                    sh => sh.MultiMatch(m => m
        //                        .Fields(new[] { "name^3", "artists.name^2", "category^1.5", "description" })
        //                        .Query(keyword)
        //                        .Fuzziness(new Fuzziness("AUTO"))
        //                    ),
        //                    sh => sh.Term(t => t
        //                        .Field("name.keyword")
        //                        .Value(keyword)
        //                        .CaseInsensitive(true)
        //                        .Boost(10)
        //                    )
        //                )
        //            )
        //        )
        //    );

        //    if (!response.IsValidResponse) return null;

        //    var searchResults = new List<SearchResultDTO>();
        //    SearchResultDTO? topResult = null;

        //    foreach (var hit in response.Hits)
        //    {
        //        var doc = hit.Source;
        //        if (doc == null) continue;

        //        TimeSpan.TryParse(doc.Duration, out var duration);

        //        searchResults.Add(new SearchResultDTO
        //        {
        //            Id = doc.Id,
        //            Type = hit.Index.ToLower().Contains("artist") ? "artist" : "song",
        //            Name = doc.Name,
        //            AvatarUrl = doc.AvatarUrl,
        //            Mp3Url = doc.Mp3Url,
        //            Duration = duration,
        //            Artists = doc.Artists
        //        });
        //    }

        //    if (searchResults.Any() &&
        //        searchResults.First().Name.Equals(keyword, StringComparison.OrdinalIgnoreCase))
        //    {
        //        topResult = searchResults.First();
        //        searchResults.RemoveAt(0);
        //    }

        //    return new SearchResponseDTO
        //    {
        //        Results = searchResults,
        //        TopResult = topResult,
        //        TotalPages = response.Total > 0 ? (int)Math.Ceiling((double)response.Total / size) : 0
        //    };
        //}

        //public async Task<SearchResponseDTO?> SearchAll(string keyword, int page, int size)
        //{
        //    if (page < 1) page = 1;
        //    if (size < 10) size = 10;

        //    // 1. SONGS
        //    var songs = await _songRepository.Search(keyword) ?? Enumerable.Empty<Song>();
        //    var songDTOs = _mapper.Map<IEnumerable<SongDTO>>(songs);

        //    var songResults = songDTOs.Select(s => new SearchResultDTO
        //    {
        //        Id = s.Id,
        //        Type = "song",
        //        Name = s.Name,
        //        ArtistsName = s.ArtistNames?.ToList() ?? new List<string>()
        //    }).ToList();

        //    // 2. ARTISTS
        //    var artists = await _artistService.SearchByName(keyword) ?? Enumerable.Empty<ArtistDTO>();
        //    var artistResults = artists.Select(a => new SearchResultDTO
        //    {
        //        Id = a.Id,
        //        Type = "artist",
        //        Name = a.Name,
        //        ArtistsName = new List<string>() // hoặc null cũng được
        //    }).ToList();

        //    // 3. TOP RESULT
        //    string normalizedKeyword = TextHelper.Normalize(keyword);

        //    SearchResultDTO? topResult =
        //        artistResults.FirstOrDefault(a =>
        //            TextHelper.Normalize(a.Name).Equals(normalizedKeyword, StringComparison.OrdinalIgnoreCase))
        //        ??
        //        songResults.FirstOrDefault(s =>
        //            TextHelper.Normalize(s.Name).Equals(normalizedKeyword, StringComparison.OrdinalIgnoreCase));

        //    if (topResult != null)
        //    {
        //        artistResults.Remove(topResult);
        //        songResults.Remove(topResult);
        //    }

        //    // 4. GỘP RỒI MỚI PHÂN TRANG
        //    var combinedAll = artistResults.Concat(songResults).ToList();

        //    int totalItems = combinedAll.Count;
        //    int totalPages = (int)Math.Ceiling(totalItems / (double)size);

        //    var pagedResults = combinedAll
        //        .Skip((page - 1) * size)
        //        .Take(size)
        //        .ToList();

        //    return new SearchResponseDTO
        //    {
        //        TopResult = topResult,
        //        Results = pagedResults,
        //        TotalPages = totalPages
        //        // Total = pagedResults.Count + (TopResult != null ? 1 : 0)
        //    };
        //}
        public async Task<PagedResult<SongSearchDetailDTO>> GetPopularSongs(int page, int size)
        {
            var query = _songRepository.GetSongsWithStreamsLast7Days();

            var songs = query.Select(s => _mapper.Map<SongSearchDetailDTO>(s));
            return await songs.PaginateAsync(page, size);
        }

        public async Task<IEnumerable<NextBatchSongDTO>> GetBatch(int size)
        {
            var results = await _songRepository.GetRandomSongsAsync(size);
            return _mapper.Map<IEnumerable<NextBatchSongDTO>>(results);
        }

        public async Task<IEnumerable<SongDTO>?> GetByArtistId(int id)
        {
            if (await _artistService.GetById(id) == null) throw new Exception($"Nghệ sĩ với id {id} không tồn tại");

            var results = await _songRepository.GetByArtistId(id);
            return _mapper.Map<IEnumerable<SongDTO>>(results);
        }

        public async Task<PagedResult<SongWithArtistRole>?> GetPopularSongsAsMainArtistAsync(int id, int? userId, int page = 1, int size = 10)
        {
            if (page < 1) page = 1;
            if (size < 10) size = 10;

            var popularSongs = _songRepository.GetAll();

            var songAsMainArtist = popularSongs
                .Where(s => s.SongArtists
                    .Any(sa => sa.ArtistId == id && sa.Id ==
                        s.SongArtists.Min(x => x.Id)
                    )
                );

            var mainArtistSongs = await songAsMainArtist
                .Include(s => s.SongArtists)
                    .ThenInclude(sa => sa.Artist)
                .Include(s => s.Favorites)
                .ToListAsync();

            var result = mainArtistSongs
                .Select(s => {
                    var dto = _mapper.Map<SongWithArtistRole>(s, opt =>
                    {
                        opt.Items["artistId"] = id;
                    });
                    dto.IsFavorited = userId.HasValue && s.Favorites.Any(f => f.UserId == userId.Value && f.IsFavorite);
                    return dto;
                })
                .ToList();

            return result.Paginate(page, size);
        }

        public async Task<PagedResult<SongWithArtistRole>?> GetPopularSongsAsCollaboratorAsync(int id, int? userId, int page = 1, int size = 10)
        {

            var popularSongs = _songRepository.GetAll();

            var songAsCollaborator = popularSongs
                .Where(s => s.SongArtists
                    .Any(sa => sa.ArtistId == id && sa.Id !=
                        s.SongArtists.Min(x => x.Id)
                    )
                );

            var collaboratorSongs = await songAsCollaborator
                .Include(s => s.SongArtists)
                    .ThenInclude(sa => sa.Artist)
                .Include(s => s.Favorites)
                .ToListAsync();

            var result = collaboratorSongs
                .Select(s => {
                    var dto = _mapper.Map<SongWithArtistRole>(s, opt =>
                    {
                        opt.Items["artistId"] = id;
                    });
                    dto.IsFavorited = userId.HasValue && s.Favorites.Any(f => f.UserId == userId.Value && f.IsFavorite);
                    return dto;
                })
                .ToList();

            return result.Paginate(page, size);
        }

        public async Task<PagedResult<SongSearchDetailDTO>?> GetPopularSongWithCategory(int id, int? userId, int page, int size)
        {
            var results = await _songRepository.GetPopularSongWithCategory(id);
            if (results == null) return null;

            var songs = results.Select(s => {
                var dto = _mapper.Map<SongSearchDetailDTO>(s);
                dto.IsFavorited = userId.HasValue && s.Favorites.Any(f => f.UserId == userId.Value && f.IsFavorite);
                return dto;
            });
            return songs.Paginate(page, size);
        }

        public async Task<SongDetail2DTO?> GetSongDetail(int songId, int userId)
        {            
            var result = await _songRepository.GetSongDetail_DTO(songId, userId);
            return result;
        }

        public async Task<List<RelatedSongDTO>> GetRelatedSongs(int songId)
        {
            var songEntities = await _songRepository.GetRelatedSongs(songId);
            return _mapper.Map<List<RelatedSongDTO>>(songEntities);
        }

        public async Task<SongPlayerDTO?> GetSongForPlayer(int id, int userId)
        {
            var result = await _songRepository.GetSongForPlayer_DTO(id, userId);
            return result;
        }

        public async Task<List<FavoriteSongDTO>> GetFavoriteSongs(int userId)
        {
            var result = await _songRepository.GetFavoriteSongs(userId);
            return result;
        }

        public async Task<int> GetFavoriteCount(int songId)
        {
            return await _songRepository.GetFavoriteCount(songId);
        }

        public async Task<bool> ToggleFavorite(int songId, int userId)
        {
            return await _songRepository.ToggleFavorite(songId, userId);
        }

        public async Task<bool> AddStream(int songId, int userId)
        {
            var result = await _songRepository.AddStream(songId, userId);
            return result;
        }
    }
}
