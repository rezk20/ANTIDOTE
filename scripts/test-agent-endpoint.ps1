param (
    [Parameter(Mandatory = $false)]
    [string]$BaseUrl = "http://localhost:3000",

    [Parameter(Mandatory = $false)]
    [string]$ApiKey = ""
)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

# 1. Prompt for API Key if not provided
if ([string]::IsNullOrWhiteSpace($ApiKey)) {
    Write-Host "`n========================================================" -ForegroundColor Cyan
    Write-Host " Hermes AI Agent Endpoint Tester (PowerShell)" -ForegroundColor Yellow
    Write-Host "========================================================" -ForegroundColor Cyan
    $ApiKey = Read-Host "Enter your Agent API Key from /agent"
}

if ([string]::IsNullOrWhiteSpace($ApiKey)) {
    Write-Host "Error: API Key is required to test the endpoint." -ForegroundColor Red
    exit 1
}

$Endpoint = "$BaseUrl/api/agent/hermes"
$Headers = @{
    "Authorization" = "Bearer $ApiKey"
    "Content-Type"  = "application/json; charset=utf-8"
}

Write-Host "`nConnecting to endpoint: $Endpoint" -ForegroundColor Gray
Write-Host "--------------------------------------------------------" -ForegroundColor DarkGray

# ==============================================================================
# TEST 1: GET /api/agent/hermes (Live Context Inspection)
# ==============================================================================
Write-Host "`n[1/3] Testing GET /api/agent/hermes (Reading live context)..." -ForegroundColor Cyan

try {
    $getResponse = Invoke-RestMethod -Uri $Endpoint -Method Get -Headers $Headers -TimeoutSec 15
    if ($getResponse.ok -eq $true) {
        $userName = $getResponse.context.user.displayName
        $goalsCount = $getResponse.context.strategicGoals.Count
        $leadsCount = $getResponse.context.freelancePipeline.activeLeadsCount
        $paid = $getResponse.context.marriageMission.totalPaid
        $target = $getResponse.context.marriageMission.targetGoal
        $pct = $getResponse.context.marriageMission.progressPercent
        $tasksCount = $getResponse.context.today.activeTasks.Count

        Write-Host "SUCCESS: Live system context fetched successfully!" -ForegroundColor Green
        Write-Host "   - User: $userName" -ForegroundColor Yellow
        Write-Host "   - Strategic Goals: $goalsCount goals" -ForegroundColor Yellow
        Write-Host "   - Active Pipeline Deals: $leadsCount leads" -ForegroundColor Yellow
        Write-Host "   - Marriage Fund Progress: $pct % ($paid / $target EGP)" -ForegroundColor Yellow
        Write-Host "   - Today's Active Tasks: $tasksCount tasks" -ForegroundColor Yellow
    } else {
        $jsonStr = $getResponse | ConvertTo-Json -Depth 3
        Write-Host "Warning: Unexpected response: $jsonStr" -ForegroundColor Yellow
    }
} catch {
    Write-Host "GET request failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errBody = $reader.ReadToEnd()
        Write-Host "Details: $errBody" -ForegroundColor Red
    }
}

# ==============================================================================
# TEST 2: POST /api/agent/hermes (Add Idea to Brain Dump)
# ==============================================================================
Write-Host "`n[2/3] Testing POST (add_brain_dump)..." -ForegroundColor Cyan

$brainDumpObj = @{
    action   = "add_brain_dump"
    content  = "Micro-service idea: Discord community automation bot with Next.js dashboard."
    category = "business"
}
$brainDumpJson = $brainDumpObj | ConvertTo-Json -Depth 5
$bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($brainDumpJson)

try {
    $dumpResponse = Invoke-RestMethod -Uri $Endpoint -Method Post -Headers $Headers -Body $bodyBytes
    if ($dumpResponse.ok -eq $true) {
        $msg = $dumpResponse.result.message
        $content = $dumpResponse.result.item.content
        Write-Host "SUCCESS: Idea added to Brain Dump inbox!" -ForegroundColor Green
        Write-Host "   - Message: $msg" -ForegroundColor Yellow
        Write-Host "   - Item: $content" -ForegroundColor Gray
    }
} catch {
    Write-Host "POST add_brain_dump failed: $($_.Exception.Message)" -ForegroundColor Red
}

# ==============================================================================
# TEST 3: POST /api/agent/hermes (Autonomous Midnight Orchestrator - orchestrate_day)
# ==============================================================================
$TodayDate = (Get-Date).ToString("yyyy-MM-dd")
Write-Host "`n[3/3] Testing POST (orchestrate_day for date $TodayDate)..." -ForegroundColor Cyan

$task1 = @{
    title             = "Follow up with Upwork prospective client for Next.js SaaS demo"
    priority          = "critical"
    task_type         = "revenue"
    estimated_minutes = 45
    is_top_three      = $true
    description       = "Send 1-minute Loom video demonstrating the responsive layout."
}

$orchObj = @{
    action                 = "orchestrate_day"
    target_date            = $TodayDate
    available_hours        = 8
    energy                 = 4
    focus_question_answer  = "Ship SaaS Live Demo and submit 5 high-converting Upwork proposals."
    new_tasks              = @($task1)
    brain_dump_suggestions = @(
        "New package idea: Automated Discord subscription bot for gaming communities.",
        "Weekend outing idea: Sunset walk on the Mansoura Nile Tourist walkway."
    )
    executive_briefing     = "Calibrated 8 hours of focus via PowerShell script: 4h Deep Work and 2h Sales & Outreach."
}

$orchJson = $orchObj | ConvertTo-Json -Depth 6
$orchBytes = [System.Text.Encoding]::UTF8.GetBytes($orchJson)

try {
    $orchResponse = Invoke-RestMethod -Uri $Endpoint -Method Post -Headers $Headers -Body $orchBytes
    if ($orchResponse.ok -eq $true) {
        $msg = $orchResponse.result.message
        $focus = $orchResponse.result.results.dayPlan.focus_question_answer
        $createdCount = $orchResponse.result.results.createdTasks.Count
        $reportTitle = $orchResponse.result.results.report.title

        Write-Host "SUCCESS: 12:00 AM Midnight Orchestration executed successfully!" -ForegroundColor Green
        Write-Host "   - Message: $msg" -ForegroundColor Yellow
        Write-Host "   - Main Focus (The One Thing): $focus" -ForegroundColor Cyan
        Write-Host "   - Tasks Created: $createdCount" -ForegroundColor Gray
        Write-Host "   - AI Activity Report Saved: $reportTitle" -ForegroundColor Gray
    }
} catch {
    Write-Host "POST orchestrate_day failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================================" -ForegroundColor Cyan
Write-Host " All tests completed! Verify updates in your dashboard:" -ForegroundColor Green
Write-Host "   - Today Plan: $BaseUrl/today" -ForegroundColor Yellow
Write-Host "   - Brain Dump: $BaseUrl/brain-dump" -ForegroundColor Yellow
Write-Host "   - AI Activity Reports: $BaseUrl/agent" -ForegroundColor Yellow
Write-Host "========================================================`n" -ForegroundColor Cyan
