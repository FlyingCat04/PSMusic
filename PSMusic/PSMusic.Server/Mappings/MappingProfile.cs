using AutoMapper;
using PSMusic.Server.Models.DTO.Artist;
using PSMusic.Server.Models.DTO.Category;
using PSMusic.Server.Models.DTO.Song;
using PSMusic.Server.Models.DTO.User;
using PSMusic.Server.Models.Entities;

namespace PSMusic.Server.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
            // map user
            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<User, CreateUserDTO>().ReverseMap();
            
            // map song
            CreateMap<Song, SongDTO>()
                .ForMember(dto => dto.ArtistNames,
                    opt => opt.MapFrom(e => e.SongArtists.Select(sa => sa.Artist.Name)))
                .ForMember(dto => dto.CategoryNames,
                    opt => opt.MapFrom(e => e.SongCategories.Select(sa => sa.Category.Name)));
            CreateMap<Song, SongDetailDTO>()
                .ForMember(dto => dto.Artists,
                    opt => opt.Ignore())
                .ForMember(dto => dto.Categories,
                    opt => opt.Ignore());

            // map artist
            CreateMap<Artist, ArtistDTO>().ReverseMap();

            // map category
            CreateMap<Category, CategoryDTO>().ReverseMap();

            // map related song
            CreateMap<Song, RelatedSongDTO>()
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.AvatarUrl))
                .ForMember(dest => dest.Mp3Url, opt => opt.MapFrom(src => src.Mp3Url));
        }
    }
}
