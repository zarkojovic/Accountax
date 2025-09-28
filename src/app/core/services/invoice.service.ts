import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private refreshTrigger = new BehaviorSubject<void>(undefined);
  refresh$ = this.refreshTrigger.asObservable();

  triggerRefresh(): void {
    this.refreshTrigger.next();
  }
}
