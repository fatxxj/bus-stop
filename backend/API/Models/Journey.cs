using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class Journey
{
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string Description { get; set; } = string.Empty;

    public ICollection<JourneyStop> JourneyStops { get; set; } = new List<JourneyStop>();
} 