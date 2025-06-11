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
            X = 45.4642, // Milan coordinates
            Y = 9.1900
        };

        var romeStop = new Stop
        {
            Code = "ROM",
            Description = "Rome Termini Station",
            CityName = "Rome",
            X = 41.9028, // Rome coordinates
            Y = 12.4964
        };

        await context.Stops.AddRangeAsync(milanStop, romeStop);
        await context.SaveChangesAsync();

        // Create journeys
        var milanToRome = new Journey
        {
            Code = "MIL-ROM",
            Description = "Milan to Rome Express"
        };

        var romeToMilan = new Journey
        {
            Code = "ROM-MIL",
            Description = "Rome to Milan Express"
        };

        await context.Journeys.AddRangeAsync(milanToRome, romeToMilan);
        await context.SaveChangesAsync();

        // Create journey stops
        var milanToRomeStops = new List<JourneyStop>
        {
            new JourneyStop
            {
                JourneyId = milanToRome.Id,
                StopId = milanStop.Id,
                Order = 1,
                PassingTime = new TimeSpan(8, 0, 0) // 8:00 AM
            },
            new JourneyStop
            {
                JourneyId = milanToRome.Id,
                StopId = romeStop.Id,
                Order = 2,
                PassingTime = new TimeSpan(12, 30, 0) // 12:30 PM
            }
        };

        var romeToMilanStops = new List<JourneyStop>
        {
            new JourneyStop
            {
                JourneyId = romeToMilan.Id,
                StopId = romeStop.Id,
                Order = 1,
                PassingTime = new TimeSpan(14, 0, 0) // 2:00 PM
            },
            new JourneyStop
            {
                JourneyId = romeToMilan.Id,
                StopId = milanStop.Id,
                Order = 2,
                PassingTime = new TimeSpan(18, 30, 0) // 6:30 PM
            }
        };

        await context.JourneyStops.AddRangeAsync(milanToRomeStops);
        await context.JourneyStops.AddRangeAsync(romeToMilanStops);
        await context.SaveChangesAsync();
    }
} 