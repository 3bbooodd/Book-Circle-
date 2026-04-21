using System.Text.Json.Serialization;
using BookCircle.Api.Data;
using BookCircle.Api.Extensions;
using BookCircle.Api.Hubs;
using BookCircle.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddApplicationOptions(builder.Configuration)
    .AddApplicationDatabase(builder.Configuration)
    .AddApplicationIdentity()
    .AddApplicationAuthentication(builder.Configuration)
    .AddApplicationServices()
    .AddApplicationSwagger();

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");

await app.Services.InitializeDatabaseAsync();

app.Run();
