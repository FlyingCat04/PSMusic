FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["PSMusic.Server.csproj", "./"]
RUN dotnet restore "PSMusic.Server.csproj"

COPY . .

RUN dotnet build "PSMusic.Server.csproj" -c Release -o /app/build

RUN dotnet publish "PSMusic.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 7215

ENV ASPNETCORE_URLS=http://+:7215
ENV ASPNETCORE_ENVIRONMENT=Production

ENTRYPOINT ["dotnet", "PSMusic.Server.dll"]