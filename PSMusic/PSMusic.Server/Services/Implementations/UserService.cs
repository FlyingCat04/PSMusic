using AutoMapper;
using PSMusic.Server.Models.DTO.User;
using PSMusic.Server.Models.Entities;
using PSMusic.Server.Repositories.Interfaces;
using PSMusic.Server.Services.Interfaces;

namespace PSMusic.Server.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IMapper mapper) 
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        public async Task<UserDTO?> GetUserById(int id)
        {
            User? user = await _userRepository.GetUserById(id);
            return user == null ? null : _mapper.Map<UserDTO>(user);
        }
    }
}
