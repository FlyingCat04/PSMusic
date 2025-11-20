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
        public DbSet<Category> Category { get; set; } = null!;
        public DbSet<Artist> Artist { get; set; } = null!;
        public DbSet<Playlist> Playlist { get; set; } = null!;
        public DbSet<Rating> Rating { get; set; } = null!;
        public DbSet<Song> Song { get; set; } = null!;
        public DbSet<PSMusic.Server.Models.Entities.Stream> Stream { get; set; } = null!;
        public DbSet<Favorite> Favorite { get; set; }
        public DbSet<SongCategory> SongCategory { get; set; } = null!;
        public DbSet<SongArtist> SongArtist { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(entity => entity.Id);
                entity.Property(entity => entity.Username).IsRequired();
                entity.Property(entity => entity.Password).IsRequired();
                entity.Property(entity => entity.DisplayName).IsRequired();
                entity.Property(entity => entity.Email).IsRequired();
                entity.HasIndex(entity => entity.Email)
                    .IsUnique();
                entity.HasIndex(entity => entity.Username)
                    .IsUnique();
            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(entity => entity.Id);
                entity.Property(entity => entity.Name).IsRequired();
            });

            modelBuilder.Entity<Song>(entity =>
            {
                entity.HasKey(entity => entity.Id);
                entity.Property(entity => entity.Name).IsRequired();
            });

            modelBuilder.Entity<SongCategory>(entity => 
            {
                entity.HasKey(sc => new { sc.SongId, sc.CategoryId });
                entity
                    .HasOne(sc => sc.Category)
                    .WithMany(c => c.SongCategories)
                    .HasForeignKey(sc => sc.CategoryId);

                entity
                    .HasOne(sc => sc.Song)
                    .WithMany(s => s.SongCategories)
                    .HasForeignKey(sc => sc.SongId);
            });

            modelBuilder.Entity<SongArtist>(entity =>
            {
                entity.HasKey(sa => new { sa.SongId, sa.ArtistId });
                entity
                    .HasOne(sa => sa.Song)
                    .WithMany(s => s.SongArtists)
                    .HasForeignKey(sa => sa.SongId);

                entity
                    .HasOne(sa => sa.Artist)
                    .WithMany(a => a.SongArtists)
                    .HasForeignKey(sa => sa.ArtistId);
            });

            modelBuilder.Entity<Artist>(entity =>
            {
                entity.HasKey(entity => entity.Id);
                entity.Property(entity => entity.Name).IsRequired();
                entity.Property(entity => entity.AvatarUrl).HasColumnName("AvatarUrl");
            });

            modelBuilder.Entity<Playlist>(entity =>
            {
                entity.HasKey(entity => entity.Id);
                entity.Property(entity => entity.Title).IsRequired();
                entity.Property(entity => entity.IsPublic).IsRequired();
                entity
                    .HasOne(p => p.User)
                    .WithMany(u => u.Playlists)
                    .HasForeignKey(p => p.UserId);
            });

            modelBuilder.Entity<SongPlaylist>(entity =>
            {
                entity.HasKey(sp => new { sp.SongId, sp.PlaylistId });
                entity
                    .HasOne(sa => sa.Song)
                    .WithMany()
                    .HasForeignKey(sa => sa.SongId);

                entity
                    .HasOne(sp => sp.Playlist)
                    .WithMany(p => p.SongPlaylists)
                    .HasForeignKey(sp => sp.PlaylistId);
            });

            modelBuilder.Entity<Rating>(entity => 
            {
                entity.HasKey(entity=> entity.Id);
                entity.Property(entity => entity.Value).IsRequired();
                entity.Property(entity => entity.UserId).IsRequired();
                entity.Property(entity => entity.SongId).IsRequired();
            });

            modelBuilder.Entity<PSMusic.Server.Models.Entities.Stream>(entity => 
            {
                entity.HasKey(entity => entity.Id);
                entity.Property(entity => entity.UserId).IsRequired();
                entity.Property(entity => entity.SongId).IsRequired();
            });

            modelBuilder.Entity<Favorite>(entity =>
            {
                entity.HasKey(f => new { f.UserId, f.SongId });
                entity.HasOne(e => e.User)
                    .WithMany(u => u.Favorites)
                    .HasForeignKey(f => f.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Song)
                    .WithMany()
                    .HasForeignKey(f => f.SongId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
