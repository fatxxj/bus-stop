using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public static class DbSeeder
{
    public static async Task SeedData(ApplicationDbContext context, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        // Seed admin user and role
        if (!await roleManager.RoleExistsAsync("Admin"))
        {
            await roleManager.CreateAsync(new IdentityRole("Admin"));
        }

        var adminEmail = "tester@filippo.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                FirstName = "Filippo",
                LastName = "Tester",
                CreatedAt = DateTime.UtcNow
            };

            var result = await userManager.CreateAsync(adminUser, "FilippoTUG1!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }

        if (await context.Stops.AnyAsync())
        {
            return; // Database has already been seeded
        }

        // Create stops
        var milanStop = new Stop
        {
            Code = "MIL",
            Description = "Milan Central Station",
            CityName = "Milan",
            X = 45.4642,
            Y = 9.1900
        };

        var romeStop = new Stop
        {
            Code = "ROM",
            Description = "Rome Termini Station",
            CityName = "Rome",
            X = 41.9028,
            Y = 12.4964
        };

        var florenceStop = new Stop
        {
            Code = "FLR",
            Description = "Florence Santa Maria Novella Station",
            CityName = "Florence",
            X = 43.7696,
            Y = 11.2558
        };

        var veniceStop = new Stop
        {
            Code = "VCE",
            Description = "Venice Santa Lucia Station",
            CityName = "Venice",
            X = 45.4371,
            Y = 12.3326
        };

        var naplesStop = new Stop
        {
            Code = "NAP",
            Description = "Naples Central Station",
            CityName = "Naples",
            X = 40.8518,
            Y = 14.2681
        };

        var turinStop = new Stop
        {
            Code = "TRN",
            Description = "Turin Porta Nuova Station",
            CityName = "Turin",
            X = 45.0703,
            Y = 7.6869
        };

        var bolognaStop = new Stop
        {
            Code = "BLQ",
            Description = "Bologna Central Station",
            CityName = "Bologna",
            X = 44.4949,
            Y = 11.3426
        };

        await context.Stops.AddRangeAsync(
            milanStop,
            romeStop,
            florenceStop,
            veniceStop,
            naplesStop,
            turinStop,
            bolognaStop
        );
        await context.SaveChangesAsync();

        // Create Milano to Rome journey
        var milanToRomeJourney = new Journey
        {
            Code = "MIL-ROM",
            Description = "Milan to Rome Express"
        };

        var milanToRomeStops = new List<JourneyStop>
        {
            new JourneyStop
            {
                Journey = milanToRomeJourney,
                Stop = milanStop,
                Order = 1,
                PassingTime = new TimeSpan(8, 0, 0) // 8:00 AM
            },
            new JourneyStop
            {
                Journey = milanToRomeJourney,
                Stop = romeStop,
                Order = 2,
                PassingTime = new TimeSpan(12, 30, 0) // 12:30 PM
            }
        };

        // Create Florence to Venice journey
        var florenceToVeniceJourney = new Journey
        {
            Code = "FLR-VCE",
            Description = "Florence to Venice Express"
        };

        var florenceToVeniceStops = new List<JourneyStop>
        {
            new JourneyStop
            {
                Journey = florenceToVeniceJourney,
                Stop = florenceStop,
                Order = 1,
                PassingTime = new TimeSpan(9, 15, 0) // 9:15 AM
            },
            new JourneyStop
            {
                Journey = florenceToVeniceJourney,
                Stop = veniceStop,
                Order = 2,
                PassingTime = new TimeSpan(11, 45, 0) // 11:45 AM
            }
        };

        await context.Journeys.AddRangeAsync(milanToRomeJourney, florenceToVeniceJourney);
        await context.JourneyStops.AddRangeAsync(milanToRomeStops);
        await context.JourneyStops.AddRangeAsync(florenceToVeniceStops);
        await context.SaveChangesAsync();
    }
} 