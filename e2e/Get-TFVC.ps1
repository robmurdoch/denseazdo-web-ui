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
    [String]$OrgUrl = 'https://azdo1.experiment.net/DefaultCollection',
    
    [Parameter(Mandatory = $false)]
    [Alias("p")]
    [String[]]$Projects = @()#,
    
    # [Parameter(Mandatory = $false)]
    # [Alias("f")]
    # [String]$OutFile = "$Env:USERPROFILE\Documents\TFS TFVC.csv"
)

. .\Utility.ps1

# $outputFile = New-FileNameWithDate -BaseName $OutFile
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
            # Org                = $OrgUrl
            Securable          = $Acl.token
            Identity           = ""
            InheritPermissions = $Acl.inheritPermissions
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
        if ($identity.value[0].customDisplayName) {
            $aceOutput.Identity = $identity.value[0].customDisplayName
        }
        else {
            $aceOutput.Identity = $identity.value[0].providerDisplayName
        }
        
        $allow = $ace.value.allow
        $deny = $ace.value.deny
        $effectiveAllow = $ace.value.extendedInfo.effectiveAllow
        $effectiveDeny = $ace.value.extendedInfo.effectiveDeny

        foreach ($bit in $SecurityNamespace.actions) {
            if (($effectiveAllow -band $bit.bit) -eq $bit.bit) {
                $aceOutput.$($bit.name) = "Effective Allow"
            }
            if (($allow -band $bit.bit) -eq $bit.bit) {
                $aceOutput.$($bit.name) = "Allow"
            }
            if (($effectiveDeny -band $bit.bit) -eq $bit.bit) {
                $aceOutput.$($bit.name) = "Effective Deny"
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

    if (($Projects.Length -eq 0) -or ($Projects -Contains ($($project.name)))) {
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

        # Include All above returns all of the non-inherited ACLs
        # $tfvcItems = Get-AllLatestTFVCItems `
        #     -ProjectUrl "$OrgUrl/$($project.Id)" `
        #     -ScopePath "$/$($project.name)/"
        
        # foreach ($tfvcItem in $tfvcItems.value) {
            
        #     $acls = Get-ACLs `
        #         -OrgUrl $OrgUrl `
        #         -NamespaceId $tfvcSecNamespace.namespaceId `
        #         -Token "$($tfvcItem.path)" `
        #         -IncludeAll        

        #     foreach ($acl in $acls.value) {
        #         Export-Acl `
        #             -OrgUrl $OrgUrl `
        #             -Acl $acl `
        #             -SecurityNamespace $tfvcSecNamespace
        #     }
        # }
    }    
}
$script:Output