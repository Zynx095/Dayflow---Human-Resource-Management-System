$skillsPath = "e:\HACKATHON\.agents\skills"
$agentsPath = "e:\HACKATHON\.agents\agents"
$workflowsPath = "e:\HACKATHON\.agents\workflows"

$errors = 0

Write-Host "Validating Skills..."
$skillDirs = Get-ChildItem -Directory $skillsPath
$skillNames = @()
foreach ($dir in $skillDirs) {
    $skillNames += $dir.Name
    $filePath = Join-Path $dir.FullName "SKILL.md"
    if (!(Test-Path $filePath)) {
        Write-Host "ERROR: Missing SKILL.md in $($dir.Name)"
        $errors++
        continue
    }
    
    $content = Get-Content $filePath -Raw
    if ($content -notmatch '---[\s\S]*?name:[\s\S]*?description:[\s\S]*?---') {
        Write-Host "ERROR: Missing/Invalid YAML frontmatter in $($dir.Name)/SKILL.md"
        $errors++
    }
    
    $requiredSections = @("## Purpose", "## Activation Triggers", "## Inputs", "## Required Context", "## Responsibilities", "## Operating Procedure", "## Decision Rules", "## Tool Usage Guidance", "## Expected Outputs", "## Quality Gates", "## Failure Handling", "## Completion Criteria", "## Prohibited Behavior")
    
    foreach ($section in $requiredSections) {
        if ($content -notmatch $section) {
            Write-Host "ERROR: Missing section '$section' in $($dir.Name)/SKILL.md"
            $errors++
        }
    }
}

Write-Host "`nValidating Agents..."
$agentDirs = Get-ChildItem -Directory $agentsPath
$agentNames = @()
foreach ($dir in $agentDirs) {
    $agentNames += $dir.Name
    $filePath = Join-Path $dir.FullName "agent.md"
    if (!(Test-Path $filePath)) {
        Write-Host "ERROR: Missing agent.md in $($dir.Name)"
        $errors++
        continue
    }
    
    $content = Get-Content $filePath -Raw
    if ($content -notmatch '---[\s\S]*?name:[\s\S]*?description:[\s\S]*?---') {
        Write-Host "ERROR: Missing/Invalid YAML frontmatter in $($dir.Name)/agent.md"
        $errors++
    }
    
    $requiredAgentSections = @("## Role", "## Mission", "## Skills Used", "## Allowed Responsibilities", "## Process", "## Quality Standards", "## Handoff Conditions", "## When to Stop and Request Human Approval")
    foreach ($section in $requiredAgentSections) {
        if ($content -notmatch $section) {
            Write-Host "ERROR: Missing section '$section' in $($dir.Name)/agent.md"
            $errors++
        }
    }

    # Extract Skills Used
    if ($content -match '## Skills Used([\s\S]*?)## Allowed Responsibilities') {
        $skillsUsedSection = $Matches[1]
        $skillsUsed = [regex]::Matches($skillsUsedSection, "- (\S+)") | ForEach-Object { $_.Groups[1].Value }
        
        foreach ($skill in $skillsUsed) {
            if ($skill -eq "ALL") { continue }
            if ($skill -eq $dir.Name) {
                Write-Host "ERROR: Recursive skill reference in agent $($dir.Name): $skill"
                $errors++
            }
            if ($skillNames -notcontains $skill) {
                Write-Host "ERROR: Agent $($dir.Name) references nonexistent skill: $skill"
                $errors++
            }
        }
    }
}

Write-Host "`nValidating Workflows..."
$workflowFiles = Get-ChildItem -Path $workflowsPath -Filter "*.md"
$requiredWorkflowFields = @("OWNER:", "INPUTS:", "PREREQUISITES:", "OUTPUTS:", "HANDOFF:", "HUMAN GATE:", "TIME BUDGET:", "STOP CONDITIONS:")

foreach ($file in $workflowFiles) {
    $content = Get-Content $file.FullName -Raw
    
    foreach ($field in $requiredWorkflowFields) {
        if ($content -notmatch $field) {
            Write-Host "ERROR: Missing field '$field' in workflow $($file.Name)"
            $errors++
        }
    }

    if ($content -match '\*\*OWNER:\*\* `(.+?)`') {
        $owner = $Matches[1]
        if ($agentNames -notcontains $owner -and $owner -ne 'human') {
            Write-Host "ERROR: Workflow $($file.Name) declares nonexistent owner agent: $owner"
            $errors++
        }
    }
}

Write-Host "`nChecking for Secrets (broad scan)..."
$allFiles = Get-ChildItem -Path "e:\HACKATHON\.agents" -Recurse -File
foreach ($file in $allFiles) {
    $content = Get-Content $file.FullName
    $regex = '(?i)(password|api[_-]?key|token|secret|bearer|aws_access_key_id|client_secret)\s*[=:]\s*["' + "'" + ']?\w+["' + "'" + ']?'
    if ($content -match $regex) {
        Write-Host "WARNING: Possible secret pattern found in $($file.FullName)"
    }
}

if ($errors -eq 0) {
    Write-Host "`nValidation Passed! 0 errors found."
} else {
    Write-Host "`nValidation Failed! $errors errors found."
    exit 1
}
