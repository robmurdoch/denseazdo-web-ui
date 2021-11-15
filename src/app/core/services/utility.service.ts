import { Injectable } from '@angular/core';
import { Collection, SecurityNamespace } from '../shared/azdo-types';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  downloadCsvFile(csvArray: string, fileName: string): void {
    const a = document.createElement('a');
    const blob = new Blob([csvArray], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  swapSlashes(source: string): string{
    return source.replace(/\\/g, '/');
  }
}
