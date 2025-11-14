using AutoMapper;
using PSMusic.Server.Models.DTO.Auth;
using PSMusic.Server.Models.DTO.User;
using PSMusic.Server.Models.Entities;
using PSMusic.Server.Repositories.Interfaces;
using PSMusic.Server.Services.Interfaces;

namespace PSMusic.Server.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly ITokenGenerator _tokenGenerator;

        public AuthService(IConfiguration configuration, IUserRepository userRepository, IMapper mapper, ITokenGenerator tokenGenerator)
        {
            _configuration = configuration;
            _userRepository = userRepository;
            _mapper = mapper;
            _tokenGenerator = tokenGenerator;
        }

        public async Task<AuthResDTO> Login(AuthReqDTO req)
        {
            User? user = await _userRepository.GetUserByUsername(req.Username);
            if (user == null) return new AuthResDTO { IsSuccess = false, Message = "Tài khoản không tồn tại" };

            if (user.VerifyPassword(req.Password))
            {
                var token = _tokenGenerator.GenerateToken(user);
                return new AuthResDTO { IsSuccess = true, Message = "Đăng nhập thành công", Token = token }; 
            }
            else return new AuthResDTO { IsSuccess = false, Message = "Sai mật khẩu" };
        }

        public async Task<AuthResDTO> Register(CreateUserDTO user)
        {
            bool emailExistence = await _userRepository.CheckEmailExistence(user.Email);
            if (emailExistence) return new AuthResDTO { IsSuccess = false, Message = "Email đã tồn tại" };

            User? userExist = await _userRepository.GetUserByUsername(user.Username);
            if (userExist != null) return new AuthResDTO { IsSuccess = false, Message = "Tài khoản đã tồn tại" };
            
            User userEntity = _mapper.Map<User>(user);
            userEntity.SetPassword(userEntity.Password);
            if (await _userRepository.Add(userEntity)) return new AuthResDTO { IsSuccess = true, Message = "Đăng ký thành công" };
            else return new AuthResDTO { IsSuccess = false, Message = "Tạo tài khoản thất bại"};
        }
    }
}
