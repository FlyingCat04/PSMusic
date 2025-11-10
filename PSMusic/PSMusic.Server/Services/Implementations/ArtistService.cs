using AutoMapper;
using PSMusic.Server.Models.DTO.Artist;
using PSMusic.Server.Models.Entities;
using PSMusic.Server.Repositories.Interfaces;
using PSMusic.Server.Services.Interfaces;

namespace PSMusic.Server.Services.Implementations
{
    public class ArtistService : IArtistService
    {
        private readonly IArtistRepository _repository;
        private readonly IMapper _mapper;

        public ArtistService(IArtistRepository repository, IMapper mapper) 
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ArtistDTO>>? SearchByName(string keyword)
        {
            var results = await _repository.Search(keyword) ?? Enumerable.Empty<Artist>();
            return _mapper.Map<IEnumerable<ArtistDTO>>(results);
        }

        public async Task<ArtistDTO?> GetById(int id)
        {
            Artist? artist = await _repository.GetById(id);
            return artist == null ? null : _mapper.Map<ArtistDTO>(artist);
        }
    }
}
