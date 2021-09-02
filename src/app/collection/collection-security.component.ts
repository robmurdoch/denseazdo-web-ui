import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, from, of, zip, forkJoin } from 'rxjs';
import { concatMap } from 'rxjs/operators';

import { Collection, SecurityNamespace, Identity } from '../core/shared/azdo-types';
import { AzDoService } from '../core/services/azdo.service';
import { AzDoConnectionService } from '../core/services/azdo-connection.service';
import { Finding, Rule } from '../core/shared/interfaces';
import { SnackbarService } from '../core/services/snackbar.service';
import { FindingDialogComponent } from '../finding-dialog/finding-dialog.component';
import { RuleService } from '../core/services/rule.service';
import { UtilityService } from '../core/services/utility.service';
import { AzDoCacheService } from '../core/services/azdo-cache.service';

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
    private azdoCacheService: AzDoCacheService,
    private snackBarService: SnackbarService,
    private ruleService: RuleService,
    public dialog: MatDialog,
    private utilityService: UtilityService
  ) {
  }

  ngOnInit(): void {
    this.showCollectionSecuritySpinner = true;
    this.findings = [];
    from(this.azdoService.getProjectCollectionValidUsersGroup()).pipe(
      concatMap(topLevelGroupResponse => {
        const topLevelGroup: Identity = topLevelGroupResponse?.value![0];
        return forkJoin([
          of(topLevelGroupResponse),
          this.azdoService.getIdentities(topLevelGroup.memberIds)
        ]);
      }),
      concatMap(([topLevelGroupResponse, topLevelGroupMembers]) => {
        return forkJoin([
          of(topLevelGroupResponse), of(topLevelGroupMembers),
          this.azdoService.getIdentities(this.combineMemberIds(topLevelGroupMembers?.value!))
        ]);
      }),
    ).subscribe(values => {
      this.azdoCacheService.cacheIdentities(values[1])
      this.azdoCacheService.cacheIdentities(values[2])
      this.projectCollectionValidUsersGroup = values[0];
      this.projectCollectionValidUsersGroupMembers = values[1];
      this.projectCollectionValidUsersGroupMembersMembers = values[2];
      this.checkProjectCollectionValidUsers();
      this.securityFindingsCount = this.findings.length;
      this.showCollectionSecuritySpinner = false;
    });
  }

  openFindingsDialog(chip: any) {
    if (this.findings.length) {
      const dialogRef = this.dialog.open(FindingDialogComponent, {
        width: '500px',
        data: { findings: this.findings }
      })
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

  refresh() {
    this.ngOnInit();
  }

  download() {
    const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);
    this.utilityService.downloadCsvFile(
      this.ruleService.getCsvArray(this.findings),
      `${collectionName}-SecurityGroups.csv`)
  }

  private checkProjectCollectionValidUsers() {
    const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);
    console.log(` collectionname: ${collectionName}`);
    const instanceName = this.azdoConnectionService.currentConnection?.instanceName;

    this.projectCollectionValidUsersGroupMembers?.value!.forEach(member => {
      const memberIdentity = this.projectCollectionValidUsersGroupMembers?.value?.find(
        identity => identity?.descriptor === member.descriptor
      )

      if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Administrators`.toUpperCase())
        this.checkProjectCollectionAdministrators(memberIdentity);

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Auditors`.toUpperCase())
        this.checkProjectCollectionGroup(memberIdentity, `${instanceName}Auditors`, "Project Collection Auditors");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Build Administrators`.toUpperCase())
        this.checkProjectCollectionGroup(memberIdentity, `${instanceName}BuildAdministrators`, "Project Collection Build Administrators");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Build Service Accounts`.toUpperCase())
        this.checkProjectCollectionGroup(memberIdentity, `${instanceName}BuildServiceAccounts`, "Project Collection Build Service Accounts");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Developers`.toUpperCase())
        this.checkProjectCollectionGroup(memberIdentity, `${instanceName}Developers`, "Project Collection Developers");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Operators`.toUpperCase())
        this.checkProjectCollectionGroup(memberIdentity, `${instanceName}Operators`, "Project Collection Operators");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Compliance Officers`.toUpperCase())
        this.checkProjectCollectionGroup(memberIdentity, `${instanceName}ComplianceOfficers`, "Project Collection Compliance Officers");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection DevOps Engineers`.toUpperCase())
        this.checkProjectCollectionGroup(memberIdentity, `${instanceName}DevOpsEngineers`, "Project Collection DevOps Engineers");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Release Engineers`.toUpperCase())
        this.checkProjectCollectionGroup(memberIdentity, `${instanceName}ReleaseEngineers`, "Project Collection Release Engineers");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Proxy Service Accounts`.toUpperCase())
        this.checkProjectCollectionProxyServiceAccounts(memberIdentity);

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Service Accounts`.toUpperCase())
        this.checkProjectCollectionServiceAccounts(memberIdentity);

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Test Service Accounts`.toUpperCase())
        this.checkProjectCollectionGroup(memberIdentity, `${instanceName}TestServiceAccounts`, "Project Collection Test Service Accounts");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Testers`.toUpperCase())
        this.checkProjectCollectionGroup(memberIdentity, `${instanceName}Testers`, "Project Collection Testers");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Security Service Group`.toUpperCase())
        this.checkSecurityServiceGroup(memberIdentity);

      else if (memberIdentity?.providerDisplayName?.toUpperCase().includes("Project Valid Users".toUpperCase())) {
        console.log(`Skipping ${memberIdentity.providerDisplayName}`)
        // this.checkSecurityServiceGroup(identity);
      }

      else {
        this.findings.push(
          this.ruleService.getFinding(
            this.ruleService.getUnexpectedCollectionGroupMemberRule("Project Collection Valid Users"),
            memberIdentity?.providerDisplayName!,
            memberIdentity?.descriptor!
          )
        )
      }
    });
  }

  /**
   * Checks the members of a collection level group that should map to a singular windows group:
   * 1. An Active Directory or Windows Group that follows naming convention [instance][GroupName]
   * @param identity The identity that matches the rules being checked by this method
   */
  private checkProjectCollectionGroup(identity: Identity, groupName: string, groupDisplayName: string): void {
    const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url)

    identity.members.forEach(descriptor => {
      const memberIdentity = this.projectCollectionValidUsersGroupMembersMembers?.value?.find(
        identity => identity?.descriptor === descriptor
      )
      if (!(memberIdentity?.providerDisplayName?.toUpperCase() === `${groupName}`.toUpperCase())
      ) {
        console.log(`Invalid Identity found in ${groupDisplayName}`);
        console.log(memberIdentity)
        this.findings.push(
          this.ruleService.getFinding(
            this.ruleService.getUnexpectedCollectionGroupMemberRule(groupDisplayName),
            memberIdentity?.providerDisplayName!,
            memberIdentity?.descriptor!
          )
        )
      }
    });
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

      if (!(memberIdentity?.providerDisplayName?.toUpperCase() === `[TEAM FOUNDATION]\\Team Foundation Administrators`.toUpperCase()
        || memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Project Collection Service Accounts`.toUpperCase()
        || memberIdentity?.providerDisplayName?.toUpperCase() === `${instanceName}Administrators`.toUpperCase()
        || memberIdentity?.providerDisplayName?.toUpperCase() === `Administrators`.toUpperCase()
        || memberIdentity?.providerDisplayName?.toUpperCase() === `[TEAM FOUNDATION]\\Azure DevOps Service Accounts`.toUpperCase())
      ) {
        this.findings.push(
          this.ruleService.getFinding(
            this.ruleService.getUnexpectedCollectionGroupMemberRule("Project Collection Administrators"),
            memberIdentity?.providerDisplayName!,
            memberIdentity?.descriptor!
          )
        )
      }
    });
  }

  /**
   * Checks the members of the Project Collection Service Accounts are:
   * 1. An OOTB well-known group
   * @param identity The identity that matches the rules being checked by this method
   */
  private checkProjectCollectionServiceAccounts(identity: Identity): void {
    const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url)
    const instanceName = this.azdoConnectionService.currentConnection?.instanceName;

    identity.members.forEach(descriptor => {
      const memberIdentity = this.projectCollectionValidUsersGroupMembersMembers?.value?.find(
        identity => identity?.descriptor === descriptor
      )

      if (!(memberIdentity?.providerDisplayName?.toUpperCase() === `[TEAM FOUNDATION]\\Azure DevOps Service Accounts`.toUpperCase()
        || memberIdentity?.providerDisplayName?.toUpperCase() === `[${collectionName}]\\Team Foundation Service Accounts`.toUpperCase())
      ) {
        this.findings.push(
          this.ruleService.getFinding(
            this.ruleService.getUnexpectedCollectionGroupMemberRule("Project Collection Service Accounts"),
            memberIdentity?.providerDisplayName!,
            memberIdentity?.descriptor!
          )
        )
      }
    });
  }

  /**
   * Checks the members of the Project Collection Proxy Service Accounts are:
   * 1. An OOTB well-known group
   * @param identity The identity that matches the rules being checked by this method
   */
  private checkProjectCollectionProxyServiceAccounts(identity: Identity): void {
    const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url)
    const instanceName = this.azdoConnectionService.currentConnection?.instanceName;

    identity.members.forEach(descriptor => {
      const memberIdentity = this.projectCollectionValidUsersGroupMembersMembers?.value?.find(
        identity => identity?.descriptor === descriptor
      )

      if (!(memberIdentity?.providerDisplayName?.toUpperCase() === `[TEAM FOUNDATION]\\Azure DevOps Proxy Service Accounts`.toUpperCase())
      ) {
        this.findings.push(
          this.ruleService.getFinding(
            this.ruleService.getUnexpectedCollectionGroupMemberRule("Project Collection Proxy Service Accounts"),
            memberIdentity?.providerDisplayName!,
            memberIdentity?.descriptor!
          )
        )
      }
    });
  }

  /**
   * Checks the members of the Security Service Group are:
   * 1. An Active Directory or Windows Group that follows naming convention [instance][Developers]
   * @param identity The identity that matches the rules being checked by this method
   */
  private checkSecurityServiceGroup(identity: Identity): void {
    const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url)
    const instanceName = this.azdoConnectionService.currentConnection?.instanceName;

    identity.members.forEach(descriptor => {
      const memberIdentity = this.projectCollectionValidUsersGroupMembersMembers?.value?.find(
        identity => identity?.descriptor === descriptor
      )

      if (!(memberIdentity?.customDisplayName?.toUpperCase().includes("Build Service".toUpperCase()))
      ) {
        console.log(`Invalid Identity found in SecurityServiceGroup`);
        console.log(memberIdentity)
        this.findings.push(
          this.ruleService.getFinding(
            this.ruleService.getUnexpectedCollectionGroupMemberRule("Security Service Group"),
            memberIdentity?.providerDisplayName!,
            memberIdentity?.descriptor!
          )
        )
      }
    });
  }

  private check(identity: Identity): void {
    // console.log("check");
    // Should only contain [{collection}] Project Collection Service Acounts
  }
}
