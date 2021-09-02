$personalAccessToken = 'i2shw3bs5bv46ogecf5rhswgpxra2vihg2ai6kl45rtxd34lrrpq'
$collectionUrl = 'http://azdo1.experiment.net/DefaultCollection/'

$token = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes(":$($personalAccessToken)"))
$header = @{authorization = "Basic $token" }

# $url = "$collectionUrl/_apis/securitynamespaces/?api-version=6.0"
# $sns = Invoke-RestMethod -Uri $url -Method Get -ContentType "application/json" -Headers $header
# $sns.value | ConvertTo-Json -depth 50 | Out-File '.\e2e\data\securityNamespaces.json'

$sns = 'a39371cf-0841-4c16-bbd3-276e341bc052'
$tfvcToken = '$/Scratch/Locked'
# $tfvcToken = '%24%2FScratch%2FLocked'
# https://dev.azure.com/{organization}/{project}/_apis/tfvc/items?api-version=6.0
# $url = "$collectionUrl/Scratch/_apis/accesscontrollists/$sns?token=$tfvcToken&includeExtendedInfo=true&recurse=true&api-version=6.0" 
$url = "$collectionUrl/_apis/accesscontrollists/$sns?api-version=6.0" 
$acls = Invoke-RestMethod -Uri $url -Method Get -ContentType "application/json" -Header  $header
$acls.value | ConvertTo-Json -depth 50 | Write-Host
# $acls.value | ConvertTo-Json -depth 50 | Out-File '.\e2e\data\tfvcsecurity.json'
# GET https://dev.azure.com/{organization}/_apis/accesscontrollists/{securityNamespaceId}?token={token}&descriptors={descriptors}&includeExtendedInfo={includeExtendedInfo}&recurse={recurse}&api-version=6.0
# POST https://dev.azure.com/{organization}/_apis/accesscontrollists/{securityNamespaceId}?api-version=6.0



