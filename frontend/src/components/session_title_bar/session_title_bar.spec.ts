import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {SessionTitleBarComponent} from './session_title_bar';
import {SessionTitleBarModule} from './session_title_bar_module';


describe('SessionTitleBar Component', () => {
  let fixture: ComponentFixture<SessionTitleBarComponent>;
  let component: SessionTitleBarComponent;

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
        BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SessionTitleBarComponent],
      imports: [
        SessionTitleBarModule,
        NoopAnimationsModule,  // This makes test faster and more stable.
      ],
    });

    fixture = TestBed.createComponent(SessionTitleBarComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  it('should show title', () => {
    component.title = 'myTitle';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('span').firstChild.nodeValue)
        .toBe('myTitle');
  });

  it('should show badge 1', () => {
    component.badge = 1;
    fixture.detectChanges();

    expect(
        fixture.nativeElement.querySelector('span.mat-badge-content').innerText)
        .toBe('1');
  });

  it('should hide badge', () => {
    component.badge = 0;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('span.mat-badge-hidden'))
        .toBeTruthy();
  });
});
