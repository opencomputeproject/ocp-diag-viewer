import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {SummaryBarComponent} from './summary_bar';
import {SummaryBarModule} from './summary_bar_module';


describe('SummaryBar Component', () => {
  let fixture: ComponentFixture<SummaryBarComponent>;
  let component: SummaryBarComponent;

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
        BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SummaryBarComponent],
      imports: [
        SummaryBarModule,
        NoopAnimationsModule,  // This makes test faster and more stable.
      ],
    });

    fixture = TestBed.createComponent(SummaryBarComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeDefined();
  });
});
