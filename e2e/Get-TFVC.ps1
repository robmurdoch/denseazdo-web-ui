<#
    .SYNOPSIS
        Extract the permissions for a TFVC repository, report them for review.
    .DESCRIPTION
        Get the ACLs for the repo root $/Project. Iterate them and retrieve the 
        Identities one-by-one caching them along the way. Export the data to csv
        for importing to Excel to review.
#>
[CmdletBinding()]
param (
    [Parameter(Mandatory = $false)]
    [Alias("i")]
    [String]$OrgUrl = 'http://azdo1.experiment.net/DefaultCollection',
    
    [Parameter(Mandatory = $false)]
    [Alias("p")]
    [String[]]$Projects = @(),
    
    [Parameter(Mandatory = $false)]
    [Alias("f")]
    [String]$OutFile = "$Env:USERPROFILE\Documents\TFS TFVC.csv"
)

. .\Utility.ps1

$outputFile = New-FileNameWithDate -BaseName $OutFile
$output = @()

function Export-Acl {
    param(
        [String]$OrgUrl,
        [System.Object]$Acl,
        [System.Object]$SecurityNamespace
    )
    
    $aces = $Acl.acesDictionary

    foreach ($ace in $aces.PSObject.Properties) {
        
        $aceOutput = [PSCustomObject]@{
            Org                = $OrgUrl
            Securable          = $Acl.token
            Identity           = ""
            Read               = ""
            PendChange         = ""
            CheckIn            = ""
            Label              = ""
            Lock               = ""
            ReviseOther        = ""
            UnlockOther        = ""
            UndoOther          = ""
            LabelOther         = ""
            AdminProjectRights = ""
            CheckinOther       = ""
            Merge              = ""
            ManageBranch       = ""
        }
        $descriptor = $ace.value.descriptor
        $identity = Get-Identity `
            -OrgUrl $OrgUrl `
            -Descriptor $descriptor
        $aceOutput.Identity = $identity.providerDisplayName

        $allow = $ace.value.allow
        $deny = $ace.value.deny
        # $effectiveAllow = $ace.value.extendedInfo.effectiveAllow
        # $effectiveDeny = $ace.value.deny

        foreach ($bit in $SecurityNamespace.actions) {
            if (($allow -band $bit.bit) -eq $bit.bit) {
                $aceOutput.$($bit.name) = "Allow"
            }
            if (($deny -band $bit.bit) -eq $bit.bit) {
                $aceOutput.$($bit.name) = "Deny"
            }
        }
        $script:Output += $aceOutput
    }

}

$tfvcSecNamespace = Get-SecurityNamespace `
    -OrgUrl $OrgUrl `
    -Name 'VersionControlItems'

$TeamProjects = Get-Projects `
    -OrgUrl $OrgUrl
    
foreach ($project in $TeamProjects.value) {

    if (($Projects.Length -eq 0) -or ($TeamProjects.Contains($project.name))) {
        Write-Information "$($project.name):$($project.Id)"

        $acls = Get-ACLs `
            -OrgUrl $OrgUrl `
            -NamespaceId $tfvcSecNamespace.namespaceId `
            -Token "$/$($project.name)" `
            -IncludeAll

        foreach ($acl in $acls.value) {
            Export-Acl `
                -OrgUrl $OrgUrl `
                -Acl $acl `
                -SecurityNamespace $tfvcSecNamespace
        }

        # $tfvcItems = Get-AllLatestTFVCItems `
        #     -ProjectUrl "$OrgUrl/$($project.Id)" `
        #     -ScopePath "$/$($project.name)/"
        
        # foreach ($tfvcItem in $tfvcItems.value) {
        #     Export-Path `
        #         -OrgUrl $OrgUrl `
        #         -Name $tfvcItem.name `
        #         -Level 1 `
        #         -NamespaceId $tfvcSecNamespace.namespaceId `
        #         -Token $Token `
        #         -Bits $tfvcSecNamespace.actions
        # }
    }    
}
$script:Output