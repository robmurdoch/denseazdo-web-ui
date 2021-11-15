import { Injectable } from '@angular/core';
import { Finding, Rule } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class RuleService {

  constructor() { }

  getFinding(rule: Rule, value: string, id: string): Finding {
    return {
      rule,
      value,
      id
    };
  }

  getUnexpectedCollectionGroupMemberRule(detail: string): Rule {
    return {
      name: 'Unexpected collection-level group member',
      detail,
      description: 'Security groups defined at the collection level should be well-known and contain windows or active directory groups.'
    };
  }

  getUnexpectedProjectGroupMemberRule(detail: string): Rule {
    return {
      name: 'Unexpected project-level group member',
      detail,
      description: 'Security groups defined at the project level should be well-known and contain only collection level groups.'
    };
  }

  getCsvArray(findings: Finding[]): string{
    const csv: string[] = [];
    csv.push('"Rule","Rule Description","Group","Member Id","Member Name"');
    findings.forEach(finding => {
      csv.push(`"${finding.rule.name}","${finding.rule.description}","${finding.rule.detail}","${finding.id}","${finding.value}"`);
    });
    const csvArray = csv.join('\r\n');
    return csvArray;
  }
}
