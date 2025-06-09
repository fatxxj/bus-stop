using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Journey> Journeys { get; set; }
    public DbSet<Stop> Stops { get; set; }
    public DbSet<JourneyStop> JourneyStops { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<JourneyStop>()
            .HasOne(js => js.Journey)
            .WithMany(j => j.JourneyStops)
            .HasForeignKey(js => js.JourneyId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<JourneyStop>()
            .HasOne(js => js.Stop)
            .WithMany(s => s.JourneyStops)
            .HasForeignKey(js => js.StopId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Journey>()
            .HasIndex(j => j.Code)
            .IsUnique();

        modelBuilder.Entity<Stop>()
            .HasIndex(s => s.Code)
            .IsUnique();
    }
} 