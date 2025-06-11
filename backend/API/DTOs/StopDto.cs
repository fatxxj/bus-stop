namespace API.DTOs;

public class StopDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double X { get; set; }
    public double Y { get; set; }
    public string CityName { get; set; } = string.Empty;
    public int Connections { get; set; }
}

public class CreateStopDto
{
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double X { get; set; }
    public double Y { get; set; }
    public string CityName { get; set; } = string.Empty;
}

public class UpdateStopDto
{
    public string Description { get; set; } = string.Empty;
    public double X { get; set; }
    public double Y { get; set; }
    public string CityName { get; set; } = string.Empty;
} 