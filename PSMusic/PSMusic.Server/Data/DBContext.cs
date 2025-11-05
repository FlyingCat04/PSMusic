using Microsoft.EntityFrameworkCore;
using PSMusic.Server.Models.Entities;

namespace PSMusic.Server.Data
{
    public class DBContext : DbContext
    {
        public DBContext(DbContextOptions<DBContext> options) : base(options)
        {
        }

        public DbSet<User> User { get; set; } = null!;
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(entity => entity.Id);
                entity.Property(entity => entity.Username).IsRequired();
                entity.Property(entity => entity.Password).IsRequired();
                entity.Property(entity => entity.Name).IsRequired();
                entity.Property(entity => entity.Email).IsRequired();
            });
        }
    }
}
