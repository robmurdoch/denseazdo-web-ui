import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, from, of, zip, forkJoin } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { saveAs } from 'file-saver'
import { Collection, ProjectInfo, SecurityNamespace, Identity } from '../core/shared/azdo-types';
import { AzDoService } from '../core/services/azdo.service';
import { AzDoConnectionService } from '../core/services/azdo-connection.service';
import { Finding, Rule } from '../core/shared/interfaces';
import { SnackbarService } from '../core/services/snackbar.service';
import { FindingDialogComponent } from '../finding-dialog/finding-dialog.component';
import { RuleService } from '../core/services/rule.service';
import { UtilityService } from '../core/services/utility.service';

@Component({
  selector: 'app-project-security',
  templateUrl: './project-security.component.html',
  styleUrls: ['./project-security.component.css']
})
export class ProjectSecurityComponent implements OnInit {
  @Input() project: ProjectInfo;

  showProjectSecuritySpinner: boolean = false;
  showSecurityFindingsBadge: boolean = false;
  securityFindingsCount: number = 0;
  // securityNamespaces: Collection<SecurityNamespace> = {};
  projectValidUsersGroup: Collection<Identity> = {};
  projectValidUsersGroupMembers: Collection<Identity> = {};
  projectValidUsersGroupMembersMembers: Collection<Identity> = {};
  findings: Finding[] = [];

  constructor(
    private azdoConnectionService: AzDoConnectionService,
    private azdoService: AzDoService,
    private snackBarService: SnackbarService,
    private ruleService: RuleService,
    public dialog: MatDialog,
    private utilityService: UtilityService
  ) {
    this.project = {}
  }

  ngOnInit(): void {
    this.showProjectSecuritySpinner = true;
    this.findings = [];
    from(this.azdoService.getProjectValidUsersGroup(this.project?.name!)).pipe(
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
      this.projectValidUsersGroup = values[0];
      this.projectValidUsersGroupMembers = values[1];
      this.projectValidUsersGroupMembersMembers = values[2];
      this.checkProjectValidUsers();
      this.securityFindingsCount = this.findings.length;
      this.showProjectSecuritySpinner = false
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
      `${collectionName}-${this.project.name}-SecurityGroups.csv`)
  }

  private checkProjectValidUsers() {
    const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);
    const instanceName = this.azdoConnectionService.currentConnection?.instanceName;

    this.projectValidUsersGroupMembers?.value!.forEach(member => {
      const memberIdentity = this.projectValidUsersGroupMembers?.value?.find(
        identity => identity?.descriptor === member.descriptor
      )

      if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${this.project.name}]\\Project Administrators`.toUpperCase())
        this.checkProjectGroup(memberIdentity, `Project Collection Administrators`, "Project Administrators");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${this.project.name}]\\Auditors`.toUpperCase())
        this.checkProjectGroup(memberIdentity, `Project Collection Auditors`, "Auditors");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${this.project.name}]\\Build Administrators`.toUpperCase())
        this.checkProjectGroup(memberIdentity, `Project Collection Build Administrators`, "Build Administrators");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${this.project.name}]\\Developers`.toUpperCase())
        this.checkProjectGroup(memberIdentity, `Project Collection Developers`, "Developers");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${this.project.name}]\\Operators`.toUpperCase())
        this.checkProjectGroup(memberIdentity, `Project Collection Operators`, "Operators");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${this.project.name}]\\Compliance Officers`.toUpperCase())
        this.checkProjectGroup(memberIdentity, `Project Collection Compliance Officers`, "Compliance Officers");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${this.project.name}]\\DevOps Engineers`.toUpperCase())
        this.checkProjectGroup(memberIdentity, `Project Collection DevOps Engineers`, "DevOps Engineers");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${this.project.name}]\\Release Engineers`.toUpperCase())
        this.checkProjectGroup(memberIdentity, `Project Collection Release Engineers`, "Release Engineers");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${this.project.name}]\\Testers`.toUpperCase())
        this.checkProjectGroup(memberIdentity, `Project Collection Testers`, "Testers");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${this.project.name}]\\Readers`.toUpperCase())
        this.checkProjectGroup(memberIdentity, `Project Collection Readers`, "Readers");

      else if (memberIdentity?.providerDisplayName?.toUpperCase() === `[${this.project.name}]\\Contributors`.toUpperCase())
        this.checkProjectGroupIsEmpty(memberIdentity, "Contributors");

      else if (memberIdentity?.providerDisplayName?.toUpperCase().includes("Team".toUpperCase())) {
        console.log(`Skipping ${memberIdentity.providerDisplayName}`)
        // this.checkSecurityServiceGroup(identity);
      }

      else {
        this.findings.push(
          this.ruleService.getFinding(
            this.ruleService.getUnexpectedProjectGroupMemberRule("Project Valid Users"),
            memberIdentity?.providerDisplayName!,
            memberIdentity?.descriptor!
          )
        )
      }
    });
  }

  /**
   * Checks the members of a project level group that should map to a collection level group:
   * @param identity The identity that matches the rules being checked by this method
   */
  private checkProjectGroup(identity: Identity, groupName: string, groupDisplayName: string): void {

    identity.members.forEach(descriptor => {
      const memberIdentity = this.projectValidUsersGroupMembersMembers?.value?.find(
        identity => identity?.descriptor === descriptor
      )
      if (!(memberIdentity?.providerDisplayName?.toUpperCase() === `${groupName}`.toUpperCase())
      ) {
        console.log(`Invalid Identity found in ${groupDisplayName}`);
        this.findings.push(
          this.ruleService.getFinding(
            this.ruleService.getUnexpectedProjectGroupMemberRule(groupDisplayName),
            memberIdentity?.providerDisplayName!,
            memberIdentity?.descriptor!
          )
        )
      }
    });
  }

  /**
   * Checks if a project level group is empty:
   * @param identity The identity that matches the rules being checked by this method
   */
  private checkProjectGroupIsEmpty(identity: Identity, groupDisplayName: string): void {

    identity.members.forEach(descriptor => {
      const memberIdentity = this.projectValidUsersGroupMembersMembers?.value?.find(
        identity => identity?.descriptor === descriptor
      )
      console.log(`Invalid Identity found in ${groupDisplayName}`);
      this.findings.push(
        this.ruleService.getFinding(
          this.ruleService.getUnexpectedProjectGroupMemberRule(groupDisplayName),
          memberIdentity?.providerDisplayName!,
          memberIdentity?.descriptor!
        )
      )
    });
  }
}
