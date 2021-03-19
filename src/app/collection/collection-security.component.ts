import { Component, OnInit } from '@angular/core';
import { Observable, from, of, zip, forkJoin } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Collection, SecurityNamespace, Identity } from '../core/shared/azdo-types';
import { AzDoService } from '../core/services/azdo.service';
import { AzDoConnectionService } from '../core/services/azdo-connection.service';
import { Finding, Rule } from '../core/shared/interfaces'
import { stringify } from '@angular/compiler/src/util';
import { keyframes } from '@angular/animations';
import { SnackbarService } from '../core/services/snackbar.service';


@Component({
  selector: 'app-collection-security',
  templateUrl: './collection-security.component.html',
  styleUrls: ['./collection-security.component.css']
})
export class CollectionSecurityComponent {
  showCollectionSecuritySpinner: boolean = false;
  showSecurityFindingsBadge: boolean = false;
  securityFindingsCount: number = 0;
  securityNamespaces: Collection<SecurityNamespace> = {};
  projectCollectionValidUsersGroup: Collection<Identity> = {};
  projectCollectionValidUsersGroupMembers: Collection<Identity> = {};
  projectCollectionValidUsersGroupMembersMembers: Collection<Identity> = {};
  findings: Finding[] = [];

  constructor(
    private azdoConnectionService: AzDoConnectionService,
    private azdoService: AzDoService,
    private snackBarService: SnackbarService
  ) {
  }

  ngOnInit(): void {
    this.showCollectionSecuritySpinner = true;
    from(this.azdoService.getProjectCollectionValidUsersGroup()).pipe(
      concatMap(topLevelGroupResponse => {
        const topLevelGroup: Identity = topLevelGroupResponse?.value![0];
        return forkJoin([
          of(topLevelGroupResponse),
          this.azdoService.getIdentities(topLevelGroup.memberIds)
        ]);
      }),
      concatMap(([response1, response2]) => {
        // const secondLevelGroupMembers: string[] = 
        return forkJoin([
          of(response1),
          of(response2),
          this.azdoService.getIdentities(this.combineMemberIds(response2?.value!))
        ]);
      }),
    ).subscribe(values => {
      this.projectCollectionValidUsersGroup = values[0];
      console.log(this.projectCollectionValidUsersGroup)
      this.projectCollectionValidUsersGroupMembers = values[1];
      console.log(this.projectCollectionValidUsersGroupMembers)
      this.projectCollectionValidUsersGroupMembersMembers = values[2];
      console.log(this.projectCollectionValidUsersGroupMembersMembers)
      this.analyzeCollectionGroupSecurity();
      console.log(this.findings)
      this.securityFindingsCount=this.findings.length;
      this.showCollectionSecuritySpinner = false;
      console.log("Data fetched, analysis complete, spinner off")
    });
  }

  showFindings(){
    if (this.findings.length) {
      this.openConnectionDialog({ url: "", token: "" });
    } else {
      // Show some eyecandy telling them how great their security is and what was checked
    }
  }

  combineMemberIds(identities: Identity[]): string[] {
    var memberIds: string[] = [];
    identities.forEach(identity => {
      memberIds = memberIds.concat(identity.memberIds!)
    });
    return memberIds;
  }

  private analyzeCollectionGroupSecurity() {
    const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);

    this.projectCollectionValidUsersGroupMembers?.value!.forEach(member => {
      const memberIdentity = this.projectCollectionValidUsersGroupMembers?.value?.find(
        identity => identity?.descriptor === member.descriptor
      )

      console.log(`PC Group Member: ${memberIdentity?.providerDisplayName}`);
      if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Administrators`.toUpperCase())
        this.checkProjectCollectionAdministrators(memberIdentity);

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Auditors`.toUpperCase())
        this.checkProjectCollectionAuditors(memberIdentity);

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Build Administrators`.toUpperCase())
        this.checkProjectCollectionBuildAdministrators(memberIdentity);

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Build Service Accounts`.toUpperCase())
        this.checkProjectCollectionBuildServiceAccounts(memberIdentity);

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Developers`.toUpperCase())
        this.checkProjectCollectionDevelopers(memberIdentity);

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Operators`.toUpperCase())
        this.checkProjectCollectionOperators(memberIdentity);

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Proxy Service Accounts`.toUpperCase())
        this.checkProjectCollectionProxyServiceAccounts(memberIdentity);

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Service Accounts`.toUpperCase())
        this.checkProjectCollectionServiceAccounts(memberIdentity);

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Test Service Accounts`.toUpperCase())
        this.checkProjectCollectionTestServiceAccounts(memberIdentity);

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Testers`.toUpperCase())
        this.checkProjectCollectionTesters(memberIdentity);

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Valid Users`.toUpperCase())
        this.checkProjectCollectionValidUsersGroup(memberIdentity);

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Security Service Group`.toUpperCase())
        this.checkSecurityServiceGroup(memberIdentity);

      else if (memberIdentity?.providerDisplayName?.toUpperCase().includes("Project Valid Users".toUpperCase())) {
        // this.checkSecurityServiceGroup(identity);
      }

      else {
        const rule: Rule = {
          name: "Unexpected Project Collection Valid User group member",
          description: "Security groups defined at the collection level should be well-known and examined by this tool."
        }
        const finding: Finding = {
          rule: rule,
          value: memberIdentity?.providerDisplayName,
          id: memberIdentity?.descriptor
        }
        this.findings.push(finding);
      }
    });
  }

  /**
   * 
   * @param identity The identity that matches the rules being checked by this method
   */
  private checkProjectCollectionValidUsersGroup(identity: Identity): void {
    console.log("checkProjectCollectionValidUsersGroup");
    // Should only contain [Team Foundation] Azure DevOps Service Accounts
  }

  /**
   * Checks the members of the Project Collection Administrators Group are:
   * 1. An Active Directory or Windows Group that follows naming convention [instance]-[Administrators]
   * 2. An OOTB well-known group
   * @param identity The identity that matches the rules being checked by this method
   */
  private checkProjectCollectionAdministrators(identity: Identity): void {
    const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url)
    const instanceName = this.azdoConnectionService.currentConnection?.instanceName;

    identity.members.forEach(descriptor => {
      const memberIdentity = this.projectCollectionValidUsersGroupMembersMembers?.value?.find(
        identity => identity?.descriptor === descriptor
      )

      console.log(`PC Group Member, Member: ${memberIdentity?.providerDisplayName}`);
      if (!(memberIdentity?.providerDisplayName?.toUpperCase() === `[TEAM FOUNDATION]\\Team Foundation Administrators`.toUpperCase()
        || memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Service Accounts`.toUpperCase()
        || memberIdentity?.providerDisplayName?.toUpperCase() === `${instanceName}Administrators`.toUpperCase()
        || memberIdentity?.providerDisplayName?.toUpperCase() === `Administrators`.toUpperCase()
        || memberIdentity?.providerDisplayName?.toUpperCase() === `[TEAM FOUNDATION]\\Azure DevOps Service Accounts`.toUpperCase())
      ) {
        const rule: Rule = {
          name: "Unexpected Project Collection Administrators group member",
          description: "Security groups defined at the collection should only have well-known groups as members."
        }
        const finding: Finding = {
          rule: rule,
          value: memberIdentity?.providerDisplayName,
          id: memberIdentity?.descriptor
        }
        this.findings.push(finding);
      }
    });
  }

  private checkProjectCollectionAuditors(identity: Identity): void {
    console.log("checkProjectCollectionAuditors");
    // Should only contain [{domain}] Auditors
  }
  private checkProjectCollectionBuildAdministrators(identity: Identity): void {
    console.log("checkProjectCollectionBuildAdministrators");
    // Should be empty, these functions are delegated to
  }
  private checkProjectCollectionBuildServiceAccounts(identity: Identity): void {
    console.log("checkProjectCollectionBuildServiceAccounts");
    // Should only contain [{domain}] BuildServiceAccounts
  }
  private checkProjectCollectionDevelopers(identity: Identity): void {
    console.log("checkProjectCollectionDevelopers");
    // Should only contain [{domain}] Developers
  }
  private checkProjectCollectionOperators(identity: Identity): void {
    console.log("checkProjectCollectionOperators");
    // Should only contain [{domain}] Operators
  }
  private checkProjectCollectionProxyServiceAccounts(identity: Identity): void {
    console.log("checkProjectCollectionProxyServiceAccounts");
    // Should only contain [Team Foundation] Azure DevOps Proxy Service Accounts
  }
  private checkProjectCollectionTestServiceAccounts(identity: Identity): void {
    console.log("checkProjectCollectionTestServiceAccounts");
    // Should only contain [Team Foundation] Test Service Accounts
  }
  private checkProjectCollectionTesters(identity: Identity): void {
    console.log("checkProjectCollectionTesters");
    // Should only contain [{collection}] Project Collection Testers
  }
  private checkSecurityServiceGroup(identity: Identity): void {
    console.log("checkSecurityServiceGroup");
    // Should only contain [{collection}] Project Collection Service Acounts
  }
  private checkProjectCollectionServiceAccounts(identity: Identity): void {
    console.log("checkProjectCollectionServiceAccounts");
    // Should only contain [{collection}] Project Collection Service Acounts
  }

  private check(identity: Identity): void {
    // console.log("check");
    // Should only contain [{collection}] Project Collection Service Acounts
  }
}
