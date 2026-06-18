Write-Host "--- CineVerse API Verification Script ---" -ForegroundColor Cyan

$baseUrl = "http://localhost:8080/api"

# Helper for JSON requests
function Invoke-PostJson {
    param($url, $body)
    try {
        $json = $body | ConvertTo-Json -Depth 5
        $res = Invoke-RestMethod -Uri $url -Method Post -Body $json -ContentType "application/json"
        return $res
    } catch {
        Write-Host "Request to $url failed!" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        if ($_.ErrorDetails) {
            Write-Host $_.ErrorDetails.Message -ForegroundColor Red
        }
        return $null
    }
}

# Helper for GET requests with Auth header
function Invoke-GetAuth {
    param($url, $token)
    $headers = @{}
    if ($token) {
        $headers.Add("Authorization", "Bearer $token")
    }
    try {
        $res = Invoke-RestMethod -Uri $url -Method Get -Headers $headers -ContentType "application/json"
        return $res.message
    } catch {
        # Catch forbidden (403) or unauthorized (401)
        return "ERROR: " + $_.Exception.Response.StatusCode.Value__ + " " + $_.Exception.Message
    }
}

Write-Host "1. Registering USER role user (testuser@example.com)..."
$regUserBody = @{
    name = "Regular User"
    email = "testuser@example.com"
    password = "password123"
    role = "USER"
}
$userRegRes = Invoke-PostJson "$baseUrl/auth/register" $regUserBody

if ($userRegRes) {
    Write-Host "USER Registered Successfully! Token acquired." -ForegroundColor Green
    $userToken = $userRegRes.token
} else {
    Write-Host "USER Registration failed or user already exists. Attempting Login..." -ForegroundColor Yellow
    $loginBody = @{
        email = "testuser@example.com"
        password = "password123"
    }
    $loginRes = Invoke-PostJson "$baseUrl/auth/login" $loginBody
    if ($loginRes) {
        $userToken = $loginRes.token
        Write-Host "USER Login Successful! Token acquired." -ForegroundColor Green
    } else {
        Write-Host "USER Login failed!" -ForegroundColor Red
    }
}

Write-Host "`n2. Logging in as pre-seeded, approved THEATRE_OWNER (elante@gmail.com)..."
$loginBody = @{
    email = "elante@gmail.com"
    password = "elante"
}
$loginRes = Invoke-PostJson "$baseUrl/auth/login" $loginBody
if ($loginRes) {
    $ownerToken = $loginRes.token
    Write-Host "OWNER Login Successful! Token acquired." -ForegroundColor Green
} else {
    Write-Host "OWNER Login failed!" -ForegroundColor Red
}

Write-Host "`n--- Testing Role-Based Access Control (RBAC) ---" -ForegroundColor Cyan

Write-Host "`nTest 1: Accessing Book Ticket (/tickets/book) as USER..."
$res1 = Invoke-GetAuth "$baseUrl/tickets/book" $userToken
Write-Host "Result: $res1"

Write-Host "`nTest 2: Accessing Manage Shows (/shows/manage) as USER..."
$res2 = Invoke-GetAuth "$baseUrl/shows/manage" $userToken
Write-Host "Result: $res2"

Write-Host "`nTest 3: Accessing Manage Shows (/shows/manage) as OWNER..."
$res3 = Invoke-GetAuth "$baseUrl/shows/manage" $ownerToken
Write-Host "Result: $res3"

Write-Host "`nTest 4: Accessing Manage Users (/users/manage) as OWNER..."
$res4 = Invoke-GetAuth "$baseUrl/users/manage" $ownerToken
Write-Host "Result: $res4"

Write-Host "`nVerification complete!" -ForegroundColor Cyan
