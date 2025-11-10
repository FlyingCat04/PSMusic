using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using PSMusic.Server.Models.DTO.Song;
using PSMusic.Server.Models.Entities;
using PSMusic.Server.Repositories.Interfaces;
using PSMusic.Server.Services.Interfaces;
using System.Runtime.CompilerServices;

namespace PSMusic.Server.Services.Implementations
{
    public class SongService : ISongService
    {
        private readonly ISongRepository _songRepository;
        private readonly IMapper _mapper;

        public SongService(ISongRepository songRepository, IMapper mapper)
        {
            _songRepository = songRepository;
            _mapper = mapper;
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
    }
}
