using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StopsController : ControllerBase
{
    private readonly IStopService _stopService;

    public StopsController(IStopService stopService)
    {
        _stopService = stopService;
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResponse<StopDto>>> GetStops([FromQuery] PaginationParams paginationParams)
    {
        var stops = await _stopService.GetAllStopsAsync(paginationParams);
        return Ok(stops);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StopDto>> GetStop(int id)
    {
        var stop = await _stopService.GetStopByIdAsync(id);
        if (stop == null)
            return NotFound();

        return Ok(stop);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<StopDto>> CreateStop(CreateStopDto createStopDto)
    {
        try
        {
            var stop = await _stopService.CreateStopAsync(createStopDto);
            return CreatedAtAction(nameof(GetStop), new { id = stop.Id }, stop);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<StopDto>> UpdateStop(int id, UpdateStopDto updateStopDto)
    {
        try
        {
            var stop = await _stopService.UpdateStopAsync(id, updateStopDto);
            if (stop == null)
                return NotFound();

            return Ok(stop);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStop(int id)
    {
        if (await _stopService.IsStopInUseAsync(id))
            return BadRequest("Cannot delete stop that is used by journeys");

        var result = await _stopService.DeleteStopAsync(id);
        if (!result)
            return NotFound();

        return NoContent();
    }
} 