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

    public async Task<PaginatedResponse<JourneyDto>> GetAllJourneysAsync(PaginationParams paginationParams)
    {
        var query = _context.Journeys
            .Include(j => j.JourneyStops)
                .ThenInclude(js => js.Stop);

        var totalCount = await query.CountAsync();

        var journeys = await query
            .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
            .Take(paginationParams.PageSize)
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
                        Code = js.Stop.Code,
                        Description = js.Stop.Description,
                        X = js.Stop.X,
                        Y = js.Stop.Y,
                        Order = js.Order,
                        PassingTime = js.PassingTime,
                        CityName = js.Stop.CityName
                    })
                    .ToList()
            })
            .ToListAsync();

        return new PaginatedResponse<JourneyDto>
        {
            Items = journeys,
            TotalCount = totalCount,
            PageNumber = paginationParams.PageNumber,
            PageSize = paginationParams.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)paginationParams.PageSize)
        };
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
                    Code = js.Stop.Code,
                    Description = js.Stop.Description,
                    X = js.Stop.X,
                    Y = js.Stop.Y,
                    Order = js.Order,
                    PassingTime = js.PassingTime,
                    CityName = js.Stop.CityName
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

        _context.JourneyStops.RemoveRange(journey.JourneyStops);

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

        var stopIds = stops.Select(s => s.StopId).ToList();
        var existingStops = await _context.Stops
            .Where(s => stopIds.Contains(s.Id))
            .Select(s => s.Id)
            .ToListAsync();

        if (existingStops.Count != stopIds.Count) return false;

        var orders = stops.Select(s => s.Order).ToList();
        if (orders.Distinct().Count() != orders.Count) return false;

        var minOrder = orders.Min();
        var maxOrder = orders.Max();
        if (maxOrder - minOrder + 1 != orders.Count) return false;

        var orderedStops = stops.OrderBy(s => s.Order).ToList();
        for (int i = 1; i < orderedStops.Count; i++)
        {
            if (orderedStops[i].PassingTime <= orderedStops[i - 1].PassingTime)
                return false;
        }

        return true;
    }
} 