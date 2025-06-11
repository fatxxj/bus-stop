using System.ComponentModel.DataAnnotations;

namespace API.Models;

public class Stop
{
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Code { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string Description { get; set; } = string.Empty;

    [Required]
    public double X { get; set; }

    [Required]
    public double Y { get; set; }

    [Required]
    [StringLength(255)]
    public string CityName { get; set; } = string.Empty;

    public ICollection<JourneyStop> JourneyStops { get; set; } = new List<JourneyStop>();
} 