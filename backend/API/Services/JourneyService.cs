using API.Data;
using API.DTOs;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class JourneyService : IJourneyService
{
    private readonly ApplicationDbContext _context;

    public JourneyService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<JourneyDto>> GetAllJourneysAsync()
    {
        return await _context.Journeys
            .Include(j => j.JourneyStops)
                .ThenInclude(js => js.Stop)
            .Select(j => new JourneyDto
            {
                Id = j.Id,
                Code = j.Code,
                Description = j.Description,
                Stops = j.JourneyStops
                    .OrderBy(js => js.Order)
                    .Select(js => new JourneyStopDto
                    {
                        StopId = js.StopId,
                        StopCode = js.Stop.Code,
                        StopDescription = js.Stop.Description,
                        X = js.Stop.X,
                        Y = js.Stop.Y,
                        Order = js.Order,
                        PassingTime = js.PassingTime
                    })
                    .ToList()
            })
            .ToListAsync();
    }

    public async Task<JourneyDto?> GetJourneyByIdAsync(int id)
    {
        var journey = await _context.Journeys
            .Include(j => j.JourneyStops)
                .ThenInclude(js => js.Stop)
            .FirstOrDefaultAsync(j => j.Id == id);

        if (journey == null) return null;

        return new JourneyDto
        {
            Id = journey.Id,
            Code = journey.Code,
            Description = journey.Description,
            Stops = journey.JourneyStops
                .OrderBy(js => js.Order)
                .Select(js => new JourneyStopDto
                {
                    StopId = js.StopId,
                    StopCode = js.Stop.Code,
                    StopDescription = js.Stop.Description,
                    X = js.Stop.X,
                    Y = js.Stop.Y,
                    Order = js.Order,
                    PassingTime = js.PassingTime
                })
                .ToList()
        };
    }

    public async Task<JourneyDto> CreateJourneyAsync(CreateJourneyDto createJourneyDto)
    {
        if (!await ValidateJourneyStopsAsync(createJourneyDto.Stops))
            throw new InvalidOperationException("Invalid journey stops sequence");

        var journey = new Journey
        {
            Code = createJourneyDto.Code,
            Description = createJourneyDto.Description,
            JourneyStops = createJourneyDto.Stops
                .Select(s => new JourneyStop
                {
                    StopId = s.StopId,
                    Order = s.Order,
                    PassingTime = s.PassingTime
                })
                .ToList()
        };

        _context.Journeys.Add(journey);
        await _context.SaveChangesAsync();

        return await GetJourneyByIdAsync(journey.Id) ?? throw new InvalidOperationException("Failed to create journey");
    }

    public async Task<JourneyDto?> UpdateJourneyAsync(int id, UpdateJourneyDto updateJourneyDto)
    {
        var journey = await _context.Journeys
            .Include(j => j.JourneyStops)
            .FirstOrDefaultAsync(j => j.Id == id);

        if (journey == null) return null;

        if (!await ValidateJourneyStopsAsync(updateJourneyDto.Stops))
            throw new InvalidOperationException("Invalid journey stops sequence");

        journey.Description = updateJourneyDto.Description;

        // Remove existing stops
        _context.JourneyStops.RemoveRange(journey.JourneyStops);

        // Add new stops
        journey.JourneyStops = updateJourneyDto.Stops
            .Select(s => new JourneyStop
            {
                StopId = s.StopId,
                Order = s.Order,
                PassingTime = s.PassingTime
            })
            .ToList();

        await _context.SaveChangesAsync();

        return await GetJourneyByIdAsync(journey.Id);
    }

    public async Task<bool> DeleteJourneyAsync(int id)
    {
        var journey = await _context.Journeys.FindAsync(id);
        if (journey == null) return false;

        _context.Journeys.Remove(journey);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ValidateJourneyStopsAsync(List<CreateJourneyStopDto> stops)
    {
        if (!stops.Any()) return false;

        // Check if all stops exist
        var stopIds = stops.Select(s => s.StopId).ToList();
        var existingStops = await _context.Stops
            .Where(s => stopIds.Contains(s.Id))
            .Select(s => s.Id)
            .ToListAsync();

        if (existingStops.Count != stopIds.Count) return false;

        // Check if orders are sequential and unique
        var orders = stops.Select(s => s.Order).ToList();
        if (orders.Distinct().Count() != orders.Count) return false;

        var minOrder = orders.Min();
        var maxOrder = orders.Max();
        if (maxOrder - minOrder + 1 != orders.Count) return false;

        // Check if passing times are in order
        var orderedStops = stops.OrderBy(s => s.Order).ToList();
        for (int i = 1; i < orderedStops.Count; i++)
        {
            if (orderedStops[i].PassingTime <= orderedStops[i - 1].PassingTime)
                return false;
        }

        return true;
    }
} 