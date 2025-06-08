using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models;

public class JourneyStop
{
    public int Id { get; set; }

    public int JourneyId { get; set; }
    public Journey Journey { get; set; } = null!;

    public int StopId { get; set; }
    public Stop Stop { get; set; } = null!;

    [Required]
    public int Order { get; set; }

    [Required]
    public TimeSpan PassingTime { get; set; }
} 