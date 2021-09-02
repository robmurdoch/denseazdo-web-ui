Function New-AzDoCollections {
    [CmdletBinding(SupportsShouldProcess)]
    param (
        [Parameter(Mandatory = $true,
            ParameterSetName = 'Default',
            HelpMessage = 'Enter a value that uniquely identifies an instance, use Azure DevOps Services for SaaS.',
            Position = 0)]
        [string]$InstanceName,
        
        [Parameter(Mandatory = $false,
            ParameterSetName = 'Default',
            HelpMessage = 'Enter a comma separated list of Collections names.',
            Position = 1)]
        [string[]]$Collections,
        
        [Parameter(Mandatory = $false,
            ParameterSetName = 'Default',
            HelpMessage = 'Enter the Url to the Azure DevOps instance, e.g. http://myserver/ or https://dev.azure.com.',
            Position = 3)]
        [string]$Instance
    )

    begin {

        $collectionGroups = @()
        $collectionGroups += [PSCustomObject]@{
            Id              = ""
            Name            = "BuildServiceAccounts"
            AzDoName        = "Project Collection Build Service Accounts"
            Description     = "Maps to AzDo Instance Build Service Accounts"
            AzDoDescription = "Should only contain BuildServiceAccounts"
        }
        $collectionGroups += [PSCustomObject]@{
            Id              = ""
            Name            = "ProxyServiceAccounts"
            AzDoName        = "Project Collection Proxy Service Accounts"
            Description     = "Maps to AzDo Instance Proxy Service Accounts"
            AzDoDescription = "Should only contain ProxyServiceAccounts"
        }
        $collectionGroups += [PSCustomObject]@{
            Id              = ""
            Name            = "TestServiceAccounts"
            AzDoName        = "Project Collection Test Service Accounts"
            Description     = "Maps to AzDo Instance Test Service Accounts"
            AzDoDescription = "Should only contain TestServiceAccounts"
        }
        $collectionGroups += [PSCustomObject]@{
            Id              = ""
            Name            = "Developers"
            AzDoName        = "Project Collection Developers"
            Description     = "Maps to AzDo Instance Developers"
            AzDoDescription = "Should only contain Developers"
        }
        $collectionGroups += [PSCustomObject]@{
            Id              = ""
            Name            = "ComplianceOfficers"
            AzDoName        = "Project Collection Compliance Officers"
            Description     = "Maps to AzDo Instance Compliance Officers"
            AzDoDescription = "Should only contain ComplianceOfficers"
        }
        $collectionGroups += [PSCustomObject]@{
            Id              = ""
            Name            = "Auditors"
            AzDoName        = "Project Collection Auditors"
            Description     = "Maps to AzDo Instance Auditors"
            AzDoDescription = "Should only contain Auditors"
        }
        $collectionGroups += [PSCustomObject]@{
            Id              = ""
            Name            = "DevOpsEngineers"
            AzDoName        = "Project Collection DevOps Engineers"
            Description     = "Maps to AzDo Instance DevOps Engineers"
            AzDoDescription = "Should only contain DevOpsEngineers"
        }
        $collectionGroups += [PSCustomObject]@{
            Id              = ""
            Name            = "Operators"
            AzDoName        = "Project Collection Operators"
            Description     = "Maps to AzDo Instance Operators"
            AzDoDescription = "Should only contain Operators"
        }
        $collectionGroups += [PSCustomObject]@{
            Id              = ""
            Name            = "Testers"
            AzDoName        = "Project Collection Testers"
            Description     = "Maps to AzDo Instance Testers"
            AzDoDescription = "Should only contain Testers"
        }
        $collectionGroups += [PSCustomObject]@{
            Id              = ""
            Name            = "Administrators"
            AzDoName        = "Project Collection Administrators"
            Description     = "Maps to AzDo Instance Administrators"
            AzDoDescription = "Should only contain Administrators"
        }

        $projectGroups = @()
        $projectGroups += [PSCustomObject]@{
            Id              = ""
            Name            = "Developers"
            AzDoName        = "Developers"
            Description     = "Maps to AzDo Project Developers"
            AzDoDescription = "Should only contain Developers"
        }
        $projectGroups += [PSCustomObject]@{
            Id              = ""
            Name            = "ComplianceOfficers"
            AzDoName        = "Compliance Officers"
            Description     = "Maps to AzDo Project Compliance Officers"
            AzDoDescription = "Should only contain ComplianceOfficers"
        }
        $projectGroups += [PSCustomObject]@{
            Id              = ""
            Name            = "Auditors"
            AzDoName        = "Auditors"
            Description     = "Maps to AzDo Project Auditors"
            AzDoDescription = "Should only contain Auditors"
        }
        $projectGroups += [PSCustomObject]@{
            Id              = ""
            Name            = "DevOpsEngineers"
            AzDoName        = "DevOps Engineers"
            Description     = "Maps to AzDo Project DevOps Engineers"
            AzDoDescription = "Should only contain DevOpsEngineers"
        }
        $projectGroups += [PSCustomObject]@{
            Id              = ""
            Name            = "Operators"
            AzDoName        = "Operators"
            Description     = "Maps to AzDo Project Operators"
            AzDoDescription = "Should only contain Operators"
        }
        $projectGroups += [PSCustomObject]@{
            Id              = ""
            Name            = "Testers"
            AzDoName        = "Testers"
            Description     = "Maps to AzDo Project Testers"
            AzDoDescription = "Should only contain Testers"
        }

        $users = @()
        $users += [PSCustomObject]@{
            Name        = "tinac"
            FullName    = "Tina Crumpet"
            Description = "British Hospitality Advisor"
        }
        $users += [PSCustomObject]@{
            Name        = "lucyl"
            FullName    = "Lucy Lastic"
            Description = "Plumber's Crack Apologist"
        }
        $users += [PSCustomObject]@{
            Name        = "mosesl"
            FullName    = "Moses Lonergan"
            Description = "Obsessive Yard Care Specialist"
        }
        $users += [PSCustomObject]@{
            Name        = "imeldac"
            FullName    = "Imelda Czechs"
            Description = "Accounts Payable Administrator"
        }
        $users += [PSCustomObject]@{
            Name        = "wilmab"
            FullName    = "Wilma Butfit"
            Description = "Airline Seat Tester"
        }
        $users += [PSCustomObject]@{
            Name        = "rushi"
            FullName    = "Rush Inuit"
            Description = "Alaskan Prenuptial Advisor"
        }
        $users += [PSCustomObject]@{
            Name        = "agent1"
            FullName    = "$InstanceName Agent 1"
            Description = "Azure DevOps service account"
        }
        $users += [PSCustomObject]@{
            Name        = "agent2"
            FullName    = "$InstanceName Agent 2"
            Description = "Azure DevOps service account"
        }
        $users += [PSCustomObject]@{
            Name        = "agent3"
            FullName    = "$InstanceName Agent 3"
            Description = "Azure DevOps service account"
        }
        $users += [PSCustomObject]@{
            Name        = "agent4"
            FullName    = "$InstanceName Agent 4"
            Description = "Azure DevOps service account"
        }

        $projects = @()
        $projects += [PSCustomObject]@{
            Id          = ""
            Name        = "HR"
            Description = "Project that typically can use course-grained security"
        }
        $projects += [PSCustomObject]@{
            Id          = ""
            Name        = "Legal"
            Description = "Project that typically can use course-grained security"
        }
        $projects += [PSCustomObject]@{
            Id          = ""
            Name        = "SkunkWorks"
            Description = "Super secret project that might benefit from fine-grained security"
        }
    }

    process {
        foreach ($group in $collectionGroups) {
            $groupName = "$InstanceName$($group.Name)"
            New-SecurityGroup -GroupName $groupName -Group $group
        }

        foreach ($project in $Projects) {            
            foreach ($group in $projectGroups) {
                $groupName = "$InstanceName$($project.Name)$($group.Name)"
                New-SecurityGroup -GroupName $groupName -Group $group
            }
        }

        foreach ($user in $users  ) {
            New-SampleUser -User $user
        }

        foreach ($collection in $Collections) {
            foreach ($project in $Projects) {
                $project.Id = ''
            }
            foreach ($group in $collectionGroups) {
                New-AzDoGroup -CollectionUrl "$Instance/$collection" -Group $group
            }
            foreach ($project in $Projects) {
                New-AzDOTeamProject -CollectionUrl "$Instance/$collection" -Project $project
                foreach ($group in $projectGroups) {
                    New-AzDoGroup -CollectionUrl "$Instance/$collection" -Project $project -Group $group
                }
            }
        }
    }

    end {
        # One-time post processing for the function
        # Write-Host "Finishing Up"
    }
<#
.SYNOPSIS

Adds team projects and groups to Azure DevOps organizations.

.DESCRIPTION

Adds team projects and groups to Azure DevOps organizations. Does not overwrite existing
projects and groups but does add any missing items.

.INPUTS

None. You cannot pipe objects to New-AzDoTestData. But soon it will support pipeing a
list of organizations to update

.OUTPUTS

None.

.EXAMPLE

PS> New-AzDoCollections -InstanceName TFS -Collections 'FineGrained','CourseGrained','CrossGrained' -Instance 'http://robssurfacepro' -Verbose

.EXAMPLE

PS> New-AzDoCollections -InstanceName TFS -Collections 'FineGrained','CourseGrained','CrossGrained' -Instance 'http://robssurfacepro' -Verbose

.LINK

http://www.fabrikam.com/extension.html

.LINK

Set-Item
#>
}

function New-AzDoGroup {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        $CollectionUrl,
        $Project = $null,
        $Group
    )
    
    $homePageUri = [System.Uri]$CollectionUrl
    $homePage = Invoke-WebRequest -Uri $homePageUri -Method Get -UseDefaultCredentials -SessionVariable az
    
    foreach ($cookie in $az.Cookies.GetCookies($homePageUri)) {
        if ($cookie.Name -eq '__RequestVerificationToken') {
            $csrf = $cookie.Value
        }
    }

    $body = @{
        name                       = $Group.AzDoName
        description                = $Group.Description
        tfid                       = ""
        __RequestVerificationToken = $csrf
    } | ConvertTo-Json

    if ($null -eq $Project) {
        $uri = [System.Uri]"$CollectionUrl/_api/_identity/ReadScopedApplicationGroupsJson?__v=5"
    }
    else {
        $uri = [System.Uri]"$CollectionUrl/$($Project.Id)/_api/_identity/ReadScopedApplicationGroupsJson?__v=5"
    }
    $identityResponse = Invoke-RestMethod -Method Get -Uri $uri -UseDefaultCredentials -WebSession $az

    $found = $false
    foreach ($i in $identityResponse.identities) {
        if ($i.FriendlyDisplayName -like $Group.AzDoName) {
            $found = $true
            Write-Verbose "$($i.FriendlyDisplayName) already exists"
        }
    }
    if (!$found) {
        if ($null -eq $Project) {
            $uri = "$CollectionUrl/_api/_identity/ManageGroup?__v=5"
        }
        else {
            $uri = "$CollectionUrl/$($Project.Id)/_api/_identity/ManageGroup?__v=5"
        }
        # TODO Support token based authentication and AzDOServices Graph
        if ($PSCmdlet.ShouldProcess($Group.Name)) {
            $newGroupResponse = Invoke-RestMethod -Method Post -Uri $uri -Body $body -ContentType 'application/json' -UseDefaultCredentials -WebSession $az
        }
    }
}


function New-AzDOTeamProject {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        $CollectionUrl,
        $Project
    )

    $body = @{
        name         = $Project.Name
        description  = $Project.Description
        capabilities = @{
            versioncontrol  = @{
                sourceControlType = "Git"
            }
            processTemplate = @{
                templateTypeId = "6b724908-ef14-45cf-84f8-768b5384da45"
            }
        }
    } | ConvertTo-Json

    $uri = "$CollectionUrl/_apis/projects?api-version=6.0"
    # TODO Query with ContinuationToken for sites with a lot of Projects
    $projectsResponse = Invoke-RestMethod -Method Get -Uri $uri -UseDefaultCredentials
    
    $found = $false
    foreach ($p in $projectsResponse.value) {
        if ($p.Name -like $Project.Name) {
            $found = $true
            $Project.Id = $p.id
            Write-Verbose "$($Project.Name) already exists"
        }
    }
    if (!$found) {
        # TODO Support token based authentication
        if ($PSCmdlet.ShouldProcess($Project.Name)) {
            $projectResponse = Invoke-RestMethod -Method Post -Uri $uri -Body $body -UseDefaultCredentials -ContentType 'application/json'
            $Project.Id = $projectResponse.id
        }
    }
}

function New-SecurityGroup {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        $GroupName,
        $Group
    )
    try {
        # if (Get-LocalGroup -Name $GroupName -ErrorAction Stop) {
        #     Write-Verbose "$GroupName already exists"
        #     # Remove-LocalGroup -Name $groupName
        # }
    }
    catch [Microsoft.PowerShell.Commands.GroupNotFoundException] {
        Write-Verbose "$GroupName did not exist"
        if ($PSCmdlet.ShouldProcess($GroupName)) {
            # New-LocalGroup -Name $GroupName -Description $Group.Description -WhatIf:$WhatIfPreference
            
        }
        #"$($PSItem.Exception)"
    }
}

function New-SampleUser {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        $User
    )
    try {
        if (Get-LocalUser -Name $User.Name -ErrorAction Stop) {
            Write-Verbose "$($User.Name) already exists"
            # Remove-LocalGroup -Name $groupName
        }
    }
    catch [Microsoft.PowerShell.Commands.UserNotFoundException] {
        Write-Verbose "$($User.Name) did not exist"
        if ($PSCmdlet.ShouldProcess($User.Name)) {
            $password = ConvertTo-SecureString "PurpleCode" -AsPlainText -Force
            New-LocalUser `
                -Name $User.Name `
                -Description $User.Description `
                -FullName $User.FullName `
                -Password  $password `
                -AccountNeverExpires `
                -PasswordNeverExpires `
                -UserMayNotChangePassword
        }
        #"$($PSItem.Exception)"
    }
}