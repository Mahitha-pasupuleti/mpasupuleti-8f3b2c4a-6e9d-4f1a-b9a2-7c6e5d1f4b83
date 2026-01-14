import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Audit Log</h2>
    <p>List of task changes goes here.</p>
  `
})
export class AuditLogComponent {}
