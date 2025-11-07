using AutoMapper;
using PSMusic.Server.Models.DTO.User;
using PSMusic.Server.Models.Entities;

namespace PSMusic.Server.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile() 
        {
            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<User, CreateUserDTO>().ReverseMap();
        }
    }
}
