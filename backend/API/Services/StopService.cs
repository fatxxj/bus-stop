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

    public async Task<PaginatedResponse<StopDto>> GetAllStopsAsync(PaginationParams paginationParams)
    {
        var query = _context.Stops.AsQueryable();
        var totalCount = await query.CountAsync();

        var stops = await query
            .Skip((paginationParams.PageNumber - 1) * paginationParams.PageSize)
            .Take(paginationParams.PageSize)
            .Select(s => new StopDto
            {
                Id = s.Id,
                Code = s.Code,
                Description = s.Description,
                X = s.X,
                Y = s.Y,
                CityName = s.CityName,
                Connections = s.JourneyStops.Count
            })
            .ToListAsync();

        return new PaginatedResponse<StopDto>
        {
            Items = stops,
            TotalCount = totalCount,
            PageNumber = paginationParams.PageNumber,
            PageSize = paginationParams.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)paginationParams.PageSize)
        };
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
        stop.Code = updateStopDto.Code;
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