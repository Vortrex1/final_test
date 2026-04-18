# HotelBooking Command Reference

## Restore and build

```powershell
# Restore packages from the local NuGet cache.
$env:DOTNET_CLI_HOME="$PWD\.dotnet"
$env:DOTNET_SKIP_FIRST_TIME_EXPERIENCE="1"
$env:DOTNET_NOLOGO="1"
$env:NUGET_PACKAGES="C:\Users\Andriy\.nuget\packages"
dotnet restore HotelBooking.Tests/HotelBooking.Tests.csproj --ignore-failed-sources

# Build the solution.
dotnet build HotelBooking/HotelBooking.slnx --no-restore
```

## PostgreSQL for local runs

```powershell
# Start PostgreSQL in Docker for the API.
docker rm -f hotelbooking-postgres
docker run -d `
  --name hotelbooking-postgres `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres_password `
  -e POSTGRES_DB=HotelBookingDb `
  -p 5432:5432 `
  postgres:16-alpine

# Verify the container is up.
docker ps --filter "name=hotelbooking-postgres"
```

## Run the API

```powershell
# Run the API with the default connection string from appsettings.json.
dotnet run --project HotelBooking --urls "http://localhost:5000"
```

## Automated tests

```powershell
# Run the whole test project.
dotnet test HotelBooking.Tests/HotelBooking.Tests.csproj --no-build --logger "console;verbosity=normal"

# Run only unit tests.
dotnet test HotelBooking.Tests/HotelBooking.Tests.csproj --no-build --filter "FullyQualifiedName~HotelBooking.Tests.Unit|FullyQualifiedName~HotelBooking.Tests.UnitTest1"

# Run only integration tests.
dotnet test HotelBooking.Tests/HotelBooking.Tests.csproj --no-build --filter "FullyQualifiedName~HotelBooking.Tests.Integration"

# Run only database tests.
dotnet test HotelBooking.Tests/HotelBooking.Tests.csproj --no-build --filter "FullyQualifiedName~HotelBooking.Tests.Database"

# Run a specific test class.
dotnet test HotelBooking.Tests/HotelBooking.Tests.csproj --no-build --filter "FullyQualifiedName~HotelBooking.Tests.Unit.ReservationServiceTests"

# Run a specific test method.
dotnet test HotelBooking.Tests/HotelBooking.Tests.csproj --no-build --filter "FullyQualifiedName~HotelBooking.Tests.Integration.BookingIntegrationTests.FullBookingFlow_WorksCorrectly"
```

## k6 performance tests

```powershell
# The API must already be running on http://localhost:5000.
k6 run --env BASE_URL=http://localhost:5000 HotelBooking.Tests/Performance/smoke.js
k6 run --env BASE_URL=http://localhost:5000 HotelBooking.Tests/Performance/load.js
k6 run --env BASE_URL=http://localhost:5000 HotelBooking.Tests/Performance/stress.js
```

## Useful Docker cleanup

```powershell
# Stop and remove the local PostgreSQL container.
docker rm -f hotelbooking-postgres
```

## Notes

```text
- This test project does not use xUnit Category traits, so Category=Unit/Integration/Database filters are not valid here.
- Database tests use Testcontainers, so Docker Desktop must be running.
- Integration tests use EF Core InMemory and no longer require a real PostgreSQL instance.
```
