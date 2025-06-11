using API.DTOs;

namespace API.Services;

public interface IJourneyService
{
    Task<PaginatedResponse<JourneyDto>> GetAllJourneysAsync(PaginationParams paginationParams);
    Task<JourneyDto?> GetJourneyByIdAsync(int id);
    Task<JourneyDto> CreateJourneyAsync(CreateJourneyDto createJourneyDto);
    Task<JourneyDto?> UpdateJourneyAsync(int id, UpdateJourneyDto updateJourneyDto);
    Task<bool> DeleteJourneyAsync(int id);
    Task<bool> ValidateJourneyStopsAsync(List<CreateJourneyStopDto> stops);
} 