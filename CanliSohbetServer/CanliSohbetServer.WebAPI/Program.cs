using CanliSohbetServer.WebAPI.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(configure =>
{
    configure.AddDefaultPolicy(policy =>
    {
        policy
        .AllowAnyHeader()//Origin:application/json // Authorization:assd bu þekilde header'lara izin veriyor. 
        .AllowAnyMethod()//GET POST PUT
        .AllowCredentials()//WebSocket
        .SetIsOriginAllowed(policy => true);//
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.MapHub<SohbetHub>("sohbet-hub");

app.Run();
