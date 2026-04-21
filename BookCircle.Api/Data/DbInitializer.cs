using BookCircle.Api.Constants;
using BookCircle.Api.Models.Enums;
using BookCircle.Api.Options;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BookCircle.Api.Data;

public static class DbInitializer
{
    public static async Task InitializeDatabaseAsync(this IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var serviceProvider = scope.ServiceProvider;
        var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
        var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var adminOptions = serviceProvider.GetRequiredService<IOptions<AdminSeedOptions>>().Value;

        await context.Database.MigrateAsync();

        foreach (var role in ApplicationRoles.All)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            }
        }

        var adminUser = await userManager.Users.FirstOrDefaultAsync(x => x.Email == adminOptions.Email);
        if (adminUser is not null)
        {
            return;
        }

        adminUser = new ApplicationUser
        {
            FullName = adminOptions.FullName,
            Email = adminOptions.Email,
            UserName = adminOptions.UserName,
            ApprovalStatus = UserApprovalStatus.Approved,
            EmailConfirmed = true,
            IsActive = true
        };

        var result = await userManager.CreateAsync(adminUser, adminOptions.Password);
        if (!result.Succeeded)
        {
            var message = string.Join("; ", result.Errors.Select(x => x.Description));
            throw new InvalidOperationException($"Failed to create seeded admin user: {message}");
        }

        await userManager.AddToRoleAsync(adminUser, ApplicationRoles.Admin);
    }
}
