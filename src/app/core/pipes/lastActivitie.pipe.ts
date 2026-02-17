import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lastActivity'
})
export class LastActivityPipe implements PipeTransform {

  transform(value: Date | string | null | undefined): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeString = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });

    if (isToday) {
      return `Today, ${timeString}`;
    }

    if (isYesterday) {
      return `Yesterday, ${timeString}`;
    }

    const dateString = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return `${dateString} at ${timeString}`;
  }
}
