// Trong thư mục Post.Infrastructure (có thể tạo folder DesignTime hoặc Tools nếu muốn)
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;


namespace Post.Infrastructure.Data
{
    public class DataContextFactory : IDesignTimeDbContextFactory<DataContext>
    {
        public DataContext CreateDbContext(string[] args)
        {
            // Xây dựng cấu hình để đọc chuỗi kết nối
            // Điều này giả định bạn có appsettings.json trong project khởi động của bạn (Post.Api)
            // và bạn cần lấy chuỗi kết nối từ đó.
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../Post.Api")) // Đi đến thư mục của project Post.Api
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection"); // Thay thế bằng tên Connection String của bạn

            var optionsBuilder = new DbContextOptionsBuilder<DataContext>();
            optionsBuilder.UseSqlServer(connectionString); // Thay thế nếu bạn dùng database khác (ví dụ: UseSqlite)

            return new DataContext(optionsBuilder.Options);
        }
    }
}