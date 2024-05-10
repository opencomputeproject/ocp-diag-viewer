import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatExpansionPanelHarness} from '@angular/material/expansion/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';

import {AppModule} from './app.module';
import {SideInfoComponent} from './side_info';

describe('SideInfo Component', () => {
  let fixture: ComponentFixture<SideInfoComponent>;
  let component: SideInfoComponent;
  let loader: HarnessLoader;

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
        BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideInfoComponent],
      imports: [
        AppModule, RouterTestingModule,
        NoopAnimationsModule,  // This makes test faster and more stable.
      ],
    });

    fixture = TestBed.createComponent(SideInfoComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be', async () => {
    component.sideInfo = {
      title: 'myTitle',
      subtitle: 'mySubtitle',
      info: [['key1', 'value1'], ['Object', {a: 'a', b: 'b'}]],
    };
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.side-info-title').innerText)
        .toBe('myTitle');
    expect(fixture.nativeElement.querySelector('.side-info-subtitle').innerText)
        .toBe('mySubtitle');
    expect(fixture.nativeElement.querySelectorAll(
               'key-value-table table tbody tr'))
        .toHaveSize(2);
    const panel: MatExpansionPanelHarness =
        await loader.getHarness(MatExpansionPanelHarness);

    expect(await panel.isExpanded()).toBe(true);
  });
});
