using AutoMapper;
using PSMusic.Server.Models.DTO.Auth;
using PSMusic.Server.Models.DTO.User;
using PSMusic.Server.Models.Entities;
using PSMusic.Server.Repositories.Interfaces;
using PSMusic.Server.Services.Interfaces;
using System.Security.Claims;

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
                var refreshToken = _tokenGenerator.GenerateRefreshToken(user);
                return new AuthResDTO { IsSuccess = true, Message = "Đăng nhập thành công", Token = token, RefreshToken = refreshToken }; 
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

        public async Task<AuthResDTO> Refresh(string refreshToken)
        {
            var principal = _tokenGenerator.ValidateRefreshToken(refreshToken);
            if (principal == null) return new AuthResDTO { IsSuccess = false, Message = "Refresh token không hợp lệ hoặc đã hết hạn" };

            var userId = principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return new AuthResDTO { IsSuccess = false, Message = "Token không chứa thông tin người dùng" };

            var user = await _userRepository.GetUserById(int.Parse(userId));
            if (user == null) return new AuthResDTO { IsSuccess = false, Message = "Người dùng không tồn tại" };

            var newToken = _tokenGenerator.GenerateToken(user);
            return new AuthResDTO { IsSuccess = true, Message = "Refresh thành công", Token = newToken };
        }
    }
}
