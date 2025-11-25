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
            CreateMap<Song, SongWithArtistRole>()
                .ForMember(dto => dto.Type,
                    opt => opt.MapFrom((src, dest, destMember, context) =>
                    {
                        var artistId = (int)context.Items["artistId"];
                        var mainArtistId = src.SongArtists.OrderBy(sa => sa.Id).First().ArtistId;
                        return mainArtistId == artistId ? "Main" : "Collab";
                    })
                )
                .ForMember(dto => dto.Artists,
                    opt => opt.MapFrom(e => e.SongArtists.Select(sa => new PartialArtistDTO
                    {
                        Id = sa.Artist.Id,
                        Name = sa.Artist.Name
                    }))
                );
            CreateMap<Song, NextBatchSongDTO>()
                .ForMember(dto => dto.ArtistNames,
                    opt => opt.MapFrom(e => e.SongArtists.Select(sa => sa.Artist.Name)))
                .ForMember(dto => dto.Title,
                    opt => opt.MapFrom(e => e.Name))
                .ForMember(dto => dto.CoverUrl,
                    opt => opt.MapFrom(e => e.AvatarUrl))
                .ForMember(dto => dto.AudioUrl,
                    opt => opt.MapFrom(e => e.Mp3Url))
                .ForMember(dto => dto.LyricUrl,
                    opt => opt.MapFrom(e => e.LrcUrl));
            CreateMap<Song, SongSearchDetailDTO>()
                .ForMember(dto => dto.Artists,
                    opt => opt.MapFrom(e => e.SongArtists.Select(sa => new PartialArtistDTO 
                    { 
                        Id = sa.Artist.Id, 
                        Name = sa.Artist.Name 
                    }))
                );


            // map artist
            CreateMap<Artist, ArtistDTO>().ReverseMap();
            CreateMap<Artist, PartialArtistDTO>().ReverseMap();

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
