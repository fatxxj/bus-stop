using API.Data;
using API.DTOs;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class StopService : IStopService
{
    private readonly ApplicationDbContext _context;

    public StopService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<StopDto>> GetAllStopsAsync()
    {
        return await _context.Stops
            .Select(s => new StopDto
            {
                Id = s.Id,
                Code = s.Code,
                Description = s.Description,
                X = s.X,
                Y = s.Y,
                CityName = s.CityName
            })
            .ToListAsync();
    }

    public async Task<StopDto?> GetStopByIdAsync(int id)
    {
        var stop = await _context.Stops.FindAsync(id);
        if (stop == null) return null;

        return new StopDto
        {
            Id = stop.Id,
            Code = stop.Code,
            Description = stop.Description,
            X = stop.X,
            Y = stop.Y,
            CityName = stop.CityName
        };
    }

    public async Task<StopDto> CreateStopAsync(CreateStopDto createStopDto)
    {
        var stop = new Stop
        {
            Code = createStopDto.Code,
            Description = createStopDto.Description,
            X = createStopDto.X,
            Y = createStopDto.Y,
            CityName = createStopDto.CityName
        };

        _context.Stops.Add(stop);
        await _context.SaveChangesAsync();

        return new StopDto
        {
            Id = stop.Id,
            Code = stop.Code,
            Description = stop.Description,
            X = stop.X,
            Y = stop.Y,
            CityName = stop.CityName
        };
    }

    public async Task<StopDto?> UpdateStopAsync(int id, UpdateStopDto updateStopDto)
    {
        var stop = await _context.Stops.FindAsync(id);
        if (stop == null) return null;

        stop.Description = updateStopDto.Description;
        stop.X = updateStopDto.X;
        stop.Y = updateStopDto.Y;
        stop.CityName = updateStopDto.CityName;
        await _context.SaveChangesAsync();

        return new StopDto
        {
            Id = stop.Id,
            Code = stop.Code,
            Description = stop.Description,
            X = stop.X,
            Y = stop.Y,
            CityName = stop.CityName
        };
    }

    public async Task<bool> DeleteStopAsync(int id)
    {
        if (await IsStopInUseAsync(id))
            return false;

        var stop = await _context.Stops.FindAsync(id);
        if (stop == null) return false;

        _context.Stops.Remove(stop);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> IsStopInUseAsync(int id)
    {
        return await _context.JourneyStops.AnyAsync(js => js.StopId == id);
    }
} 