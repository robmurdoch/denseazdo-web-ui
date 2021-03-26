Function New-AzDoCollectionGroups {
    # [CmdletBinding()]
    [CmdletBinding(SupportsShouldProcess)]
    param (
        [Parameter(Mandatory = $true,
            ParameterSetName = 'Default',
            HelpMessage = 'Enter a value that uniquely identifies an instance, use Azure DevOps Services for SaaS.',
            Position = 0)]
        [string]$InstanceName,
        
        [Parameter(Mandatory = $false,
            ParameterSetName = 'Default',
            HelpMessage = 'Enter a comma separated list of project names.',
            Position = 1)]
        [string[]]$Projects
    )

    begin {

        $collectionGroups = @()
        $collectionGroups += [PSCustomObject]@{
            Name        = "BuildServiceAccounts"
            Description = "Maps to AzDo Instance Build Service Accounts"
        }
        $collectionGroups += [PSCustomObject]@{
            Name        = "ProxyServiceAccounts"
            Description = "Maps to AzDo Instance Proxy Service Accounts"
        }
        $collectionGroups += [PSCustomObject]@{
            Name        = "TestServiceAccounts"
            Description = "Maps to AzDo Instance Test Service Accounts"
        }
        $collectionGroups += [PSCustomObject]@{
            Name        = "Developers"
            Description = "Maps to AzDo Instance Developers"
        }
        $collectionGroups += [PSCustomObject]@{
            Name        = "ComplianceOfficers"
            Description = "Maps to AzDo Instance Compliance Officers"
        }
        $collectionGroups += [PSCustomObject]@{
            Name        = "Auditors"
            Description = "Maps to AzDo Instance Auditors"
        }
        $collectionGroups += [PSCustomObject]@{
            Name        = "DevOpsEngineers"
            Description = "Maps to AzDo Instance DevOps Engineers"
        }
        $collectionGroups += [PSCustomObject]@{
            Name        = "Operators"
            Description = "Maps to AzDo Instance Operators"
        }
        $collectionGroups += [PSCustomObject]@{
            Name        = "Testers"
            Description = "Maps to AzDo Instance Testers"
        }
        $collectionGroups += [PSCustomObject]@{
            Name        = "Administrators"
            Description = "Maps to AzDo Instance Administrators"
        }

        $projectGroups = @()
        $projectGroups += [PSCustomObject]@{
            Name        = "Developers"
            Description = "Maps to AzDo Project Developers"
        }
        $projectGroups += [PSCustomObject]@{
            Name        = "ComplianceOfficers"
            Description = "Maps to AzDo Project Compliance Officers"
        }
        $projectGroups += [PSCustomObject]@{
            Name        = "Auditors"
            Description = "Maps to AzDo Project Auditors"
        }
        $projectGroups += [PSCustomObject]@{
            Name        = "DevOpsEngineers"
            Description = "Maps to AzDo Project DevOps Engineers"
        }
        $projectGroups += [PSCustomObject]@{
            Name        = "Operators"
            Description = "Maps to AzDo Project Operators"
        }
        $projectGroups += [PSCustomObject]@{
            Name        = "Testers"
            Description = "Maps to AzDo Project Testers"
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
    }

    process {
        foreach ($group in $collectionGroups) {
            $groupName = "$InstanceName$($group.Name)"
            New-SampleGroup -GroupName $groupName -Group $group
        }

        foreach ($project in $Projects) {            
            foreach ($group in $projectGroups) {
                $groupName = "$InstanceName$project$($group.Name)"
                New-SampleGroup -GroupName $groupName
            }
        }

        foreach ($user in $users  ) {
            New-SampleUser -User $user
        }
    }

    end {
        # One-time post processing for the function
        # Write-Host "Finishing Up"
    }
}

function New-SampleGroup {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        $GroupName,
        $Group
    )
    try {
        if (Get-LocalGroup -Name $GroupName -ErrorAction Stop) {
            Write-Verbose "$GroupName already exists"
            # Remove-LocalGroup -Name $groupName
        }
    }
    catch [Microsoft.PowerShell.Commands.GroupNotFoundException] {
        Write-Verbose "$GroupName did not exist"
        if ($PSCmdlet.ShouldProcess($GroupName)) {
            New-LocalGroup -Name $GroupName `
                -Description $Group.Description -WhatIf:$WhatIfPreference
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