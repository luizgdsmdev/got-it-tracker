using AutoMapper;
using backend_csharp.Application.Interfaces.Auth;
using backend_csharp.Application.Interfaces.PlayGround;
using backend_csharp.Application.Interfaces.Users;
using backend_csharp.Application.Services.Auth;
using backend_csharp.Application.Services.PlayGround;
using backend_csharp.Application.Services.Users;
using backend_csharp.Domain.Entities.Users;
using backend_csharp.Infrastructure.Data;
using backend_csharp.Infrastructure.Middleware;
using backend_csharp.Infrastructure.Persistence.Interfaces;
using backend_csharp.Infrastructure.Persistence.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpContextAccessor(); // Add HttpContextAccessor to access the current HTTP context in services, JWT retrieval mainly for the CurrentUserService


// Application Services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPlaygroundService, PlaygroundService>();
builder.Services.AddScoped<IPersonService, PersonService>();
builder.Services.AddScoped<IPlayGroundMemberService, PlayGroundMemberService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddAutoMapper(typeof(Program).Assembly);


// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPlaygroundRepository, PlaygroundRepository>();
builder.Services.AddScoped<IPersonRepository, PersonRepository>();
builder.Services.AddScoped<IPlaygroundMemberRepository, PlaygroundMemberRepository>();

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source=expense_tracker.db"));


// Add authentication and authorization services using JWT Bearer tokens.
// This allows the application to authenticate and authorize users based on JWT tokens.
builder.Services.AddAuthorization();
//builder.Services.AddAuthentication("Bearer").AddJwtBearer();


// Add Identity services for user management, including user and role management,
// using the ApplicationDbContext for data storage such as user credentials, roles, and claims.
// This enables features like user registration, login, and role-based access control.
builder.Services.AddIdentity<User, IdentityRole<Guid>>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();


// Retrieve the JWT secret key from the configuration settings. The application cannot proceed without it.
var secretKey = builder.Configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT secret key is not configured.");

// Configure JWT authentication settings, including the secret key, issuer, and audience.
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{

    options.SaveToken = true;
    options.RequireHttpsMetadata = true;

    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.Zero,
        ValidIssuer = builder.Configuration["Jwt:ValidIssuer"],
        ValidAudience = builder.Configuration["Jwt:ValidAudience"],
        IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(secretKey))
    };
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}


app.UseMiddleware<ExceptionMiddleware>();
app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
