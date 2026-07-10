using backend_csharp.Application.Interfaces;
using backend_csharp.Application.Services;
using backend_csharp.Infrastructure.Data;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using backend_csharp.Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using AutoMapper;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source=expense_tracker.db"));


// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<IPlaygroundRepository, PlaygroundRepository>();
builder.Services.AddScoped<IPlaygroundService, PlaygroundService>();
builder.Services.AddScoped<IPlaygroundMemberRepository, PlaygroundMemberRepository>();

builder.Services.AddAutoMapper(typeof(Program).Assembly);

// Services
builder.Services.AddScoped<IUserService, UserService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}



app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
