using User.Api.Dtos;
using User.Grpc.Protos;

namespace User.Api.GrpcService
{
    public class UserGrpcService
    {
        private readonly UserProtoService.UserProtoServiceClient _service;

        public UserGrpcService(UserProtoService.UserProtoServiceClient service)
        {
            _service = service;
        }
        public async Task AddUser(UserDto userDto)
        {
            var request = new UserRequest
            {
                UserName = userDto.UserName,
                Password = userDto.Password,
                Lat = userDto.Lat,
                Long = userDto.Long
            };
            await _service.AddUserAsync(request);
        }
        public async Task<UserReply> Login(LoginDto loginDto)
        {
            var request = new LoginRequest
            {
                UserName = loginDto.Username,
                Password = loginDto.Password
            };
            return await _service.LoginAsync(request);
        }
        public async Task<UsersReply> FindNearest(double lat, double longi)
        {
            var request = new Location
            {
                Lat = lat,
                Long = longi
            };
            return await _service.FindNearestAsync(request);
        }
    }
}
