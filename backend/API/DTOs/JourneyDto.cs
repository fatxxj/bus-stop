namespace API.DTOs;

public class JourneyDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<JourneyStopDto> Stops { get; set; } = new();
}

public class JourneyStopDto
{
    public int StopId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double X { get; set; }
    public double Y { get; set; }
    public int Order { get; set; }
    public TimeSpan PassingTime { get; set; }
}

public class CreateJourneyDto
{
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<CreateJourneyStopDto> Stops { get; set; } = new();
}

public class CreateJourneyStopDto
{
    public int StopId { get; set; }
    public int Order { get; set; }
    public TimeSpan PassingTime { get; set; }
}

public class UpdateJourneyDto
{
    public string Description { get; set; } = string.Empty;
    public List<CreateJourneyStopDto> Stops { get; set; } = new();
} 