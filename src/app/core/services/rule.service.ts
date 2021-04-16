import { Injectable } from '@angular/core';
import { Finding, Rule } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class RuleService {

  constructor() { }

  getFinding(rule: Rule, value: string, id: string): Finding {
    return {
      rule: rule,
      value: value,
      id: id
    }
  }

  getUnexpectedCollectionGroupMemberRule(detail: string): Rule {
    return {
      name: "Unexpected collection-level group member (Course Grained)",
      detail: detail,
      description: "Security groups defined at the collection level should be well-known and contain windows or active directory groups."
    }
  }

  getUnexpectedProjectGroupMemberRule(detail: string): Rule {
    return {
      name: "Unexpected project-level group member (Course Grained)",
      detail: detail,
      description: "Security groups defined at thep project level should be well-known and contain only collection level groups."
    }
  }
}
