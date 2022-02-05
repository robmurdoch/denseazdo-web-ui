# Dense Azure DevOps

## Useful Commands
### Recycle AppPool
Restart-WebAppPool (Get-Website -Name "Azure DevOps Server").applicationPool

### Enable CORs
Edit the Azure DevOps Server root web.config
Add the following to enable Cors System.WebServer
    <cors enabled="true">
      <add origin="http://localhost:4200" allowCredentials="true">
        <allowHeaders allowAllRequestedHeaders="true" />
        <allowMethods>
            <add method="GET" />
            <add method="HEAD" />
            <add method="POST" />
            <add method="PUT" /> 
            <add method="DELETE" />         
        </allowMethods>
      </add>
    </cors>

### Increase QueryStringLength
Edit the Azure DevOps Server root web.config
Add the maxQueryString to the requestLimits setting
  <system.webServer>
    <security>
      <requestFiltering allowHighBitCharacters="true">
        ...
        <requestLimits maxAllowedContentLength="2000000000" maxQueryString="8192" />

## Development Environment
1. Install Azure DevOps Express locally
2. Backup databases (See data folder)
3. Create 3 collections
      - CourseGrained - Course-Grained Security Sample6rgf
      - FineGrained - Fine-Grained Security Sample
      - CrossGrained - Cross-Grained Security Sample
4. Create local groups and user accounts
      - .\e2e\New-AzDoTestData.psm1
    Import-Module .\New-AzDoTestData.psm1 -Force
    New-AzDoCollectionGroups -InstanceName TFS -Projects HR, Legal, SkunkWorks

  ## Docker
  Create a self-signed certificate (make it a habit to use SSL everywhere)
  `openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:4096 -keyout private.key -out certificate.crt`

  Build the image
  `docker build -f src/Dockerfile -t denseazdo .`
  
  Start the container detached and expose only the SSL port
  `docker run --name denseazdo -dp 443:443 denseazdo:latest`