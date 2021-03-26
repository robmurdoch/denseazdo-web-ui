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
      name: "Unexpected group member",
      detail: detail,
      description: "Security groups defined at the collection level should be well-known and examined by this tool."
    }
  }
}
