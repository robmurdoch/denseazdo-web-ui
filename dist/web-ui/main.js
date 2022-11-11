(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\repos\dense-azdo\web-ui\src\main.ts */"zUnb");


/***/ }),

/***/ "4xmj":
/*!***************************************************!*\
  !*** ./src/app/core/services/snackbar.service.ts ***!
  \***************************************************/
/*! exports provided: SnackbarService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SnackbarService", function() { return SnackbarService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/snack-bar */ "dNgK");


class SnackbarService {
    constructor(snackbar) {
        this.snackbar = snackbar;
    }
    error(message) {
        return this.snackbar.open(message, 'Dismiss');
    }
    success(message) {
        return this.snackbar.open(message);
    }
    info(message) {
        return this.snackbar.open(message, undefined, { duration: 2000 });
    }
}
SnackbarService.ɵfac = function SnackbarService_Factory(t) { return new (t || SnackbarService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_1__["MatSnackBar"])); };
SnackbarService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: SnackbarService, factory: SnackbarService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "5ZpU":
/*!***********************************************!*\
  !*** ./src/app/core/services/azdo.service.ts ***!
  \***********************************************/
/*! exports provided: AzDoService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AzDoService", function() { return AzDoService; });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _azdo_connection_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./azdo-connection.service */ "xHjP");






class AzDoService {
    constructor(azDoConnectionService, http) {
        this.azDoConnectionService = azDoConnectionService;
        this.http = http;
        this.httpOptions = {
            headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpHeaders"]({})
        };
    }
    tryConnection(connectionInfo) {
        if (connectionInfo) {
            const url = `${connectionInfo.url}/_apis/projects?api-version=${this.azDoConnectionService.mostRecentApiVersion}`;
            return this.http.get(url, this.getHttpHeaders(connectionInfo));
        }
        else {
            return rxjs__WEBPACK_IMPORTED_MODULE_1__["EMPTY"];
        }
    }
    /**
     * GET Security Namespaces
     * From the docs: https://docs.microsoft.com/en-us/azure/devops/organizations/security/namespace-reference
     * Security namespaces are used to store access control lists (ACLs) on tokens. Data stored in security namespaces determines
     *  the level of access the entities have to perform a specific action on specific resources.
     */
    getSecurityNamespaces() {
        const connection = this.azDoConnectionService.currentConnection;
        if (connection) {
            const url = `${connection.url}/_apis/securitynamespaces?api-version=${connection.apiVersion}`;
            console.log(url);
            return this.http.get(url, this.getHttpHeaders(connection))
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError('getSecurityNamespaces', {})));
        }
        else {
            return rxjs__WEBPACK_IMPORTED_MODULE_1__["EMPTY"];
        }
    }
    /**
     * Get the folder heirarchy
     * https://docs.microsoft.com/en-us/rest/api/azure/devops/release/folders/list?view=azure-devops-rest-6.0
     * GET https://vsrm.dev.azure.com/{organization}/{project}/_apis/release/folders/{path}?api-version=6.0-preview.2
     */
    getReleaseFolders(projectName) {
        const connection = this.azDoConnectionService.currentConnection;
        if (connection) {
            const url = `${connection.url}/${projectName}/_apis/release/folders?api-version=${connection.apiVersion}-preview.1`;
            console.log(url);
            return this.http.get(url, this.getHttpHeaders(connection))
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError('getReleaseFolders', {})));
        }
        else {
            return rxjs__WEBPACK_IMPORTED_MODULE_1__["EMPTY"];
        }
    }
    // Security
    // Need the security namespace guid
    // Retrieve the Security Namespace
    // Extract the PermssionBits namespaceResponse.value.actions
    // If reporting a heirarchy of permissions c788c23e-1b46-4162-8f5e-d7585343b5de
    // * Retrieve the root node and report the root node
    // * Walk the child nodes recursiivly to the desired level and report each node
    // * Reporting a node
    // * * Get the Identity (from already retrieved data)
    // * * Get the acl for the token and parse the acesDictionary
    // * * Iterate the items in the acesDictionary
    // * * Iterate the permission bits NotSet is the default
    /**
     * GET Access Control Lists
     * From the docs: https://docs.microsoft.com/en-us/azure/devops/organizations/security/namespace-reference
     * Security namespaces are used to store access control lists (ACLs) on tokens. Data stored in security namespaces determines
     *  the level of access the entities have to perform a specific action on specific resources.
     */
    getAccessControlLists(namespace, token) {
        const connection = this.azDoConnectionService.currentConnection;
        if (connection) {
            const url = `${connection.url}/_apis/accesscontrollists/${namespace}?token=${token}&includeextendedinfo=true&recurse=true&api-version=${connection.apiVersion}`;
            console.log(url);
            return this.http.get(url, this.getHttpHeaders(connection))
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError('getAccessControlLists', {})));
        }
        else {
            return rxjs__WEBPACK_IMPORTED_MODULE_1__["EMPTY"];
        }
    }
    getProjectValidUsersGroup(projectName) {
        const connection = this.azDoConnectionService.currentConnection;
        const url = `${connection.url}/_apis/identities?searchFilter=General&filterValue=[${projectName}]\\Project%20Valid%20Users&queryMembership=direct&api-version=${connection.apiVersion}`;
        console.log(url);
        return this.http.get(url, this.getHttpHeaders(connection))
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError('getProjectValidUsersGroup', {})));
    }
    // TODO: get the Special EveryoneApplicationGroup instead
    getProjectCollectionValidUsersGroup() {
        const connection = this.azDoConnectionService.currentConnection;
        const url = `${connection.url}/_apis/identities?searchFilter=General&filterValue=Project%20Collection%20Valid%20Users&queryMembership=direct&api-version=${connection.apiVersion}`;
        console.log(url);
        return this.http.get(url, this.getHttpHeaders(connection))
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError('getProjectCollectionValidUsersGroup', {})));
    }
    // Get the everyonegroup's membership identities
    getIdentities(memberIds) {
        const connection = this.azDoConnectionService.currentConnection;
        // const url = `${connection.url}/_apis/identities?descriptors=${descriptors.join()}&queryMembership=direct&api-version=${connection.apiVersion}`
        const url = `${connection.url}/_apis/identities?identityIds=${memberIds.join()}&queryMembership=direct&api-version=${connection.apiVersion}`;
        console.log(url);
        return this.http.get(url, this.getHttpHeaders(connection))
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError('getIdentities', {})));
    }
    /** GET Projects from the server */
    getProjects() {
        const connection = this.azDoConnectionService.currentConnection;
        if (connection) {
            const url = `${connection.url}/_apis/projects?api-version=${connection.apiVersion}`;
            console.log(url);
            return this.http.get(url, this.getHttpHeaders(connection))
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(this.handleError('getProjects', {})));
        }
        else {
            return rxjs__WEBPACK_IMPORTED_MODULE_1__["EMPTY"];
        }
    }
    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    handleError(operation = 'operation', result) {
        return (error) => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log the full error to console for now
            // TODO: send human readable problems to the ui (a snack bar)
            // this.log(`${operation} failed: ${error.message}`);
            // Let the app keep running by returning an empty result.
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(result);
        };
    }
    log(message) {
        // TODO: emit in UI somewhere
        console.log(message);
    }
    getHttpHeaders(connectionInfo) {
        return {
            headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpHeaders"]({
                observe: 'response',
                Authorization: 'Basic ' + btoa('' + ':' + connectionInfo.token + '')
            })
        };
    }
}
AzDoService.ɵfac = function AzDoService_Factory(t) { return new (t || AzDoService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_azdo_connection_service__WEBPACK_IMPORTED_MODULE_4__["AzDoConnectionService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpClient"])); };
AzDoService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({ token: AzDoService, factory: AzDoService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "6AOp":
/*!**********************************************!*\
  !*** ./src/app/project/project.component.ts ***!
  \**********************************************/
/*! exports provided: ProjectComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProjectComponent", function() { return ProjectComponent; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _finding_dialog_finding_dialog_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../finding-dialog/finding-dialog.component */ "ZOUa");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _core_services_azdo_connection_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/services/azdo-connection.service */ "xHjP");
/* harmony import */ var _core_services_azdo_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/services/azdo.service */ "5ZpU");
/* harmony import */ var _core_services_snackbar_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../core/services/snackbar.service */ "4xmj");
/* harmony import */ var _core_services_rule_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../core/services/rule.service */ "Zp6z");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/dialog */ "0IaG");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/progress-spinner */ "Xa2L");
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/chips */ "A5z7");
/* harmony import */ var _angular_material_badge__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/badge */ "TU8p");













function ProjectComponent_mat_spinner_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "mat-spinner", 3);
} }
function ProjectComponent_mat_chip_list_2_Template(rf, ctx) { if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-chip-list", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "mat-chip", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ProjectComponent_mat_chip_list_2_Template_mat_chip_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r3); const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r2.openFindingsDialog("securityFindings"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "Security Groups");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "mat-chip");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "Custom Security Groups WHy?");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("selectable", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpropertyInterpolate"]("matBadge", ctx_r1.securityFindingsCount);
} }
class ProjectComponent {
    constructor(azdoConnectionService, azdoService, snackBarService, ruleService, dialog) {
        this.azdoConnectionService = azdoConnectionService;
        this.azdoService = azdoService;
        this.snackBarService = snackBarService;
        this.ruleService = ruleService;
        this.dialog = dialog;
        this.showProjectSecuritySpinner = false;
        this.showSecurityFindingsBadge = false;
        this.securityFindingsCount = 0;
        this.securityNamespaces = {};
        this.projectCollectionValidUsersGroup = {};
        this.projectCollectionValidUsersGroupMembers = {};
        this.projectCollectionValidUsersGroupMembersMembers = {};
        this.findings = [];
    }
    ngOnInit() {
        this.showProjectSecuritySpinner = true;
        Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["from"])(this.azdoService.getProjectCollectionValidUsersGroup()).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["concatMap"])(topLevelGroupResponse => {
            const topLevelGroup = topLevelGroupResponse === null || topLevelGroupResponse === void 0 ? void 0 : topLevelGroupResponse.value[0];
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["forkJoin"])([
                Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(topLevelGroupResponse),
                this.azdoService.getIdentities(topLevelGroup.memberIds)
            ]);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["concatMap"])(([response1, response2]) => {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["forkJoin"])([
                Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(response1),
                Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(response2),
                this.azdoService.getIdentities(this.combineMemberIds(response2 === null || response2 === void 0 ? void 0 : response2.value))
            ]);
        })).subscribe(values => {
            this.projectCollectionValidUsersGroup = values[0];
            this.projectCollectionValidUsersGroupMembers = values[1];
            this.projectCollectionValidUsersGroupMembersMembers = values[2];
            this.checkProjectCollectionValidUsers();
            this.securityFindingsCount = this.findings.length;
            this.showProjectSecuritySpinner
                = false;
        });
    }
    openFindingsDialog(chip) {
        if (this.findings.length) {
            const dialogRef = this.dialog.open(_finding_dialog_finding_dialog_component__WEBPACK_IMPORTED_MODULE_2__["FindingDialogComponent"], {
                width: '500px',
                data: { findings: this.findings }
            });
        }
        else {
            // Show some eyecandy telling them how great their security is and what was checked
        }
    }
    combineMemberIds(identities) {
        let memberIds = [];
        identities.forEach(identity => {
            memberIds = memberIds.concat(identity.memberIds);
        });
        return memberIds;
    }
    checkProjectCollectionValidUsers() {
        var _a, _b;
        const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);
        const instanceName = (_a = this.azdoConnectionService.currentConnection) === null || _a === void 0 ? void 0 : _a.instanceName;
        (_b = this.projectCollectionValidUsersGroupMembers) === null || _b === void 0 ? void 0 : _b.value.forEach(member => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
            const memberIdentity = (_b = (_a = this.projectCollectionValidUsersGroupMembers) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.find(identity => (identity === null || identity === void 0 ? void 0 : identity.descriptor) === member.descriptor);
            if (((_c = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _c === void 0 ? void 0 : _c.toUpperCase()) === `[${collectionName}]\\Project Collection Administrators`.toUpperCase()) {
                this.checkProjectCollectionAdministrators(memberIdentity);
            }
            else if (((_d = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _d === void 0 ? void 0 : _d.toUpperCase()) === `[${collectionName}]\\Project Collection Auditors`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}Auditors`, 'Project Collection Auditors');
            }
            else if (((_e = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _e === void 0 ? void 0 : _e.toUpperCase()) === `[${collectionName}]\\Project Collection Build Administrators`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}BuildAdministrators`, 'Project Collection Build Administrators');
            }
            else if (((_f = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _f === void 0 ? void 0 : _f.toUpperCase()) === `[${collectionName}]\\Project Collection Build Service Accounts`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}BuildServiceAccounts`, 'Project Collection Build Service Accounts');
            }
            else if (((_g = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _g === void 0 ? void 0 : _g.toUpperCase()) === `[${collectionName}]\\Project Collection Developers`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}Developers`, 'Project Collection Developers');
            }
            else if (((_h = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _h === void 0 ? void 0 : _h.toUpperCase()) === `[${collectionName}]\\Project Collection Operators`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}Operators`, 'Project Collection Operators');
            }
            else if (((_j = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _j === void 0 ? void 0 : _j.toUpperCase()) === `[${collectionName}]\\Project Collection Compliance Officers`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}ComplianceOfficers`, 'Project Collection Compliance Officers');
            }
            else if (((_k = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _k === void 0 ? void 0 : _k.toUpperCase()) === `[${collectionName}]\\Project Collection DevOps Engineers`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}DevOpsEngineers`, 'Project Collection DevOps Engineers');
            }
            else if (((_l = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _l === void 0 ? void 0 : _l.toUpperCase()) === `[${collectionName}]\\Project Collection Release Engineers`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}ReleaseEngineers`, 'Project Collection Release Engineers');
            }
            else if (((_m = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _m === void 0 ? void 0 : _m.toUpperCase()) === `[${collectionName}]\\Project Collection Proxy Service Accounts`.toUpperCase()) {
                this.checkProjectCollectionProxyServiceAccounts(memberIdentity);
            }
            else if (((_o = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _o === void 0 ? void 0 : _o.toUpperCase()) === `[${collectionName}]\\Project Collection Service Accounts`.toUpperCase()) {
                this.checkProjectCollectionServiceAccounts(memberIdentity);
            }
            else if (((_p = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _p === void 0 ? void 0 : _p.toUpperCase()) === `[${collectionName}]\\Project Collection Test Service Accounts`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}TestServiceAccounts`, 'Project Collection Test Service Accounts');
            }
            else if (((_q = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _q === void 0 ? void 0 : _q.toUpperCase()) === `[${collectionName}]\\Project Collection Testers`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}Testers`, 'Project Collection Testers');
            }
            else if (((_r = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _r === void 0 ? void 0 : _r.toUpperCase()) === `[${collectionName}]\\Security Service Group`.toUpperCase()) {
                this.checkSecurityServiceGroup(memberIdentity);
            }
            else if ((_s = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _s === void 0 ? void 0 : _s.toUpperCase().includes('Project Valid Users'.toUpperCase())) {
                console.log(`Skipping ${memberIdentity.providerDisplayName}`);
                // this.checkSecurityServiceGroup(identity);
            }
            else {
                this.findings.push(this.ruleService.getFinding(this.ruleService.getUnexpectedCollectionGroupMemberRule('Project Collection Valid Users'), memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName, memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.descriptor));
            }
        });
    }
    /**
     * Checks the members of a collection level group that should map to a singular windows group:
     * 1. An Active Directory or Windows Group that follows naming convention [instance][GroupName]
     * @param identity The identity that matches the rules being checked by this method
     */
    checkProjectCollectionGroup(identity, groupName, groupDisplayName) {
        const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);
        identity.members.forEach(descriptor => {
            var _a, _b, _c;
            const memberIdentity = (_b = (_a = this.projectCollectionValidUsersGroupMembersMembers) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.find(matchedidentity => (identity === null || identity === void 0 ? void 0 : identity.descriptor) === descriptor);
            if (!(((_c = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _c === void 0 ? void 0 : _c.toUpperCase()) === `${groupName}`.toUpperCase())) {
                console.log(`Invalid Identity found in ${groupDisplayName}`);
                console.log(memberIdentity);
                this.findings.push(this.ruleService.getFinding(this.ruleService.getUnexpectedCollectionGroupMemberRule(groupDisplayName), memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName, memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.descriptor));
            }
        });
    }
    /**
     * Checks the members of the Project Collection Administrators Group are:
     * 1. An Active Directory or Windows Group that follows naming convention [instance]-[Administrators]
     * 2. An OOTB well-known group
     * @param identity The identity that matches the rules being checked by this method
     */
    checkProjectCollectionAdministrators(identity) {
        var _a;
        const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);
        const instanceName = (_a = this.azdoConnectionService.currentConnection) === null || _a === void 0 ? void 0 : _a.instanceName;
        identity.members.forEach(descriptor => {
            var _a, _b, _c, _d, _e, _f, _g;
            const memberIdentity = (_b = (_a = this.projectCollectionValidUsersGroupMembersMembers) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.find(matchedidentity => (identity === null || identity === void 0 ? void 0 : identity.descriptor) === descriptor);
            if (!(((_c = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _c === void 0 ? void 0 : _c.toUpperCase()) === `[TEAM FOUNDATION]\\Team Foundation Administrators`.toUpperCase()
                || ((_d = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _d === void 0 ? void 0 : _d.toUpperCase()) === `[${collectionName}]\\Project Collection Service Accounts`.toUpperCase()
                || ((_e = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _e === void 0 ? void 0 : _e.toUpperCase()) === `${instanceName}Administrators`.toUpperCase()
                || ((_f = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _f === void 0 ? void 0 : _f.toUpperCase()) === `Administrators`.toUpperCase()
                || ((_g = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _g === void 0 ? void 0 : _g.toUpperCase()) === `[TEAM FOUNDATION]\\Azure DevOps Service Accounts`.toUpperCase())) {
                this.findings.push(this.ruleService.getFinding(this.ruleService.getUnexpectedCollectionGroupMemberRule('Project Collection Administrators'), memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName, memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.descriptor));
            }
        });
    }
    /**
     * Checks the members of the Project Collection Service Accounts are:
     * 1. An OOTB well-known group
     * @param identity The identity that matches the rules being checked by this method
     */
    checkProjectCollectionServiceAccounts(identity) {
        var _a;
        const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);
        const instanceName = (_a = this.azdoConnectionService.currentConnection) === null || _a === void 0 ? void 0 : _a.instanceName;
        identity.members.forEach(descriptor => {
            var _a, _b, _c, _d;
            const memberIdentity = (_b = (_a = this.projectCollectionValidUsersGroupMembersMembers) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.find(matchedidentity => (identity === null || identity === void 0 ? void 0 : identity.descriptor) === descriptor);
            if (!(((_c = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _c === void 0 ? void 0 : _c.toUpperCase()) === `[TEAM FOUNDATION]\\Azure DevOps Service Accounts`.toUpperCase()
                || ((_d = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _d === void 0 ? void 0 : _d.toUpperCase()) === `[${collectionName}]\\Team Foundation Service Accounts`.toUpperCase())) {
                this.findings.push(this.ruleService.getFinding(this.ruleService.getUnexpectedCollectionGroupMemberRule('Project Collection Service Accounts'), memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName, memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.descriptor));
            }
        });
    }
    /**
     * Checks the members of the Project Collection Proxy Service Accounts are:
     * 1. An OOTB well-known group
     * @param identity The identity that matches the rules being checked by this method
     */
    checkProjectCollectionProxyServiceAccounts(identity) {
        var _a;
        const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);
        const instanceName = (_a = this.azdoConnectionService.currentConnection) === null || _a === void 0 ? void 0 : _a.instanceName;
        identity.members.forEach(descriptor => {
            var _a, _b, _c;
            const memberIdentity = (_b = (_a = this.projectCollectionValidUsersGroupMembersMembers) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.find(matchedidentity => (identity === null || identity === void 0 ? void 0 : identity.descriptor) === descriptor);
            if (!(((_c = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _c === void 0 ? void 0 : _c.toUpperCase()) === `[TEAM FOUNDATION]\\Azure DevOps Proxy Service Accounts`.toUpperCase())) {
                this.findings.push(this.ruleService.getFinding(this.ruleService.getUnexpectedCollectionGroupMemberRule('Project Collection Proxy Service Accounts'), memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName, memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.descriptor));
            }
        });
    }
    /**
     * Checks the members of the Security Service Group are:
     * 1. An Active Directory or Windows Group that follows naming convention [instance][Developers]
     * @param identity The identity that matches the rules being checked by this method
     */
    checkSecurityServiceGroup(identity) {
        var _a;
        const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);
        const instanceName = (_a = this.azdoConnectionService.currentConnection) === null || _a === void 0 ? void 0 : _a.instanceName;
        identity.members.forEach(descriptor => {
            var _a, _b, _c;
            const memberIdentity = (_b = (_a = this.projectCollectionValidUsersGroupMembersMembers) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.find(matchedidentity => (identity === null || identity === void 0 ? void 0 : identity.descriptor) === descriptor);
            if (!((_c = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.customDisplayName) === null || _c === void 0 ? void 0 : _c.toUpperCase().includes('Build Service'.toUpperCase()))) {
                console.log(`Invalid Identity found in SecurityServiceGroup`);
                console.log(memberIdentity);
                this.findings.push(this.ruleService.getFinding(this.ruleService.getUnexpectedCollectionGroupMemberRule('Security Service Group'), memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName, memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.descriptor));
            }
        });
    }
}
ProjectComponent.ɵfac = function ProjectComponent_Factory(t) { return new (t || ProjectComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_azdo_connection_service__WEBPACK_IMPORTED_MODULE_4__["AzDoConnectionService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_azdo_service__WEBPACK_IMPORTED_MODULE_5__["AzDoService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_snackbar_service__WEBPACK_IMPORTED_MODULE_6__["SnackbarService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_rule_service__WEBPACK_IMPORTED_MODULE_7__["RuleService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_8__["MatDialog"])); };
ProjectComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: ProjectComponent, selectors: [["app-project"]], decls: 3, vars: 2, consts: [[1, "centered"], ["diameter", "30", "mode", "indeterminate", 4, "ngIf"], ["aria-label", "Results", 3, "selectable", 4, "ngIf"], ["diameter", "30", "mode", "indeterminate"], ["aria-label", "Results", 3, "selectable"], ["matBadgeColor", "warn", 3, "matBadge", "click"]], template: function ProjectComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, ProjectComponent_mat_spinner_1_Template, 1, 0, "mat-spinner", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](2, ProjectComponent_mat_chip_list_2_Template, 5, 2, "mat-chip-list", 2);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.showProjectSecuritySpinner);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.showProjectSecuritySpinner);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_9__["NgIf"], _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_10__["MatSpinner"], _angular_material_chips__WEBPACK_IMPORTED_MODULE_11__["MatChipList"], _angular_material_chips__WEBPACK_IMPORTED_MODULE_11__["MatChip"], _angular_material_badge__WEBPACK_IMPORTED_MODULE_12__["MatBadge"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJwcm9qZWN0LmNvbXBvbmVudC5jc3MifQ== */"] });


/***/ }),

/***/ "9Lsy":
/*!*****************************************************!*\
  !*** ./src/app/core/services/azdo-cache.service.ts ***!
  \*****************************************************/
/*! exports provided: AzDoCacheService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AzDoCacheService", function() { return AzDoCacheService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _azdo_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./azdo.service */ "5ZpU");


class AzDoCacheService {
    // everyoneGroup: Collection<Identity> = {};
    // everyone: Collection<Identity> = {};
    constructor(azdoService) {
        this.azdoService = azdoService;
        this.securityNamespaces = {};
        this.releaseManagementSecurityNamespaceId = 'c788c23e-1b46-4162-8f5e-d7585343b5de';
        this.identities = [];
        this.azdoService.getSecurityNamespaces()
            .subscribe(results => {
            this.securityNamespaces = results;
        });
        // this.cacheData();
    }
    getSecurityNamespace(namespaceId) {
        var _a;
        const returnNamespace = (_a = this.securityNamespaces.value) === null || _a === void 0 ? void 0 : _a.find(securityNamespace => (securityNamespace === null || securityNamespace === void 0 ? void 0 : securityNamespace.namespaceId) === namespaceId);
        return returnNamespace;
    }
    cacheIdentities(identityCollection) {
        this.identities = this.identities.concat(identityCollection.value);
    }
    getIdentity(descriptor) {
        const returnIdentity = this.identities.find(identity => (identity === null || identity === void 0 ? void 0 : identity.descriptor) === descriptor);
        return returnIdentity;
    }
}
AzDoCacheService.ɵfac = function AzDoCacheService_Factory(t) { return new (t || AzDoCacheService)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"](_azdo_service__WEBPACK_IMPORTED_MODULE_1__["AzDoService"])); };
AzDoCacheService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: AzDoCacheService, factory: AzDoCacheService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "AytR":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "NNjt":
/*!****************************************************!*\
  !*** ./src/app/collection/collection.component.ts ***!
  \****************************************************/
/*! exports provided: CollectionComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CollectionComponent", function() { return CollectionComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _core_services_azdo_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/services/azdo.service */ "5ZpU");
/* harmony import */ var _core_services_azdo_cache_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../core/services/azdo-cache.service */ "9Lsy");



class CollectionComponent {
    constructor(azdoService, azDoCacheService) {
        this.azdoService = azdoService;
        this.azDoCacheService = azDoCacheService;
        this.projects = {};
        this.projectValidUsersGroup = {};
    }
    ngOnInit() {
        this.azdoService.getProjects()
            .subscribe(results => {
            this.projects = results;
        });
    }
}
CollectionComponent.ɵfac = function CollectionComponent_Factory(t) { return new (t || CollectionComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_core_services_azdo_service__WEBPACK_IMPORTED_MODULE_1__["AzDoService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_core_services_azdo_cache_service__WEBPACK_IMPORTED_MODULE_2__["AzDoCacheService"])); };
CollectionComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: CollectionComponent, selectors: [["app-collection"]], decls: 0, vars: 0, template: function CollectionComponent_Template(rf, ctx) { }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJjb2xsZWN0aW9uLmNvbXBvbmVudC5jc3MifQ== */"] });


/***/ }),

/***/ "Po2L":
/*!******************************************************************!*\
  !*** ./src/app/connection-dialog/connection-dialog.component.ts ***!
  \******************************************************************/
/*! exports provided: ConnectionDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConnectionDialogComponent", function() { return ConnectionDialogComponent; });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/dialog */ "0IaG");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _core_services_azdo_connection_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/services/azdo-connection.service */ "xHjP");
/* harmony import */ var _core_services_azdo_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/services/azdo.service */ "5ZpU");
/* harmony import */ var _core_services_snackbar_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../core/services/snackbar.service */ "4xmj");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/form-field */ "kmnG");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/input */ "qFsG");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/button */ "bTqV");
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/progress-spinner */ "Xa2L");














function ConnectionDialogComponent_mat_error_7_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r0.getUrlErrorMessages());
} }
function ConnectionDialogComponent_mat_error_13_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r1.getTokenErrorMessages());
} }
function ConnectionDialogComponent_mat_error_19_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx_r2.getInstanceErrorMessages());
} }
function ConnectionDialogComponent_mat_spinner_25_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "mat-spinner", 12);
} }
class ConnectionDialogComponent {
    constructor(azDoConnectionService, azDoService, snackbar, fb, dialogRef, data) {
        this.azDoConnectionService = azDoConnectionService;
        this.azDoService = azDoService;
        this.snackbar = snackbar;
        this.fb = fb;
        this.dialogRef = dialogRef;
        this.data = data;
        // FormBuilder'up a FormGroup for validating user input
        this.connectionForm = this.fb.group({
            inputUrl: [this.data.url, [
                    _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required,
                    _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].pattern('^(http:\/\/|https:\/\/).*')
                ]],
            inputToken: [this.data.token, [
                    _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required,
                    _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].minLength(40)
                ]],
            instance: [this.data.instance, [
                    _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].required,
                    _angular_forms__WEBPACK_IMPORTED_MODULE_0__["Validators"].minLength(3)
                ]]
        });
        // Eye candy while user waits to validate a connection
        this.showSpinner = false;
        this.azDoConnectionService = azDoConnectionService;
        this.azDoService = azDoService;
    }
    // Some convience methods used in the view to referece the model
    get inputUrl() { return this.connectionForm.get('inputUrl'); }
    get inputToken() { return this.connectionForm.get('inputToken'); }
    get instance() { return this.connectionForm.get('instance'); }
    getUrlErrorMessages() {
        var _a, _b;
        return ((_a = this.inputUrl) === null || _a === void 0 ? void 0 : _a.hasError('required')) ? 'Url is required' :
            ((_b = this.inputUrl) === null || _b === void 0 ? void 0 : _b.hasError('pattern')) ? 'Invalid url: http://host/collection or https://org.visualstudio.com' : '';
    }
    getTokenErrorMessages() {
        var _a, _b;
        return ((_a = this.inputToken) === null || _a === void 0 ? void 0 : _a.hasError('required')) ? 'Token is required' :
            ((_b = this.inputToken) === null || _b === void 0 ? void 0 : _b.hasError('minlength')) ? 'Value must be at least 40 characters' : '';
    }
    getInstanceErrorMessages() {
        var _a, _b;
        return ((_a = this.instance) === null || _a === void 0 ? void 0 : _a.hasError('required')) ? 'Instance is required' :
            ((_b = this.instance) === null || _b === void 0 ? void 0 : _b.hasError('minlength')) ? 'Value must be at least 3 characters, e.g. TFS' : '';
    }
    // Supports canceling the dialog without changing any state
    onCancelClick() {
        this.dialogRef.close();
    }
    /**
     * Tries an Azure DevOps (Server and Services) connection to determine the version of the
     * API supported by the endpoint. Attempts to trap some common errors to better inform the
     * user (but this is largely untested).
     *
     * If the version is successfully determined, the new connection becomes the current
     * connection that the system uses for all AzDO requests.
     *
     * Experiements:
     * Modeling an attempted connection: e.g. AttemptedConnection interface that holds the
     *      API Version and error messages. I had to add a count for the happy path when
     *      projects are returned. TypeScript (Angular) realized the type which clashed with the
     *      normal result exposed for Subscribe. Need to attempt subclassing that adding my
     *      payload.
     * Moving this code to AzDoService: Unsuccessfull for a couple reasons:
     *      1: I wanted to show a spinner for long running requests
     *      2: I wanted to validate the form input before attempting the request
     *      3: I wanted the request to complete before hiding the spinner, showing errors,
     *          and closing the dialog.
     *
     * TODO:
     *      1. Change for each new version of the REST API.
     *      2. Implement Preview API support
     *      3. Extrac the collection (Server) or organization (Services)
     */
    onOkClick() {
        var _a, _b, _c;
        if (this.connectionForm.valid) {
            const newConnection = {
                url: (_a = this.inputUrl) === null || _a === void 0 ? void 0 : _a.value,
                token: (_b = this.inputToken) === null || _b === void 0 ? void 0 : _b.value,
                instanceName: (_c = this.instance) === null || _c === void 0 ? void 0 : _c.value
            };
            this.showSpinner = true;
            this.azDoService.tryConnection(newConnection)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["catchError"])(error => {
                return this.azDoConnectionService.getApiVersionFromError(error);
            }))
                .subscribe((result) => {
                if (this.azDoConnectionService.apiVersionFound(result, newConnection)) {
                    this.azDoConnectionService.addConnection(newConnection);
                    this.azDoConnectionService.setConnection(newConnection);
                    this.showSpinner = false;
                    this.dialogRef.close();
                }
                else {
                    this.showSpinner = false;
                    this.snackbar.error(`(${result.status}) ${result.statusText}`);
                }
            });
        }
    }
}
ConnectionDialogComponent.ɵfac = function ConnectionDialogComponent_Factory(t) { return new (t || ConnectionDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_azdo_connection_service__WEBPACK_IMPORTED_MODULE_4__["AzDoConnectionService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_azdo_service__WEBPACK_IMPORTED_MODULE_5__["AzDoService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_snackbar_service__WEBPACK_IMPORTED_MODULE_6__["SnackbarService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormBuilder"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])); };
ConnectionDialogComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: ConnectionDialogComponent, selectors: [["app-connection-dialog"]], decls: 26, vars: 5, consts: [["mat-dialog-title", ""], ["mat-dialog-content", "", 3, "formGroup"], ["appearance", "fill"], ["id", "inputUrl", "matInput", "", "required", "", "formControlName", "inputUrl"], [4, "ngIf"], [1, "field-spacer"], ["id", "inputToken", "matInput", "", "required", "", "formControlName", "inputToken"], ["id", "instance", "matInput", "", "required", "", "formControlName", "instance"], ["mat-dialog-actions", ""], ["mat-button", "", 3, "click"], ["mat-button", "", "cdkFocusInitial", "", 3, "click"], ["diameter", "35", "mode", "indeterminate", 4, "ngIf"], ["diameter", "35", "mode", "indeterminate"]], template: function ConnectionDialogComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "h1", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "New Connection");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "mat-form-field", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5, "Collection or Organization Url");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](6, "input", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](7, ConnectionDialogComponent_mat_error_7_Template, 2, 1, "mat-error", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](8, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "mat-form-field", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11, "Token (save only)");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](12, "input", 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](13, ConnectionDialogComponent_mat_error_13_Template, 2, 1, "mat-error", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](14, "div", 5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](15, "mat-form-field", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](16, "mat-label");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](17, "Instance");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](18, "input", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](19, ConnectionDialogComponent_mat_error_19_Template, 2, 1, "mat-error", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "div", 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](21, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ConnectionDialogComponent_Template_button_click_21_listener() { return ctx.onCancelClick(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](22, "Cancel");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](23, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ConnectionDialogComponent_Template_button_click_23_listener() { return ctx.onOkClick(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](24, "Ok");
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](25, ConnectionDialogComponent_mat_spinner_25_Template, 1, 0, "mat-spinner", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroup", ctx.connectionForm);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", (ctx.inputUrl == null ? null : ctx.inputUrl.invalid) && ((ctx.inputUrl == null ? null : ctx.inputUrl.dirty) || (ctx.inputUrl == null ? null : ctx.inputUrl.touched)));
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", (ctx.inputToken == null ? null : ctx.inputToken.invalid) && ((ctx.inputToken == null ? null : ctx.inputToken.dirty) || (ctx.inputToken == null ? null : ctx.inputToken.touched)));
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", (ctx.instance == null ? null : ctx.instance.invalid) && ((ctx.instance == null ? null : ctx.instance.dirty) || (ctx.instance == null ? null : ctx.instance.touched)));
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.showSpinner === true);
    } }, directives: [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__["MatDialogTitle"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__["MatDialogContent"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatusGroup"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormGroupDirective"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__["MatFormField"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__["MatLabel"], _angular_material_input__WEBPACK_IMPORTED_MODULE_8__["MatInput"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["RequiredValidator"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_0__["FormControlName"], _angular_common__WEBPACK_IMPORTED_MODULE_9__["NgIf"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_1__["MatDialogActions"], _angular_material_button__WEBPACK_IMPORTED_MODULE_10__["MatButton"], _angular_material_form_field__WEBPACK_IMPORTED_MODULE_7__["MatError"], _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_11__["MatSpinner"]], styles: ["mat-form-field[_ngcontent-%COMP%] {\r\n    width: 100%;\r\n    margin-top: 10px;\r\n  }\r\n\r\nmat-spinner[_ngcontent-%COMP%]{\r\n  margin-left: 20px;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbm5lY3Rpb24tZGlhbG9nLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxXQUFXO0lBQ1gsZ0JBQWdCO0VBQ2xCOztBQUVGO0VBQ0UsaUJBQWlCO0FBQ25CIiwiZmlsZSI6ImNvbm5lY3Rpb24tZGlhbG9nLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJtYXQtZm9ybS1maWVsZCB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIG1hcmdpbi10b3A6IDEwcHg7XHJcbiAgfVxyXG5cclxubWF0LXNwaW5uZXJ7XHJcbiAgbWFyZ2luLWxlZnQ6IDIwcHg7XHJcbn0iXX0= */"] });


/***/ }),

/***/ "Sy1n":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _connection_dialog_connection_dialog_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./connection-dialog/connection-dialog.component */ "Po2L");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _core_services_azdo_connection_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/services/azdo-connection.service */ "xHjP");
/* harmony import */ var _core_services_azdo_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/services/azdo.service */ "5ZpU");
/* harmony import */ var _core_services_azdo_cache_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/services/azdo-cache.service */ "9Lsy");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/dialog */ "0IaG");
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/toolbar */ "/t3+");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/button */ "bTqV");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/icon */ "NFeN");
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/sidenav */ "XhcP");
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/list */ "MutI");
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/menu */ "STbY");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/card */ "Wp6s");
/* harmony import */ var _collection_collection_security_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./collection/collection-security.component */ "k6J9");
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/progress-spinner */ "Xa2L");
/* harmony import */ var _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/flex-layout/flex */ "XiUz");
/* harmony import */ var _project_project_security_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./project/project-security.component */ "uWAI");
/* harmony import */ var _collection_strip_name_pipe__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./collection/strip-name.pipe */ "v1P3");



















function AppComponent_button_23_Template(rf, ctx) { if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AppComponent_button_23_Template_button_click_0_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r8); const connection_r6 = ctx.$implicit; const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](); return ctx_r7.connectionClicked(connection_r6); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const connection_r6 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate2"]("", connection_r6.url, ":", connection_r6.apiVersion, "");
} }
function AppComponent_div_27_Template(rf, ctx) { if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "mat-card");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "mat-card-header");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "mat-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](5, "stripName");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "mat-card-content");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "app-collection-security", null, 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "mat-card-actions");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AppComponent_div_27_Template_button_click_10_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r11); const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](8); return _r9.download(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "save_alt");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "Save ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AppComponent_div_27_Template_button_click_14_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r11); const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](8); return _r9.refresh(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "refresh");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, "refresh ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](5, 1, ctx_r3.azDoConnectionService.currentConnection.url));
} }
function AppComponent_div_28_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "mat-spinner", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} }
function AppComponent_div_29_mat_card_1_Template(rf, ctx) { if (rf & 1) {
    const _r17 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-card", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "mat-card-header");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "mat-card-title");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "mat-card-subtitle");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "mat-card-content");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](8, "app-project-security", 23, 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "mat-card-actions");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AppComponent_div_29_mat_card_1_Template_button_click_11_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r17); const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](9); return _r15.download(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](12, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](13, "save_alt");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](14, "Save ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "button", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AppComponent_div_29_mat_card_1_Template_button_click_15_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r17); const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](9); return _r15.refresh(); });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](17, "refresh");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](18, "refresh ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const project_r14 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](project_r14.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](project_r14.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("project", project_r14);
} }
function AppComponent_div_29_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, AppComponent_div_29_mat_card_1_Template, 19, 3, "mat-card", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r5.projects.value);
} }
class AppComponent {
    constructor(azDoConnectionService, azdoService, azdoCacheService, dialog) {
        this.azDoConnectionService = azDoConnectionService;
        this.azdoService = azdoService;
        this.azdoCacheService = azdoCacheService;
        this.dialog = dialog;
        this.title = 'Dense Azure DevOps';
        this.description = 'Regulatory-driven Team Projects with drift detection';
        this.showSpinner = false;
        this.newConnectionPrompt = 'New Connection';
        this.azDoConnectionService = azDoConnectionService;
        this.projects = {};
    }
    ngOnInit() {
        this.showSpinner = true;
        if (this.azDoConnectionService.currentConnection) {
            this.azdoService.getProjects()
                .subscribe(results => {
                this.projects = results;
                this.showSpinner = false;
            });
        }
    }
    connectionMenuOpened() {
        console.log('Might want to mask out the main content area when this happens');
    }
    connectionClicked(connection) {
        if (connection === undefined) {
            this.openConnectionDialog({ url: '', token: '' });
        }
        else {
            this.azDoConnectionService.setConnection(connection);
            this.ngOnInit();
        }
    }
    openConnectionDialog(connectionInfo) {
        const dialogRef = this.dialog.open(_connection_dialog_connection_dialog_component__WEBPACK_IMPORTED_MODULE_0__["ConnectionDialogComponent"], {
            width: '500px',
            data: connectionInfo
        });
    }
}
AppComponent.ɵfac = function AppComponent_Factory(t) { return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_azdo_connection_service__WEBPACK_IMPORTED_MODULE_2__["AzDoConnectionService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_azdo_service__WEBPACK_IMPORTED_MODULE_3__["AzDoService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_core_services_azdo_cache_service__WEBPACK_IMPORTED_MODULE_4__["AzDoCacheService"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_5__["MatDialog"])); };
AppComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: AppComponent, selectors: [["app-root"]], decls: 30, vars: 9, consts: [["color", "primary"], ["mat-icon-button", "", 3, "click"], [1, "toolbar-spacer"], ["mat-icon-button", "", "aria-label", "Checked"], ["id", "container", "fullscreen", ""], ["mode", "push"], ["drawer", ""], ["mat-button", "", 3, "matMenuTriggerFor", "menuOpened"], ["connectionMenu", "matMenu"], ["mat-menu-item", "", 3, "click", 4, "ngFor", "ngForOf"], ["mat-menu-item", "", 3, "click"], [2, "height", "100%", "margin", "2em"], [4, "ngIf"], ["class", "centered margined", 4, "ngIf"], ["fxLayoutGap", "16px", "fxLayout", "row wrap", "fxLayout.sm", "column", "fxLayout.xs", "column", 4, "ngIf"], ["collectionSecurityComponent", ""], ["mat-button", "", "color", "Primary", "aria-label", "Save", 3, "click"], [1, "centered", "margined"], ["diameter", "50", "mode", "indeterminate"], ["fxLayoutGap", "16px", "fxLayout", "row wrap", "fxLayout.sm", "column", "fxLayout.xs", "column"], ["class", "project-card", 4, "ngFor", "ngForOf"], [1, "project-card"], [1, "project-description"], [3, "project"], ["projectSecurityChildComponent", ""], ["mat-button", "", "color", "Primary", "aria-label", "Refresh", 3, "click"]], template: function AppComponent_Template(rf, ctx) { if (rf & 1) {
        const _r19 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-toolbar", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "button", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AppComponent_Template_button_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r19); const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](12); return _r0.toggle(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3, "menu");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "span");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](6, "span", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "button", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "mat-icon");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "bookmark_added");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "mat-sidenav-container", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "mat-sidenav", 5, 6);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "mat-list");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "mat-list-item");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "Tools");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "mat-sidenav-content");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "mat-toolbar");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](18, "span", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](19, "button", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("menuOpened", function AppComponent_Template_button_menuOpened_19_listener() { return ctx.connectionMenuOpened(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "mat-menu", null, 8);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](23, AppComponent_button_23_Template, 2, 2, "button", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "button", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function AppComponent_Template_button_click_24_listener() { return ctx.connectionClicked(undefined); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](25);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](26, "div", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](27, AppComponent_div_27_Template, 18, 3, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](28, AppComponent_div_28_Template, 2, 0, "div", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](29, AppComponent_div_29_Template, 2, 1, "div", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](22);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.title);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](14);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("matMenuTriggerFor", _r1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate2"](" ", ctx.azDoConnectionService.currentConnection.url, ":", ctx.azDoConnectionService.currentConnection.apiVersion, " ");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.azDoConnectionService.connections);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.newConnectionPrompt);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.azDoConnectionService.currentConnection);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.showSpinner);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.azDoConnectionService.currentConnection);
    } }, directives: [_angular_material_toolbar__WEBPACK_IMPORTED_MODULE_6__["MatToolbar"], _angular_material_button__WEBPACK_IMPORTED_MODULE_7__["MatButton"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__["MatIcon"], _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_9__["MatSidenavContainer"], _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_9__["MatSidenav"], _angular_material_list__WEBPACK_IMPORTED_MODULE_10__["MatList"], _angular_material_list__WEBPACK_IMPORTED_MODULE_10__["MatListItem"], _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_9__["MatSidenavContent"], _angular_material_menu__WEBPACK_IMPORTED_MODULE_11__["MatMenuTrigger"], _angular_material_menu__WEBPACK_IMPORTED_MODULE_11__["MatMenu"], _angular_common__WEBPACK_IMPORTED_MODULE_12__["NgForOf"], _angular_material_menu__WEBPACK_IMPORTED_MODULE_11__["MatMenuItem"], _angular_common__WEBPACK_IMPORTED_MODULE_12__["NgIf"], _angular_material_card__WEBPACK_IMPORTED_MODULE_13__["MatCard"], _angular_material_card__WEBPACK_IMPORTED_MODULE_13__["MatCardHeader"], _angular_material_card__WEBPACK_IMPORTED_MODULE_13__["MatCardTitle"], _angular_material_card__WEBPACK_IMPORTED_MODULE_13__["MatCardContent"], _collection_collection_security_component__WEBPACK_IMPORTED_MODULE_14__["CollectionSecurityComponent"], _angular_material_card__WEBPACK_IMPORTED_MODULE_13__["MatCardActions"], _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_15__["MatSpinner"], _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_16__["DefaultLayoutGapDirective"], _angular_flex_layout_flex__WEBPACK_IMPORTED_MODULE_16__["DefaultLayoutDirective"], _angular_material_card__WEBPACK_IMPORTED_MODULE_13__["MatCardSubtitle"], _project_project_security_component__WEBPACK_IMPORTED_MODULE_17__["ProjectSecurityComponent"]], pipes: [_collection_strip_name_pipe__WEBPACK_IMPORTED_MODULE_18__["StripNamePipe"]], styles: ["#container[_ngcontent-%COMP%] {\r\n    top: 64px !important;\r\n}\r\n\r\n.toolbar-spacer[_ngcontent-%COMP%] {\r\n    flex: 1 1 auto;\r\n}\r\n\r\n.icon-feedback-caption[_ngcontent-%COMP%] {\r\n    margin-left: 24px;\r\n}\r\n\r\n.tile[_ngcontent-%COMP%] {\r\n    background-color: #009169;\r\n}\r\n\r\n\r\n\r\nmat-form-field[_ngcontent-%COMP%] {\r\n    width: 500px;\r\n    margin-right: 20px;\r\n    font-size: smaller;\r\n}\r\n\r\n.project-card[_ngcontent-%COMP%]{\r\n    max-width: 440px;\r\n}\r\n\r\n.mat-card-subtitle[_ngcontent-%COMP%]   .project-description[_ngcontent-%COMP%]{\r\n    text-overflow: ellipsis;\r\n    overflow: hidden;\r\n    line-height: 20px;\r\n    height: 40px;\r\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksb0JBQW9CO0FBQ3hCOztBQUVBO0lBQ0ksY0FBYztBQUNsQjs7QUFFQTtJQUNJLGlCQUFpQjtBQUNyQjs7QUFFQTtJQUNJLHlCQUF5QjtBQUM3Qjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7O0FBRUg7SUFDSSxZQUFZO0lBQ1osa0JBQWtCO0lBQ2xCLGtCQUFrQjtBQUN0Qjs7QUFFQTtJQUNJLGdCQUFnQjtBQUNwQjs7QUFFQTtJQUNJLHVCQUF1QjtJQUN2QixnQkFBZ0I7SUFDaEIsaUJBQWlCO0lBQ2pCLFlBQVk7QUFDaEIiLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIjY29udGFpbmVyIHtcclxuICAgIHRvcDogNjRweCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4udG9vbGJhci1zcGFjZXIge1xyXG4gICAgZmxleDogMSAxIGF1dG87XHJcbn1cclxuXHJcbi5pY29uLWZlZWRiYWNrLWNhcHRpb24ge1xyXG4gICAgbWFyZ2luLWxlZnQ6IDI0cHg7XHJcbn1cclxuXHJcbi50aWxlIHtcclxuICAgIGJhY2tncm91bmQtY29sb3I6ICMwMDkxNjk7XHJcbn1cclxuXHJcbi8qIC5zaWRlbmF2IHtcclxuICAgIHdpZHRoOiAyMDBweDtcclxufVxyXG5cclxuLnNpZGVuYXYgLm1hdC10b29sYmFyIHtcclxuICAgIGJhY2tncm91bmQ6IGluaGVyaXQ7XHJcbn1cclxuXHJcbi5tYXQtdG9vbGJhci5tYXQtcHJpbWFyeSB7XHJcbiAgICBwb3NpdGlvbjogc3RpY2t5O1xyXG4gICAgdG9wOiAwO1xyXG4gICAgei1pbmRleDogMTtcclxufVxyXG5cclxuLm1hdC10b29sYmFyIC5tYXQtZXhwYW5zaW9uLXBhbmVse1xyXG4gICAgbWluLXdpZHRoOiAyMDBweDtcclxuICAgIG1heC13aWR0aDogMzAwcHg7XHJcbn0gKi9cclxuXHJcbm1hdC1mb3JtLWZpZWxkIHtcclxuICAgIHdpZHRoOiA1MDBweDtcclxuICAgIG1hcmdpbi1yaWdodDogMjBweDtcclxuICAgIGZvbnQtc2l6ZTogc21hbGxlcjtcclxufVxyXG5cclxuLnByb2plY3QtY2FyZHtcclxuICAgIG1heC13aWR0aDogNDQwcHg7XHJcbn1cclxuXHJcbi5tYXQtY2FyZC1zdWJ0aXRsZSAucHJvamVjdC1kZXNjcmlwdGlvbntcclxuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xyXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIGxpbmUtaGVpZ2h0OiAyMHB4O1xyXG4gICAgaGVpZ2h0OiA0MHB4O1xyXG59Il19 */"] });


/***/ }),

/***/ "ZAI4":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "tk/3");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "Sy1n");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/platform-browser/animations */ "R1ws");
/* harmony import */ var _core_shared_material_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./core/shared/material.module */ "rq4v");
/* harmony import */ var _not_found_not_found_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./not-found/not-found.component */ "nod/");
/* harmony import */ var _connection_dialog_connection_dialog_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./connection-dialog/connection-dialog.component */ "Po2L");
/* harmony import */ var _collection_collection_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./collection/collection.component */ "NNjt");
/* harmony import */ var _project_project_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./project/project.component */ "6AOp");
/* harmony import */ var _collection_strip_name_pipe__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./collection/strip-name.pipe */ "v1P3");
/* harmony import */ var _collection_collection_security_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./collection/collection-security.component */ "k6J9");
/* harmony import */ var _finding_dialog_finding_dialog_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./finding-dialog/finding-dialog.component */ "ZOUa");
/* harmony import */ var _project_project_security_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./project/project-security.component */ "uWAI");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/core */ "fXoL");















// import { OrganizationComponent } from './organization/organization.component';
class AppModule {
}
AppModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵdefineNgModule"]({ type: AppModule, bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]] });
AppModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵdefineInjector"]({ factory: function AppModule_Factory(t) { return new (t || AppModule)(); }, imports: [[
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormsModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ReactiveFormsModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"],
            _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__["BrowserAnimationsModule"],
            _core_shared_material_module__WEBPACK_IMPORTED_MODULE_5__["MaterialModule"]
        ]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵsetNgModuleScope"](AppModule, { declarations: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
        _not_found_not_found_component__WEBPACK_IMPORTED_MODULE_6__["NotFoundComponent"],
        _connection_dialog_connection_dialog_component__WEBPACK_IMPORTED_MODULE_7__["ConnectionDialogComponent"],
        _collection_collection_component__WEBPACK_IMPORTED_MODULE_8__["CollectionComponent"],
        _project_project_component__WEBPACK_IMPORTED_MODULE_9__["ProjectComponent"],
        _collection_strip_name_pipe__WEBPACK_IMPORTED_MODULE_10__["StripNamePipe"],
        _collection_collection_security_component__WEBPACK_IMPORTED_MODULE_11__["CollectionSecurityComponent"],
        _finding_dialog_finding_dialog_component__WEBPACK_IMPORTED_MODULE_12__["FindingDialogComponent"],
        _project_project_security_component__WEBPACK_IMPORTED_MODULE_13__["ProjectSecurityComponent"]], imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormsModule"],
        _angular_forms__WEBPACK_IMPORTED_MODULE_1__["ReactiveFormsModule"],
        _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"],
        _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_4__["BrowserAnimationsModule"],
        _core_shared_material_module__WEBPACK_IMPORTED_MODULE_5__["MaterialModule"]] }); })();


/***/ }),

/***/ "ZOUa":
/*!************************************************************!*\
  !*** ./src/app/finding-dialog/finding-dialog.component.ts ***!
  \************************************************************/
/*! exports provided: FindingDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FindingDialogComponent", function() { return FindingDialogComponent; });
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/material/dialog */ "0IaG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/list */ "MutI");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/button */ "bTqV");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/tooltip */ "Qu3c");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/icon */ "NFeN");
/* harmony import */ var _angular_material_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/core */ "FKr1");









function FindingDialogComponent_mat_list_item_4_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-list-item", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "mat-icon", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "error");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
} if (rf & 2) {
    const finding_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpropertyInterpolate"]("matTooltip", finding_r1.rule.description);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](finding_r1.rule.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("Analyzed:", finding_r1.rule.detail, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("Found:", finding_r1.value, "");
} }
class FindingDialogComponent {
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    ngOnInit() {
        console.log(this.data);
        // Might have to do something here
    }
    onOkClick() {
        this.dialogRef.close();
    }
}
FindingDialogComponent.ɵfac = function FindingDialogComponent_Factory(t) { return new (t || FindingDialogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_0__["MatDialogRef"]), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_0__["MAT_DIALOG_DATA"])); };
FindingDialogComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({ type: FindingDialogComponent, selectors: [["app-finding-dialog"]], decls: 8, vars: 1, consts: [["mat-dialog-title", ""], ["mat-dialog-content", ""], [3, "matTooltip", 4, "ngFor", "ngForOf"], ["mat-dialog-actions", ""], ["mat-button", "", "cdkFocusInitial", "", 3, "click"], [3, "matTooltip"], ["mat-list-icon", ""], ["mat-line", ""]], template: function FindingDialogComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "h1", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Findings");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "mat-list");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](4, FindingDialogComponent_mat_list_item_4_Template, 9, 4, "mat-list-item", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function FindingDialogComponent_Template_button_click_6_listener() { return ctx.onOkClick(); });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "Ok");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.data.findings);
    } }, directives: [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_0__["MatDialogTitle"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_0__["MatDialogContent"], _angular_material_list__WEBPACK_IMPORTED_MODULE_2__["MatList"], _angular_common__WEBPACK_IMPORTED_MODULE_3__["NgForOf"], _angular_material_dialog__WEBPACK_IMPORTED_MODULE_0__["MatDialogActions"], _angular_material_button__WEBPACK_IMPORTED_MODULE_4__["MatButton"], _angular_material_list__WEBPACK_IMPORTED_MODULE_2__["MatListItem"], _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_5__["MatTooltip"], _angular_material_icon__WEBPACK_IMPORTED_MODULE_6__["MatIcon"], _angular_material_list__WEBPACK_IMPORTED_MODULE_2__["MatListIconCssMatStyler"], _angular_material_core__WEBPACK_IMPORTED_MODULE_7__["MatLine"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJmaW5kaW5nLWRpYWxvZy5jb21wb25lbnQuY3NzIn0= */"] });


/***/ }),

/***/ "Zp6z":
/*!***********************************************!*\
  !*** ./src/app/core/services/rule.service.ts ***!
  \***********************************************/
/*! exports provided: RuleService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RuleService", function() { return RuleService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class RuleService {
    constructor() { }
    getFinding(rule, value, id) {
        return {
            rule,
            value,
            id
        };
    }
    getUnexpectedCollectionGroupMemberRule(detail) {
        return {
            name: 'Unexpected collection-level group member',
            detail,
            description: 'Security groups defined at the collection level should be well-known and contain windows or active directory groups.'
        };
    }
    getUnexpectedProjectGroupMemberRule(detail) {
        return {
            name: 'Unexpected project-level group member',
            detail,
            description: 'Security groups defined at the project level should be well-known and contain only collection level groups.'
        };
    }
    getCsvArray(findings) {
        const csv = [];
        csv.push('"Rule","Rule Description","Group","Member Id","Member Name"');
        findings.forEach(finding => {
            csv.push(`"${finding.rule.name}","${finding.rule.description}","${finding.rule.detail}","${finding.id}","${finding.value}"`);
        });
        const csvArray = csv.join('\r\n');
        return csvArray;
    }
}
RuleService.ɵfac = function RuleService_Factory(t) { return new (t || RuleService)(); };
RuleService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: RuleService, factory: RuleService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "k6J9":
/*!*************************************************************!*\
  !*** ./src/app/collection/collection-security.component.ts ***!
  \*************************************************************/
/*! exports provided: CollectionSecurityComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CollectionSecurityComponent", function() { return CollectionSecurityComponent; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _finding_dialog_finding_dialog_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../finding-dialog/finding-dialog.component */ "ZOUa");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _core_services_azdo_connection_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/services/azdo-connection.service */ "xHjP");
/* harmony import */ var _core_services_azdo_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/services/azdo.service */ "5ZpU");
/* harmony import */ var _core_services_azdo_cache_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../core/services/azdo-cache.service */ "9Lsy");
/* harmony import */ var _core_services_snackbar_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../core/services/snackbar.service */ "4xmj");
/* harmony import */ var _core_services_rule_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../core/services/rule.service */ "Zp6z");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/dialog */ "0IaG");
/* harmony import */ var _core_services_utility_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../core/services/utility.service */ "qeeY");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/progress-spinner */ "Xa2L");
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/chips */ "A5z7");
/* harmony import */ var _angular_material_badge__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/badge */ "TU8p");















function CollectionSecurityComponent_mat_spinner_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "mat-spinner", 3);
} }
function CollectionSecurityComponent_mat_chip_list_2_Template(rf, ctx) { if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-chip-list", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "mat-chip", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function CollectionSecurityComponent_mat_chip_list_2_Template_mat_chip_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r3); const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r2.openFindingsDialog("securityFindings"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "Security Groups");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("selectable", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpropertyInterpolate"]("matBadge", ctx_r1.securityFindingsCount);
} }
class CollectionSecurityComponent {
    constructor(azdoConnectionService, azdoService, azdoCacheService, snackBarService, ruleService, dialog, utilityService) {
        this.azdoConnectionService = azdoConnectionService;
        this.azdoService = azdoService;
        this.azdoCacheService = azdoCacheService;
        this.snackBarService = snackBarService;
        this.ruleService = ruleService;
        this.dialog = dialog;
        this.utilityService = utilityService;
        this.showCollectionSecuritySpinner = false;
        this.showSecurityFindingsBadge = false;
        this.securityFindingsCount = 0;
        this.securityNamespaces = {};
        this.projectCollectionValidUsersGroup = {};
        this.projectCollectionValidUsersGroupMembers = {};
        this.projectCollectionValidUsersGroupMembersMembers = {};
        this.findings = [];
    }
    ngOnInit() {
        this.showCollectionSecuritySpinner = true;
        this.findings = [];
        Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["from"])(this.azdoService.getProjectCollectionValidUsersGroup()).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["concatMap"])(topLevelGroupResponse => {
            const topLevelGroup = topLevelGroupResponse === null || topLevelGroupResponse === void 0 ? void 0 : topLevelGroupResponse.value[0];
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["forkJoin"])([
                Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(topLevelGroupResponse),
                this.azdoService.getIdentities(topLevelGroup.memberIds)
            ]);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["concatMap"])(([topLevelGroupResponse, topLevelGroupMembers]) => {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["forkJoin"])([
                Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(topLevelGroupResponse), Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(topLevelGroupMembers),
                this.azdoService.getIdentities(this.combineMemberIds(topLevelGroupMembers === null || topLevelGroupMembers === void 0 ? void 0 : topLevelGroupMembers.value))
            ]);
        })).subscribe(values => {
            this.azdoCacheService.cacheIdentities(values[1]);
            this.azdoCacheService.cacheIdentities(values[2]);
            this.projectCollectionValidUsersGroup = values[0];
            this.projectCollectionValidUsersGroupMembers = values[1];
            this.projectCollectionValidUsersGroupMembersMembers = values[2];
            this.checkProjectCollectionValidUsers();
            this.securityFindingsCount = this.findings.length;
            this.showCollectionSecuritySpinner = false;
        });
    }
    openFindingsDialog(chip) {
        if (this.findings.length) {
            const dialogRef = this.dialog.open(_finding_dialog_finding_dialog_component__WEBPACK_IMPORTED_MODULE_2__["FindingDialogComponent"], {
                width: '500px',
                data: { findings: this.findings }
            });
        }
        else {
            // Show some eyecandy telling them how great their security is and what was checked
        }
    }
    combineMemberIds(identities) {
        let memberIds = [];
        identities.forEach(identity => {
            memberIds = memberIds.concat(identity.memberIds);
        });
        return memberIds;
    }
    refresh() {
        this.ngOnInit();
    }
    download() {
        const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);
        this.utilityService.downloadCsvFile(this.ruleService.getCsvArray(this.findings), `${collectionName}-SecurityGroups.csv`);
    }
    checkProjectCollectionValidUsers() {
        var _a, _b;
        console.log('Checking Project Collection Valid Users');
        const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);
        const instanceName = (_a = this.azdoConnectionService.currentConnection) === null || _a === void 0 ? void 0 : _a.instanceName;
        (_b = this.projectCollectionValidUsersGroupMembers) === null || _b === void 0 ? void 0 : _b.value.forEach(member => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
            console.log(`  Checking Member: member: ${member.providerDisplayName}`);
            const memberIdentity = (_b = (_a = this.projectCollectionValidUsersGroupMembers) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.find(element => (element === null || element === void 0 ? void 0 : element.descriptor) === member.descriptor);
            if (((_c = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _c === void 0 ? void 0 : _c.toUpperCase()) === `[${collectionName}]\\Project Collection Administrators`.toUpperCase()) {
                this.checkProjectCollectionAdministrators(memberIdentity);
            }
            else if (((_d = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _d === void 0 ? void 0 : _d.toUpperCase()) === `[${collectionName}]\\Project Collection Auditors`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}Auditors`, 'Project Collection Auditors');
            }
            else if (((_e = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _e === void 0 ? void 0 : _e.toUpperCase()) === `[${collectionName}]\\Project Collection Build Administrators`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}BuildAdministrators`, 'Project Collection Build Administrators');
            }
            else if (((_f = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _f === void 0 ? void 0 : _f.toUpperCase()) === `[${collectionName}]\\Project Collection Build Service Accounts`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}BuildServiceAccounts`, 'Project Collection Build Service Accounts');
            }
            else if (((_g = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _g === void 0 ? void 0 : _g.toUpperCase()) === `[${collectionName}]\\Project Collection Developers`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}Developers`, 'Project Collection Developers');
            }
            else if (((_h = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _h === void 0 ? void 0 : _h.toUpperCase()) === `[${collectionName}]\\Project Collection Operators`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}Operators`, 'Project Collection Operators');
            }
            else if (((_j = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _j === void 0 ? void 0 : _j.toUpperCase()) === `[${collectionName}]\\Project Collection Compliance Officers`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}ComplianceOfficers`, 'Project Collection Compliance Officers');
            }
            else if (((_k = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _k === void 0 ? void 0 : _k.toUpperCase()) === `[${collectionName}]\\Project Collection DevOps Engineers`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}DevOpsEngineers`, 'Project Collection DevOps Engineers');
            }
            else if (((_l = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _l === void 0 ? void 0 : _l.toUpperCase()) === `[${collectionName}]\\Project Collection Release Engineers`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}ReleaseEngineers`, 'Project Collection Release Engineers');
            }
            else if (((_m = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _m === void 0 ? void 0 : _m.toUpperCase()) === `[${collectionName}]\\Project Collection Proxy Service Accounts`.toUpperCase()) {
                this.checkProjectCollectionProxyServiceAccounts(memberIdentity);
            }
            else if (((_o = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _o === void 0 ? void 0 : _o.toUpperCase()) === `[${collectionName}]\\Project Collection Service Accounts`.toUpperCase()) {
                this.checkProjectCollectionServiceAccounts(memberIdentity);
            }
            else if (((_p = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _p === void 0 ? void 0 : _p.toUpperCase()) === `[${collectionName}]\\Project Collection Test Service Accounts`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}TestServiceAccounts`, 'Project Collection Test Service Accounts');
            }
            else if (((_q = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _q === void 0 ? void 0 : _q.toUpperCase()) === `[${collectionName}]\\Project Collection Testers`.toUpperCase()) {
                this.checkProjectCollectionGroup(memberIdentity, `${instanceName}Testers`, 'Project Collection Testers');
            }
            else if (((_r = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _r === void 0 ? void 0 : _r.toUpperCase()) === `[${collectionName}]\\Security Service Group`.toUpperCase()) {
                this.checkSecurityServiceGroup(memberIdentity);
            }
            else if ((_s = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _s === void 0 ? void 0 : _s.toUpperCase().includes('Project Valid Users'.toUpperCase())) {
                console.log(`   Skipping ${memberIdentity.providerDisplayName}`);
                // this.checkSecurityServiceGroup(identity);
            }
            else {
                this.findings.push(this.ruleService.getFinding(this.ruleService.getUnexpectedCollectionGroupMemberRule('Project Collection Valid Users'), memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName, memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.descriptor));
            }
        });
    }
    /**
     * Checks the members of a collection level group that should map to a singular windows group:
     * 1. An Active Directory or Windows Group that follows naming convention [instance][GroupName]
     * @param identity The identity that matches the rules being checked by this method
     */
    checkProjectCollectionGroup(identity, groupName, groupDisplayName) {
        const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);
        identity.members.forEach(descriptor => {
            var _a, _b, _c;
            const memberIdentity = (_b = (_a = this.projectCollectionValidUsersGroupMembersMembers) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.find(element => (element === null || element === void 0 ? void 0 : element.descriptor) === descriptor);
            console.log(`   Checking Member: memberIdentity: ${memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName}`);
            if (!(((_c = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _c === void 0 ? void 0 : _c.toUpperCase()) === `${groupName}`.toUpperCase())) {
                console.log(`Invalid Identity found in ${groupDisplayName}`);
                console.log(memberIdentity);
                this.findings.push(this.ruleService.getFinding(this.ruleService.getUnexpectedCollectionGroupMemberRule(groupDisplayName), memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName, memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.descriptor));
            }
        });
    }
    /**
     * Checks the members of the Project Collection Administrators Group are:
     * 1. An Active Directory or Windows Group that follows naming convention [instance]-[Administrators]
     * 2. An OOTB well-known group
     * @param identity The identity that matches the rules being checked by this method
     */
    checkProjectCollectionAdministrators(identity) {
        var _a;
        console.log(`  Checking Project Collection Administrators: identity: ${identity.providerDisplayName}`);
        const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);
        const instanceName = (_a = this.azdoConnectionService.currentConnection) === null || _a === void 0 ? void 0 : _a.instanceName;
        identity.members.forEach(descriptor => {
            var _a, _b, _c, _d, _e, _f, _g;
            const memberIdentity = (_b = (_a = this.projectCollectionValidUsersGroupMembersMembers) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.find(element => (element === null || element === void 0 ? void 0 : element.descriptor) === descriptor);
            console.log(`   Checking Member: memberIdentity: ${memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName}`);
            if (!(((_c = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _c === void 0 ? void 0 : _c.toUpperCase()) === `[TEAM FOUNDATION]\\Team Foundation Administrators`.toUpperCase()
                || ((_d = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _d === void 0 ? void 0 : _d.toUpperCase()) === `[${collectionName}]\\Project Collection Service Accounts`.toUpperCase()
                || ((_e = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _e === void 0 ? void 0 : _e.toUpperCase()) === `${instanceName}Administrators`.toUpperCase()
                || ((_f = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _f === void 0 ? void 0 : _f.toUpperCase()) === `Administrators`.toUpperCase()
                || ((_g = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _g === void 0 ? void 0 : _g.toUpperCase()) === `[TEAM FOUNDATION]\\Azure DevOps Service Accounts`.toUpperCase())) {
                this.findings.push(this.ruleService.getFinding(this.ruleService.getUnexpectedCollectionGroupMemberRule('Project Collection Administrators'), memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName, memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.descriptor));
            }
        });
    }
    /**
     * Checks the members of the Project Collection Service Accounts are:
     * 1. An OOTB well-known group
     * @param identity The identity that matches the rules being checked by this method
     */
    checkProjectCollectionServiceAccounts(identity) {
        var _a;
        const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);
        const instanceName = (_a = this.azdoConnectionService.currentConnection) === null || _a === void 0 ? void 0 : _a.instanceName;
        identity.members.forEach(descriptor => {
            var _a, _b, _c, _d;
            const memberIdentity = (_b = (_a = this.projectCollectionValidUsersGroupMembersMembers) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.find(element => (element === null || element === void 0 ? void 0 : element.descriptor) === descriptor);
            console.log(`   Checking Member: memberIdentity: ${memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName}`);
            if (!(((_c = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _c === void 0 ? void 0 : _c.toUpperCase()) === `[TEAM FOUNDATION]\\Azure DevOps Service Accounts`.toUpperCase()
                || ((_d = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _d === void 0 ? void 0 : _d.toUpperCase()) === `[${collectionName}]\\Team Foundation Service Accounts`.toUpperCase())) {
                this.findings.push(this.ruleService.getFinding(this.ruleService.getUnexpectedCollectionGroupMemberRule('Project Collection Service Accounts'), memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName, memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.descriptor));
            }
        });
    }
    /**
     * Checks the members of the Project Collection Proxy Service Accounts are:
     * 1. An OOTB well-known group
     * @param identity The identity that matches the rules being checked by this method
     */
    checkProjectCollectionProxyServiceAccounts(identity) {
        var _a;
        const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);
        const instanceName = (_a = this.azdoConnectionService.currentConnection) === null || _a === void 0 ? void 0 : _a.instanceName;
        identity.members.forEach(descriptor => {
            var _a, _b, _c;
            const memberIdentity = (_b = (_a = this.projectCollectionValidUsersGroupMembersMembers) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.find(element => (element === null || element === void 0 ? void 0 : element.descriptor) === descriptor);
            console.log(`   Checking Member: memberIdentity: ${memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName}`);
            if (!(((_c = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _c === void 0 ? void 0 : _c.toUpperCase()) === `[TEAM FOUNDATION]\\Azure DevOps Proxy Service Accounts`.toUpperCase())) {
                this.findings.push(this.ruleService.getFinding(this.ruleService.getUnexpectedCollectionGroupMemberRule('Project Collection Proxy Service Accounts'), memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName, memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.descriptor));
            }
        });
    }
    /**
     * Checks the members of the Security Service Group are:
     * 1. An Active Directory or Windows Group that follows naming convention [instance][Developers]
     * @param identity The identity that matches the rules being checked by this method
     */
    checkSecurityServiceGroup(identity) {
        var _a;
        const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);
        const instanceName = (_a = this.azdoConnectionService.currentConnection) === null || _a === void 0 ? void 0 : _a.instanceName;
        identity.members.forEach(descriptor => {
            var _a, _b, _c;
            const memberIdentity = (_b = (_a = this.projectCollectionValidUsersGroupMembersMembers) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.find(element => (element === null || element === void 0 ? void 0 : element.descriptor) === descriptor);
            console.log(`   Checking Member: memberIdentity: ${memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName}`);
            if (!((_c = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.customDisplayName) === null || _c === void 0 ? void 0 : _c.toUpperCase().includes('Build Service'.toUpperCase()))) {
                console.log(`Invalid Identity found in SecurityServiceGroup`);
                console.log(memberIdentity);
                this.findings.push(this.ruleService.getFinding(this.ruleService.getUnexpectedCollectionGroupMemberRule('Security Service Group'), memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName, memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.descriptor));
            }
        });
    }
    check(identity) {
        // console.log("check");
        // Should only contain [{collection}] Project Collection Service Acounts
    }
}
CollectionSecurityComponent.ɵfac = function CollectionSecurityComponent_Factory(t) { return new (t || CollectionSecurityComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_azdo_connection_service__WEBPACK_IMPORTED_MODULE_4__["AzDoConnectionService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_azdo_service__WEBPACK_IMPORTED_MODULE_5__["AzDoService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_azdo_cache_service__WEBPACK_IMPORTED_MODULE_6__["AzDoCacheService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_snackbar_service__WEBPACK_IMPORTED_MODULE_7__["SnackbarService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_rule_service__WEBPACK_IMPORTED_MODULE_8__["RuleService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_9__["MatDialog"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_utility_service__WEBPACK_IMPORTED_MODULE_10__["UtilityService"])); };
CollectionSecurityComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: CollectionSecurityComponent, selectors: [["app-collection-security"]], decls: 3, vars: 2, consts: [[1, "centered"], ["diameter", "30", "mode", "indeterminate", 4, "ngIf"], ["aria-label", "Results", 3, "selectable", 4, "ngIf"], ["diameter", "30", "mode", "indeterminate"], ["aria-label", "Results", 3, "selectable"], ["matBadgeColor", "warn", 3, "matBadge", "click"]], template: function CollectionSecurityComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, CollectionSecurityComponent_mat_spinner_1_Template, 1, 0, "mat-spinner", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](2, CollectionSecurityComponent_mat_chip_list_2_Template, 3, 2, "mat-chip-list", 2);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.showCollectionSecuritySpinner);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.showCollectionSecuritySpinner);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_11__["NgIf"], _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__["MatSpinner"], _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__["MatChipList"], _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__["MatChip"], _angular_material_badge__WEBPACK_IMPORTED_MODULE_14__["MatBadge"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJjb2xsZWN0aW9uLXNlY3VyaXR5LmNvbXBvbmVudC5jc3MifQ== */"] });


/***/ }),

/***/ "nod/":
/*!**************************************************!*\
  !*** ./src/app/not-found/not-found.component.ts ***!
  \**************************************************/
/*! exports provided: NotFoundComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotFoundComponent", function() { return NotFoundComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class NotFoundComponent {
    constructor() { }
    ngOnInit() {
    }
}
NotFoundComponent.ɵfac = function NotFoundComponent_Factory(t) { return new (t || NotFoundComponent)(); };
NotFoundComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({ type: NotFoundComponent, selectors: [["app-not-found"]], decls: 2, vars: 0, template: function NotFoundComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "h1");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "404");
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    } }, styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJub3QtZm91bmQuY29tcG9uZW50LmNzcyJ9 */"] });


/***/ }),

/***/ "qeeY":
/*!**************************************************!*\
  !*** ./src/app/core/services/utility.service.ts ***!
  \**************************************************/
/*! exports provided: UtilityService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UtilityService", function() { return UtilityService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");

class UtilityService {
    constructor() { }
    downloadCsvFile(csvArray, fileName) {
        const a = document.createElement('a');
        const blob = new Blob([csvArray], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
    swapSlashes(source) {
        return source.replace(/\\/g, '/');
    }
}
UtilityService.ɵfac = function UtilityService_Factory(t) { return new (t || UtilityService)(); };
UtilityService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({ token: UtilityService, factory: UtilityService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "rq4v":
/*!************************************************!*\
  !*** ./src/app/core/shared/material.module.ts ***!
  \************************************************/
/*! exports provided: MaterialModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaterialModule", function() { return MaterialModule; });
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/material/button */ "bTqV");
/* harmony import */ var _angular_material_button_toggle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/button-toggle */ "jaxi");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/icon */ "NFeN");
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/toolbar */ "/t3+");
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/sidenav */ "XhcP");
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/list */ "MutI");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/form-field */ "kmnG");
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/menu */ "STbY");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/dialog */ "0IaG");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/input */ "qFsG");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/material/select */ "d3UM");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/snack-bar */ "dNgK");
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/progress-spinner */ "Xa2L");
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/chips */ "A5z7");
/* harmony import */ var _angular_material_card__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/card */ "Wp6s");
/* harmony import */ var _angular_material_badge__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/badge */ "TU8p");
/* harmony import */ var _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/grid-list */ "zkoq");
/* harmony import */ var _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/tooltip */ "Qu3c");
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/flex-layout */ "YUcS");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/core */ "fXoL");




















const MaterialComponents = [
    _angular_material_button__WEBPACK_IMPORTED_MODULE_0__["MatButtonModule"],
    _angular_material_button_toggle__WEBPACK_IMPORTED_MODULE_1__["MatButtonToggleModule"],
    _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__["MatIconModule"],
    _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_3__["MatToolbarModule"],
    _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_4__["MatSidenavModule"],
    _angular_material_list__WEBPACK_IMPORTED_MODULE_5__["MatListModule"],
    _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__["MatFormFieldModule"],
    _angular_material_menu__WEBPACK_IMPORTED_MODULE_7__["MatMenuModule"],
    _angular_material_dialog__WEBPACK_IMPORTED_MODULE_8__["MatDialogModule"],
    _angular_material_input__WEBPACK_IMPORTED_MODULE_9__["MatInputModule"],
    _angular_material_select__WEBPACK_IMPORTED_MODULE_10__["MatSelectModule"],
    _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_11__["MatSnackBarModule"],
    _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__["MatProgressSpinnerModule"],
    _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__["MatChipsModule"],
    _angular_material_card__WEBPACK_IMPORTED_MODULE_14__["MatCardModule"],
    _angular_material_badge__WEBPACK_IMPORTED_MODULE_15__["MatBadgeModule"],
    _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_16__["MatGridListModule"],
    _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__["MatTooltipModule"],
    _angular_flex_layout__WEBPACK_IMPORTED_MODULE_18__["FlexLayoutModule"]
];
class MaterialModule {
}
MaterialModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdefineNgModule"]({ type: MaterialModule });
MaterialModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵdefineInjector"]({ factory: function MaterialModule_Factory(t) { return new (t || MaterialModule)(); }, imports: [[MaterialComponents], _angular_material_button__WEBPACK_IMPORTED_MODULE_0__["MatButtonModule"],
        _angular_material_button_toggle__WEBPACK_IMPORTED_MODULE_1__["MatButtonToggleModule"],
        _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__["MatIconModule"],
        _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_3__["MatToolbarModule"],
        _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_4__["MatSidenavModule"],
        _angular_material_list__WEBPACK_IMPORTED_MODULE_5__["MatListModule"],
        _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__["MatFormFieldModule"],
        _angular_material_menu__WEBPACK_IMPORTED_MODULE_7__["MatMenuModule"],
        _angular_material_dialog__WEBPACK_IMPORTED_MODULE_8__["MatDialogModule"],
        _angular_material_input__WEBPACK_IMPORTED_MODULE_9__["MatInputModule"],
        _angular_material_select__WEBPACK_IMPORTED_MODULE_10__["MatSelectModule"],
        _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_11__["MatSnackBarModule"],
        _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__["MatProgressSpinnerModule"],
        _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__["MatChipsModule"],
        _angular_material_card__WEBPACK_IMPORTED_MODULE_14__["MatCardModule"],
        _angular_material_badge__WEBPACK_IMPORTED_MODULE_15__["MatBadgeModule"],
        _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_16__["MatGridListModule"],
        _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__["MatTooltipModule"],
        _angular_flex_layout__WEBPACK_IMPORTED_MODULE_18__["FlexLayoutModule"]] });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_19__["ɵɵsetNgModuleScope"](MaterialModule, { imports: [_angular_material_button__WEBPACK_IMPORTED_MODULE_0__["MatButtonModule"],
        _angular_material_button_toggle__WEBPACK_IMPORTED_MODULE_1__["MatButtonToggleModule"],
        _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__["MatIconModule"],
        _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_3__["MatToolbarModule"],
        _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_4__["MatSidenavModule"],
        _angular_material_list__WEBPACK_IMPORTED_MODULE_5__["MatListModule"],
        _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__["MatFormFieldModule"],
        _angular_material_menu__WEBPACK_IMPORTED_MODULE_7__["MatMenuModule"],
        _angular_material_dialog__WEBPACK_IMPORTED_MODULE_8__["MatDialogModule"],
        _angular_material_input__WEBPACK_IMPORTED_MODULE_9__["MatInputModule"],
        _angular_material_select__WEBPACK_IMPORTED_MODULE_10__["MatSelectModule"],
        _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_11__["MatSnackBarModule"],
        _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__["MatProgressSpinnerModule"],
        _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__["MatChipsModule"],
        _angular_material_card__WEBPACK_IMPORTED_MODULE_14__["MatCardModule"],
        _angular_material_badge__WEBPACK_IMPORTED_MODULE_15__["MatBadgeModule"],
        _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_16__["MatGridListModule"],
        _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__["MatTooltipModule"],
        _angular_flex_layout__WEBPACK_IMPORTED_MODULE_18__["FlexLayoutModule"]], exports: [_angular_material_button__WEBPACK_IMPORTED_MODULE_0__["MatButtonModule"],
        _angular_material_button_toggle__WEBPACK_IMPORTED_MODULE_1__["MatButtonToggleModule"],
        _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__["MatIconModule"],
        _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_3__["MatToolbarModule"],
        _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_4__["MatSidenavModule"],
        _angular_material_list__WEBPACK_IMPORTED_MODULE_5__["MatListModule"],
        _angular_material_form_field__WEBPACK_IMPORTED_MODULE_6__["MatFormFieldModule"],
        _angular_material_menu__WEBPACK_IMPORTED_MODULE_7__["MatMenuModule"],
        _angular_material_dialog__WEBPACK_IMPORTED_MODULE_8__["MatDialogModule"],
        _angular_material_input__WEBPACK_IMPORTED_MODULE_9__["MatInputModule"],
        _angular_material_select__WEBPACK_IMPORTED_MODULE_10__["MatSelectModule"],
        _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_11__["MatSnackBarModule"],
        _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__["MatProgressSpinnerModule"],
        _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__["MatChipsModule"],
        _angular_material_card__WEBPACK_IMPORTED_MODULE_14__["MatCardModule"],
        _angular_material_badge__WEBPACK_IMPORTED_MODULE_15__["MatBadgeModule"],
        _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_16__["MatGridListModule"],
        _angular_material_tooltip__WEBPACK_IMPORTED_MODULE_17__["MatTooltipModule"],
        _angular_flex_layout__WEBPACK_IMPORTED_MODULE_18__["FlexLayoutModule"]] }); })();


/***/ }),

/***/ "uWAI":
/*!*******************************************************!*\
  !*** ./src/app/project/project-security.component.ts ***!
  \*******************************************************/
/*! exports provided: ProjectSecurityComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProjectSecurityComponent", function() { return ProjectSecurityComponent; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/operators */ "kU1M");
/* harmony import */ var _finding_dialog_finding_dialog_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../finding-dialog/finding-dialog.component */ "ZOUa");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _core_services_azdo_connection_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core/services/azdo-connection.service */ "xHjP");
/* harmony import */ var _core_services_azdo_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../core/services/azdo.service */ "5ZpU");
/* harmony import */ var _core_services_azdo_cache_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../core/services/azdo-cache.service */ "9Lsy");
/* harmony import */ var _core_services_snackbar_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../core/services/snackbar.service */ "4xmj");
/* harmony import */ var _core_services_rule_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../core/services/rule.service */ "Zp6z");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/dialog */ "0IaG");
/* harmony import */ var _core_services_utility_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../core/services/utility.service */ "qeeY");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/progress-spinner */ "Xa2L");
/* harmony import */ var _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/chips */ "A5z7");
/* harmony import */ var _angular_material_badge__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/badge */ "TU8p");















function ProjectSecurityComponent_mat_spinner_1_Template(rf, ctx) { if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "mat-spinner", 3);
} }
function ProjectSecurityComponent_mat_chip_list_2_Template(rf, ctx) { if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-chip-list", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "mat-chip", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function ProjectSecurityComponent_mat_chip_list_2_Template_mat_chip_click_1_listener() { _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r3); const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](); return ctx_r2.openFindingsDialog("securityFindings"); });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, "Security Groups");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "mat-chip");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](4, "Security");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
} if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("selectable", true);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpropertyInterpolate"]("matBadge", ctx_r1.securityFindingsCount);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("matBadgeHidden", !ctx_r1.securityFindingsCount);
} }
class ProjectSecurityComponent {
    constructor(azdoConnectionService, azdoService, azdoCacheService, snackBarService, ruleService, dialog, utilityService) {
        this.azdoConnectionService = azdoConnectionService;
        this.azdoService = azdoService;
        this.azdoCacheService = azdoCacheService;
        this.snackBarService = snackBarService;
        this.ruleService = ruleService;
        this.dialog = dialog;
        this.utilityService = utilityService;
        this.showProjectSecuritySpinner = false;
        this.showSecurityFindingsBadge = false;
        this.securityFindingsCount = 0;
        this.securityNamespaces = {};
        this.projectValidUsersGroup = {};
        this.projectValidUsersGroupMembers = {};
        this.projectValidUsersGroupMembersMembers = {};
        this.projectReleaseFolders = {};
        this.findings = [];
        this.project = {};
        this.securityNamespaces = this.azdoCacheService.securityNamespaces;
    }
    ngOnInit() {
        var _a;
        this.showProjectSecuritySpinner = true;
        this.findings = [];
        Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["from"])(this.azdoService.getProjectValidUsersGroup((_a = this.project) === null || _a === void 0 ? void 0 : _a.name)).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["concatMap"])(topLevelGroupResponse => {
            const topLevelGroup = topLevelGroupResponse === null || topLevelGroupResponse === void 0 ? void 0 : topLevelGroupResponse.value[0];
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["forkJoin"])([
                Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(topLevelGroupResponse),
                this.azdoService.getIdentities(topLevelGroup.memberIds)
            ]);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["concatMap"])(([topLevelGroupResponse, topLevelGroupMembers]) => {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["forkJoin"])([
                Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(topLevelGroupResponse), Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(topLevelGroupMembers),
                this.azdoService.getIdentities(this.combineMemberIds(topLevelGroupMembers === null || topLevelGroupMembers === void 0 ? void 0 : topLevelGroupMembers.value))
            ]);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["concatMap"])(([topLevelGroupResponse, topLevelGroupMembers, secondLevelGroupMembers]) => {
            var _a;
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["forkJoin"])([
                Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(topLevelGroupResponse), Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(topLevelGroupMembers), Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(secondLevelGroupMembers),
                this.azdoService.getReleaseFolders((_a = this.project) === null || _a === void 0 ? void 0 : _a.name)
            ]);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_1__["concatMap"])(([topLevelGroupResponse, topLevelGroupMembers, secondLevelGroupMembers, releaseFolders]) => {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["forkJoin"])([
                Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(topLevelGroupResponse), Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(topLevelGroupMembers), Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(secondLevelGroupMembers), Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(releaseFolders),
                this.azdoService.getAccessControlLists(this.azdoCacheService.releaseManagementSecurityNamespaceId, `${this.project.id}`)
            ]);
        })).subscribe(values => {
            this.azdoCacheService.cacheIdentities(values[1]);
            this.azdoCacheService.cacheIdentities(values[2]);
            this.projectValidUsersGroup = values[0];
            this.projectValidUsersGroupMembers = values[1];
            this.projectValidUsersGroupMembersMembers = values[2];
            this.projectReleaseFolders = values[3];
            this.projectReleaseFolderAcls = values[4];
            this.checkProjectValidUsers();
            this.checkReleaseFolderSecurity();
            this.securityFindingsCount = this.findings.length;
            this.showProjectSecuritySpinner = false;
        });
    }
    openFindingsDialog(chip) {
        if (this.findings.length) {
            const dialogRef = this.dialog.open(_finding_dialog_finding_dialog_component__WEBPACK_IMPORTED_MODULE_2__["FindingDialogComponent"], {
                width: '500px',
                data: { findings: this.findings }
            });
        }
        else {
            // Show some eyecandy telling them how great their security is and what was checked
        }
    }
    combineMemberIds(identities) {
        let memberIds = [];
        identities.forEach(identity => {
            memberIds = memberIds.concat(identity.memberIds);
        });
        return memberIds;
    }
    refresh() {
        this.ngOnInit();
    }
    download() {
        const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);
        this.utilityService.downloadCsvFile(this.ruleService.getCsvArray(this.findings), `${collectionName}-${this.project.name}-SecurityGroups.csv`);
    }
    checkProjectValidUsers() {
        var _a, _b;
        console.log('Checking Project Valid Users');
        const collectionName = this.azdoConnectionService.getCollectionName(this.azdoConnectionService.currentConnection.url);
        const instanceName = (_a = this.azdoConnectionService.currentConnection) === null || _a === void 0 ? void 0 : _a.instanceName;
        (_b = this.projectValidUsersGroupMembers) === null || _b === void 0 ? void 0 : _b.value.forEach(member => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            console.log(`  Checking Member: member: ${member.providerDisplayName}`);
            const memberIdentity = (_b = (_a = this.projectValidUsersGroupMembers) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.find(element => (element === null || element === void 0 ? void 0 : element.descriptor) === member.descriptor);
            if (((_c = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _c === void 0 ? void 0 : _c.toUpperCase()) === `[${this.project.name}]\\Project Administrators`.toUpperCase()) {
                this.checkProjectGroup(memberIdentity, `[${collectionName}]\\Project Collection Administrators`, 'Project Administrators');
            }
            else if (((_d = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _d === void 0 ? void 0 : _d.toUpperCase()) === `[${this.project.name}]\\Auditors`.toUpperCase()) {
                this.checkProjectGroup(memberIdentity, `[${collectionName}]\\Project Collection Auditors`, 'Auditors');
            }
            else if (((_e = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _e === void 0 ? void 0 : _e.toUpperCase()) === `[${this.project.name}]\\Build Administrators`.toUpperCase()) {
                this.checkProjectGroup(memberIdentity, `[${collectionName}]\\Project Collection Build Administrators`, 'Build Administrators');
            }
            else if (((_f = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _f === void 0 ? void 0 : _f.toUpperCase()) === `[${this.project.name}]\\Developers`.toUpperCase()) {
                this.checkProjectGroup(memberIdentity, `[${collectionName}]\\Project Collection Developers`, 'Developers');
            }
            else if (((_g = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _g === void 0 ? void 0 : _g.toUpperCase()) === `[${this.project.name}]\\Operators`.toUpperCase()) {
                this.checkProjectGroup(memberIdentity, `[${collectionName}]\\Project Collection Operators`, 'Operators');
            }
            else if (((_h = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _h === void 0 ? void 0 : _h.toUpperCase()) === `[${this.project.name}]\\Compliance Officers`.toUpperCase()) {
                this.checkProjectGroup(memberIdentity, `[${collectionName}]\\Project Collection Compliance Officers`, 'Compliance Officers');
            }
            else if (((_j = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _j === void 0 ? void 0 : _j.toUpperCase()) === `[${this.project.name}]\\DevOps Engineers`.toUpperCase()) {
                this.checkProjectGroup(memberIdentity, `[${collectionName}]\\Project Collection DevOps Engineers`, 'DevOps Engineers');
            }
            else if (((_k = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _k === void 0 ? void 0 : _k.toUpperCase()) === `[${this.project.name}]\\Release Engineers`.toUpperCase()) {
                this.checkProjectGroup(memberIdentity, `[${collectionName}]\\Project Collection Release Engineers`, 'Release Engineers');
            }
            else if (((_l = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _l === void 0 ? void 0 : _l.toUpperCase()) === `[${this.project.name}]\\Testers`.toUpperCase()) {
                this.checkProjectGroup(memberIdentity, `[${collectionName}]\\Project Collection Testers`, 'Testers');
            }
            else if (((_m = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _m === void 0 ? void 0 : _m.toUpperCase()) === `[${this.project.name}]\\Readers`.toUpperCase()) {
                this.checkProjectGroup(memberIdentity, `[${collectionName}]\\Project Collection Readers`, 'Readers');
            }
            else if (((_o = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _o === void 0 ? void 0 : _o.toUpperCase()) === `[${this.project.name}]\\Contributors`.toUpperCase()) {
                this.checkProjectGroupIsEmpty(memberIdentity, 'Contributors');
            }
            else if (((_p = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _p === void 0 ? void 0 : _p.toUpperCase()) === `[${this.project.name}]\\Release Administrators`.toUpperCase()) {
                this.checkProjectGroupIsEmpty(memberIdentity, 'Release Administrators');
            }
            else if ((_q = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _q === void 0 ? void 0 : _q.toUpperCase().includes('Team'.toUpperCase())) {
                console.log(`Skipping ${memberIdentity.providerDisplayName}`);
                // this.checkSecurityServiceGroup(identity);
            }
            else {
                this.findings.push(this.ruleService.getFinding(this.ruleService.getUnexpectedProjectGroupMemberRule('Project Valid Users'), memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName, memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.descriptor));
            }
        });
    }
    /**
     * Checks the members of a project level group that should map to a collection level group:
     * @param identity The identity that matches the rules being checked by this method
     */
    checkProjectGroup(identity, groupName, groupDisplayName) {
        identity.members.forEach(descriptor => {
            var _a, _b, _c;
            const memberIdentity = (_b = (_a = this.projectValidUsersGroupMembersMembers) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.find(element => (element === null || element === void 0 ? void 0 : element.descriptor) === descriptor);
            console.log(`   Checking Member: memberIdentity: ${memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName}`);
            if (!(((_c = memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName) === null || _c === void 0 ? void 0 : _c.toUpperCase()) === `${groupName}`.toUpperCase())) {
                console.log(`Invalid Identity found in ${groupDisplayName}`);
                this.findings.push(this.ruleService.getFinding(this.ruleService.getUnexpectedProjectGroupMemberRule(groupDisplayName), memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName, memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.descriptor));
            }
        });
    }
    /**
     * Checks if a project level group is empty:
     * @param identity The identity that matches the rules being checked by this method
     */
    checkProjectGroupIsEmpty(identity, groupDisplayName) {
        identity.members.forEach(descriptor => {
            var _a, _b;
            const memberIdentity = (_b = (_a = this.projectValidUsersGroupMembersMembers) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.find(element => (element === null || element === void 0 ? void 0 : element.descriptor) === descriptor);
            console.log(`Invalid Identity found in ${groupDisplayName}`);
            this.findings.push(this.ruleService.getFinding(this.ruleService.getUnexpectedProjectGroupMemberRule(groupDisplayName), memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.providerDisplayName, memberIdentity === null || memberIdentity === void 0 ? void 0 : memberIdentity.descriptor));
        });
    }
    checkReleaseFolderSecurity() {
        const releasePermissionBits = this.azdoCacheService.getSecurityNamespace(this.azdoCacheService.releaseManagementSecurityNamespaceId).actions;
        // console.log(releasePermissionBits);
        // console.log(this.projectReleaseFolders);
        // console.log(this.projectReleaseFolderAcls);
        this.projectReleaseFolderAcls.value.forEach((acl) => {
            for (const key in acl.acesDictionary) {
                if (acl.acesDictionary.hasOwnProperty(key)) {
                    const value = acl.acesDictionary[key];
                    const identity = this.azdoCacheService.getIdentity(key);
                    // console.log(identity);
                }
            }
        });
        // const rootFolder: Folder = this.projectReleaseFolders?.value![0]
        // this.azdoService.getAccessControlLists(
        //   releaseManagementSecurityNamespace.namespaceId!,
        //   `${this.project.id}${this.utilityService.swapSlashes(rootFolder.path)}`
        // ).subscribe(acls => {
        //   acls.value?.forEach(acl => {
        //     this.checkProjectReleaseFolders(acl);
        //   });
        // });
        // this.projectReleaseFolders.value?.forEach(folder => {
        //   const aclResponse = this.azdoService.getAccessControlLists(
        //     releaseManagementSecurityNamespace.namespaceId!,
        //     `${this.project.id}${this.utilityService.swapSlashes(folder.path)}`
        //   ).subscribe(acls => {
        //     acls.value?.forEach(acl => {
        //       this.checkProjectReleaseFolder(folder, acl);
        //     });
        //   })
        // });
    }
    checkProjectReleaseFolders(acl) {
        // console.log(folder);
        // console.log(acl);
    }
}
ProjectSecurityComponent.ɵfac = function ProjectSecurityComponent_Factory(t) { return new (t || ProjectSecurityComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_azdo_connection_service__WEBPACK_IMPORTED_MODULE_4__["AzDoConnectionService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_azdo_service__WEBPACK_IMPORTED_MODULE_5__["AzDoService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_azdo_cache_service__WEBPACK_IMPORTED_MODULE_6__["AzDoCacheService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_snackbar_service__WEBPACK_IMPORTED_MODULE_7__["SnackbarService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_rule_service__WEBPACK_IMPORTED_MODULE_8__["RuleService"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_9__["MatDialog"]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_core_services_utility_service__WEBPACK_IMPORTED_MODULE_10__["UtilityService"])); };
ProjectSecurityComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({ type: ProjectSecurityComponent, selectors: [["app-project-security"]], inputs: { project: "project" }, decls: 3, vars: 2, consts: [[1, "centered"], ["diameter", "30", "mode", "indeterminate", 4, "ngIf"], ["aria-label", "Results", 3, "selectable", 4, "ngIf"], ["diameter", "30", "mode", "indeterminate"], ["aria-label", "Results", 3, "selectable"], ["matBadgeColor", "warn", 3, "matBadge", "matBadgeHidden", "click"]], template: function ProjectSecurityComponent_Template(rf, ctx) { if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, ProjectSecurityComponent_mat_spinner_1_Template, 1, 0, "mat-spinner", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](2, ProjectSecurityComponent_mat_chip_list_2_Template, 5, 3, "mat-chip-list", 2);
    } if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.showProjectSecuritySpinner);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.showProjectSecuritySpinner);
    } }, directives: [_angular_common__WEBPACK_IMPORTED_MODULE_11__["NgIf"], _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_12__["MatSpinner"], _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__["MatChipList"], _angular_material_chips__WEBPACK_IMPORTED_MODULE_13__["MatChip"], _angular_material_badge__WEBPACK_IMPORTED_MODULE_14__["MatBadge"]], styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJwcm9qZWN0LXNlY3VyaXR5LmNvbXBvbmVudC5jc3MifQ== */"] });


/***/ }),

/***/ "v1P3":
/*!***********************************************!*\
  !*** ./src/app/collection/strip-name.pipe.ts ***!
  \***********************************************/
/*! exports provided: StripNamePipe */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StripNamePipe", function() { return StripNamePipe; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _core_services_azdo_connection_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../core/services/azdo-connection.service */ "xHjP");


class StripNamePipe {
    constructor(azDoConnectionService) {
        this.azDoConnectionService = azDoConnectionService;
    }
    transform(value, ...args) {
        return this.azDoConnectionService.getCollectionName(value);
    }
}
StripNamePipe.ɵfac = function StripNamePipe_Factory(t) { return new (t || StripNamePipe)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_core_services_azdo_connection_service__WEBPACK_IMPORTED_MODULE_1__["AzDoConnectionService"])); };
StripNamePipe.ɵpipe = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({ name: "stripName", type: StripNamePipe, pure: true });


/***/ }),

/***/ "xHjP":
/*!**********************************************************!*\
  !*** ./src/app/core/services/azdo-connection.service.ts ***!
  \**********************************************************/
/*! exports provided: AzDoConnectionService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AzDoConnectionService", function() { return AzDoConnectionService; });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "qCKp");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");


class AzDoConnectionService {
    constructor() {
        this.mostRecentApiVersion = '6.0';
        this.currentConnection = { url: 'Connections' };
        const storedConnections = JSON.parse(localStorage.getItem('connections'));
        if (storedConnections === null) {
            this.connections = new Array();
        }
        else {
            this.connections = storedConnections;
            this.connections.forEach(connection => {
                // console.log(connection);
                if (connection.selected) {
                    // console.log("found initial connection");
                    this.currentConnection = connection;
                }
            });
        }
    }
    getCollectionName(connection) {
        let connectionUrl = '';
        if (connection.substring(connection.length - 1) === '/') {
            connectionUrl = connection.slice(0, -1);
        }
        else {
            connectionUrl = connection;
        }
        return connectionUrl.substring(connectionUrl.lastIndexOf('/') + 1);
        // handle case where url is Azure DevOps Services vs. On-Premise Server
    }
    /**
     * Provides a safe way set the current connection to one that exists in the collection
     * Need to figure out how to expose a read only variable that can be updated by a metho
     */
    setConnection(newConnection) {
        const foundConnection = this.findConnection(newConnection.url);
        if (foundConnection) {
            this.connections.forEach(connection => {
                if (connection.url.toLocaleLowerCase() === newConnection.url.toLocaleLowerCase()) {
                    // console.log(`${connection.url} now the current connection`);
                    connection.selected = true;
                    this.currentConnection = connection;
                }
                else {
                    // console.log(`${connection.url} no longer the current connection`);
                    connection.selected = false;
                }
            });
            // console.log(this.connections);
            localStorage.setItem('connections', JSON.stringify(this.connections));
        }
    }
    findConnection(connectionUrl) {
        let foundConnection = null;
        if (this.connections.length > 0) {
            this.connections.forEach(connection => {
                if (connection.url.toLocaleLowerCase() === connectionUrl.toLocaleLowerCase()) {
                    foundConnection = connection;
                }
            });
        }
        return foundConnection;
    }
    addConnection(connection) {
        if (!this.findConnection(connection.url)) {
            this.connections.push(connection);
            localStorage.setItem('connections', JSON.stringify(this.connections));
        }
    }
    deleteConnection(connection) {
        if (this.findConnection(connection.url)) {
            const index = this.connections.indexOf(connection);
            if (index > -1) {
                this.connections.splice(index, 1);
            }
            localStorage.setItem('connections', JSON.stringify(this.connections));
        }
    }
    /**
     * Returns true if able to detect the version, otherwise false
     * @param result The results from REST API call or from a call to getApiVersionFromError
     * @param connectionAttempted The connection whose ApiVerion is updated
     */
    apiVersionFound(result, connectionAttempted) {
        if (result.count) {
            // The happy path, an array of projects returned using the highest supported Api-Version known.
            connectionAttempted.apiVersion = this.mostRecentApiVersion;
            return true;
        }
        else if (result === '6.0' || result === '5.0' || result === '4.0') {
            // This is a downlevel API, supported api version extracted from the error message
            connectionAttempted.apiVersion = result;
            return true;
        }
        return false;
    }
    /**
     * Parses the supported API-Version from the error passed.
     * If a version this application doesn't support is detected provides custom error message.
     * If none of the above the error provided is returned
     * @param error An HTTPResponseError from an attempted Azure DevOps REST API call
     */
    getApiVersionFromError(error) {
        if (error.message.includes('The latest REST API version this server supports is 6.0')) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])('6.0');
        }
        else if (error.message.includes('The latest REST API version this server supports is 5.0')) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])('5.0');
        }
        else if (error.message.includes('The latest REST API version this server supports is 4.0')) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])('4.0');
        }
        else if (error.message.includes('The latest REST API version this server supports is')) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])({ message: 'Endpoint needs to support REST API version 4 or higher' });
        }
        else if (error.message.includes('Invalid api version string')) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])({ message: 'Opps, Microsoft changed the version' });
        }
        else {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_0__["of"])(error);
        }
    }
}
AzDoConnectionService.ɵfac = function AzDoConnectionService_Factory(t) { return new (t || AzDoConnectionService)(); };
AzDoConnectionService.ɵprov = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({ token: AzDoConnectionService, factory: AzDoConnectionService.ɵfac, providedIn: 'root' });


/***/ }),

/***/ "zUnb":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "jhN1");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "ZAI4");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "AytR");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["platformBrowser"]().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ "zn8P":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "zn8P";

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map