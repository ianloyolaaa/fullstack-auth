import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Alert, AlertType } from '@app/_models/alert';
import { AlertService } from '@app/_services/alert.services';

@Component({
    selector: 'alert',
    templateUrl: './alert.component.html',
    standalone: false
})
export class AlertComponent implements OnInit, OnDestroy {

    @Input() id: string = 'default-alert';
    @Input() fade: boolean = true;

    alerts: Alert[] = [];

    private alertSubscription!: Subscription;
    private routeSubscription!: Subscription;

    constructor(
        private router: Router,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {

        // subscribe to new alerts
        this.alertSubscription = this.alertService
            .onAlert(this.id)
            .subscribe((alert: Alert) => {

                // clear alerts
                if (!alert.message) {
                    this.alerts = this.alerts.filter(
                        (x: Alert) => x.keepAfterRouteChange
                    );

                    this.alerts.forEach(
                        (x: Alert) => delete x.keepAfterRouteChange
                    );

                    this.scheduleDetectChanges();
                    return;
                }

                // add alert
                this.alerts.push(alert);
                this.scheduleDetectChanges();

                // auto close alert
                if (alert.autoClose) {
                    setTimeout(() => {
                        this.removeAlert(alert);
                    }, 3000);
                }
            });

        // clear alerts on route change
        this.routeSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                this.alertService.clear(this.id);
            }
        });
    }

    ngOnDestroy(): void {

        if (this.alertSubscription) {
            this.alertSubscription.unsubscribe();
        }

        if (this.routeSubscription) {
            this.routeSubscription.unsubscribe();
        }
    }

    removeAlert(alert: Alert): void {

        if (!this.alerts.includes(alert)) {
            return;
        }

        if (this.fade) {

            // fade out alert
            alert.fade = true;
            this.scheduleDetectChanges();

            setTimeout(() => {
                this.alerts = this.alerts.filter(
                    (x: Alert) => x !== alert
                );

                this.scheduleDetectChanges();
            }, 250);

        } else {

            // remove alert immediately
            this.alerts = this.alerts.filter(
                (x: Alert) => x !== alert
            );

            this.scheduleDetectChanges();
        }
    }

    cssClasses(alert: Alert): string {

        if (!alert) {
            return '';
        }

        const classes: string[] = [
            'alert',
            'alert-dismissible',
            'mt-4'
        ];

        const alertTypeClass: Record<number, string> = {
            [AlertType.Success]: 'alert-success',
            [AlertType.Error]: 'alert-danger',
            [AlertType.Info]: 'alert-info',
            [AlertType.Warning]: 'alert-warning'
        };

        if (alert.type !== undefined) {
            classes.push(alertTypeClass[alert.type]);
        }

        if (alert.fade) {
            classes.push('fade');
        }

        return classes.join(' ');
    }

    private scheduleDetectChanges(): void {
        setTimeout(() => {
            this.cdr.detectChanges();
        });
    }
}
