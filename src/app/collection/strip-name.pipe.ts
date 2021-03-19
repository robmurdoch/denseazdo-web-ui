import { Pipe, PipeTransform } from '@angular/core';
import { AzDoConnectionService } from '../core/services/azdo-connection.service';

@Pipe({
  name: 'stripName'
})
export class StripNamePipe implements PipeTransform {

  constructor(
    private azDoConnectionService: AzDoConnectionService,
  ) {    
  }

  transform(value: string, ...args: string[]): string {
    return this.azDoConnectionService.getCollectionName(value);
  }

}
