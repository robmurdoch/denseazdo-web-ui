$script:ResultsCache = @{}
$script:AzDoCred = @{ Connected = $false }

function New-FileNameWithDate {
    param(
        [String]$BaseName
    )

    $extension = $BaseName.Substring($BaseName.LastIndexOf("."))
    $file = $BaseName.Substring(0, $BaseName.LastIndexOf("."))
    return "$file $(Get-Date -f yyyy-MM-dd)$extension"
}

function Connect-AzureDevOps {
    [CmdletBinding(DefaultParameterSetName = 'Token')]
    param(
        [Parameter(Mandatory = $true,
            HelpMessage = 'Enter the collection address, e.g. https://mysite.mydomain.net/DefaultCollection',
            Position = 0)]
        [String]$Uri,

        [Parameter(Mandatory = $false,
            HelpMessage = 'Select your authentication method Token, DefaultCredentials, Credentials',
            position = 1)]
        [ValidateSet('Token', 'DefaultCredentials', 'Credentials', IgnoreCase = $true)]
        [String]$Method = 'DefaultCredentials',

        [Parameter(Mandatory = $false,
            ParameterSetName = 'Token',
            HelpMessage = 'Enter your token',
            position = 2)]
        [string]$Token,

        [Parameter(Mandatory = $false,
            ParameterSetName = 'Credentials',
            HelpMessage = 'Variable resulting from Get-Credential cmdlet',
            position = 2)]        
        [System.Management.Automation.PSCredential]$Creds
    )
    
    if ($Method -eq 'Token') {
        if (!$PSBoundParameters.ContainsKey("Token")) {
            $Token = Read-Host "Need token"
        }
        $script:AzDoCred.Token = $Token
    }
    elseif ($Method -eq 'Credentials') {
        if (!$PSBoundParameters.ContainsKey("Creds")) {
            $Creds = $host.ui.PromptForCredential("Need credentials", "Please enter your user name and password.", "", "NetBiosUserName")
        }
        $script:AzDoCred.Credentials = $Creds
    }

    if ( $null -ne $script:AzDoCred.Token ) {
        $response = Invoke-RestMethod `
            -Method Get `
            -Headers (Get-EncodedAuthHeader -headerValue $AzDoCred.Token) `
            -Uri $Uri `
            -ErrorAction:Stop
        $script:AzDoCred.Connected = $true
    }
    elseif ($null -ne $script:AzDoCred.Credential) {
        $response = Invoke-RestMethod `
            -Method Get `
            -Uri $Uri `
            -Authentication Basic `
            -Credential $AzDoCred.Credential
        $script:AzDoCred.Connected = $true
    }
    else {
        $response = Invoke-RestMethod `
            -Method Get `
            -Uri $Uri `
            -UseDefaultCredentials
        $script:AzDoCred.Connected = $true
    }
}

function Get-EncodedAuthHeader {
    param(
        [String]$headerValue
    )
    $encodedValue = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes(":$($headerValue)"))
    $header = @{authorization = "Basic $encodedValue" }
    return $header
}

function Get-RestApiResults {
    param(
        [String]$Uri,
        [String]$Name,
        [bool]$CacheResults = $false
    )

    if ($script:AzDoCred.Connected -eq $false) {
        Connect-AzureDevOps -Uri $Uri
    }

    if ($CacheResults -and ($DebugPreference -ne 'SilentlyContinue')) {
        $UrlHash = Get-HashedUrl -Uri $Uri
        
        If ($script:ResultsCache.ContainsKey($UrlHash)) {
            $response = $script:ResultsCache[$hash]
        }
        else {
            $response = Invoke-RestMethod `
                -Method Get `
                -Uri $Uri `
                -UseDefaultCredentials
            New-CachedJsonDocument -Name $Name -RawResponse $response
            $script:ResultsCache.Add($UrlHash, $response)
        }
    }
    else {
        $response = Invoke-RestMethod `
            -Method Get `
            -Uri $Uri `
            -UseDefaultCredentials
    }
    return $response
}

function Get-HashedUrl {
    param(
        [String]$Uri
    )

    $stringAsStream = [System.IO.MemoryStream]::new()
    $writer = [System.IO.StreamWriter]::new($stringAsStream)
    $writer.write($Uri)
    $writer.Flush()
    $stringAsStream.Position = 0
    $hash = Get-FileHash -InputStream $stringAsStream
    return $hash
}

function New-CachedJsonDocument {
    param(
        [String]$Name,
        $RawResponse
    )

    $json = $RawResponse | ConvertTo-Json -Depth 50
    $stringAsStream = [System.IO.MemoryStream]::new()
    $writer = [System.IO.StreamWriter]::new($stringAsStream)
    $writer.write($json)
    $writer.Flush()
    $stringAsStream.Position = 0
    $hash = Get-FileHash -InputStream $stringAsStream
    $json | Set-Content -Path "$Env:USERPROFILE\Downloads\$Name-$($hash.Hash).json" -Force
}

function Get-SecurityNamespaces {
    param(
        [String]$OrgUrl
    )
    return Get-RestApiResults `
        -Uri "$OrgUrl/_apis/securitynamespaces?api-version=6.0" `
        -Name 'SecurityNamespaces' `
        -CacheResults $true
}

function Get-SecurityNamespace {    
    param(
        [String]$OrgUrl,
        [String]$Name
    )
    $namespaces = Get-SecurityNamespaces -OrgUrl $OrgUrl
    foreach ($namespace in $namespaces.value) {
        if ($namespace.name.ToUpper() -eq $Name.ToUpper()) {
            return $namespace
        }
    }
}

function Get-Projects {
    param(
        [String]$OrgUrl
    )
    return Get-RestApiResults `
        -Uri "$OrgUrl/_apis/projects?api-version=6.0" `
        -Name "Projects" `
        -CacheResults $true
}

function Get-AllLatestTFVCItems {
    param(
        [String]$ProjectUrl,
        [String]$ScopePath
    )
    # GET https://dev.azure.com/{organization}/{project}/_apis/tfvc/items?scopePath={scopePath}&recursionLevel={recursionLevel}&includeLinks={includeLinks}&versionDescriptor.version={versionDescriptor.version}&versionDescriptor.versionOption={versionDescriptor.versionOption}&versionDescriptor.versionType={versionDescriptor.versionType}&api-version=6.1-preview.1
    return Get-RestApiResults `
        -Uri "$ProjectUrl/_apis/tfvc/items?scopePath=$ScopePath&recursionLevel=full&api-version=6.0" `
        -Name "TfvcItems" `
        -CacheResults $true
}


function Get-ACLs {
    param(
        [String]$OrgUrl,
        [String]$NamespaceId,
        [String]$Token,
        [Switch]$IncludeAll
    )
    # GET https://dev.azure.com/{organization}/_apis/accesscontrollists/{securityNamespaceId}?token={token}&descriptors={descriptors}&includeExtendedInfo={includeExtendedInfo}&recurse={recurse}&api-version=6.0

    if ($IncludeAll) {
        return Get-RestApiResults `
            -Uri "$OrgUrl/_apis/AccessControlLists/$($NamespaceId)?token=$Token&includeExtendedInfo=true&recurse=true&api-version=6.0" `
            -Name "ACLs" `
            -CacheResults $true
    }
    else {    
        return Get-RestApiResults `
            -Uri "$OrgUrl/_apis/AccessControlLists/$($NamespaceId)?api-version=6.0" `
            -Name "ACLs" `
            -CacheResults $true      
    }
}


function Get-Identity {
    param(
        [String]$OrgUrl,
        [String]$Descriptor
    )

    # GET https://vssps.dev.azure.com/{organization}/_apis/identities?descriptors={descriptors}&identityIds={identityIds}&subjectDescriptors={subjectDescriptors}&searchFilter={searchFilter}&filterValue={filterValue}&queryMembership={queryMembership}&api-version=6.0

    return Get-RestApiResults `
        -Uri "$OrgUrl/_apis/identities?descriptors=$Descriptor&api-version=6.0" `
        -Name "Identity" `
        -CacheResults $true      
}
