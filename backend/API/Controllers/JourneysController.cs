using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JourneysController : ControllerBase
{
    private readonly IJourneyService _journeyService;

    public JourneysController(IJourneyService journeyService)
    {
        _journeyService = journeyService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<JourneyDto>>> GetJourneys()
    {
        var journeys = await _journeyService.GetAllJourneysAsync();
        return Ok(journeys);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<JourneyDto>> GetJourney(int id)
    {
        var journey = await _journeyService.GetJourneyByIdAsync(id);
        if (journey == null)
            return NotFound();

        return Ok(journey);
    }

    [HttpPost]
    public async Task<ActionResult<JourneyDto>> CreateJourney(CreateJourneyDto createJourneyDto)
    {
        try
        {
            var journey = await _journeyService.CreateJourneyAsync(createJourneyDto);
            return CreatedAtAction(nameof(GetJourney), new { id = journey.Id }, journey);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<JourneyDto>> UpdateJourney(int id, UpdateJourneyDto updateJourneyDto)
    {
        try
        {
            var journey = await _journeyService.UpdateJourneyAsync(id, updateJourneyDto);
            if (journey == null)
                return NotFound();

            return Ok(journey);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteJourney(int id)
    {
        var result = await _journeyService.DeleteJourneyAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }
} 