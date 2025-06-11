using API.DTOs;
using API.Models;

namespace API.Services;

public interface IStopService
{
    Task<PaginatedResponse<StopDto>> GetAllStopsAsync(PaginationParams paginationParams);
    Task<StopDto?> GetStopByIdAsync(int id);
    Task<StopDto> CreateStopAsync(CreateStopDto createStopDto);
    Task<StopDto?> UpdateStopAsync(int id, UpdateStopDto updateStopDto);
    Task<bool> DeleteStopAsync(int id);
    Task<bool> IsStopInUseAsync(int id);
} 