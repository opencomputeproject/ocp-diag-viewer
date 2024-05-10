import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatExpansionPanelHarness} from '@angular/material/expansion/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {ToggleJsonViewerComponent} from './toggle_json_viewer';
import {ToggleJsonViewerModule} from './toggle_json_viewer_module';


describe('ToggleJsonViewer Component', () => {
  let component: ToggleJsonViewerComponent;
  let fixture: ComponentFixture<ToggleJsonViewerComponent>;
  let loader: HarnessLoader;
  let panel: MatExpansionPanelHarness;

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
        BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ToggleJsonViewerComponent],
      imports: [
        ToggleJsonViewerModule,
        NoopAnimationsModule,  // This makes test faster and more stable.
      ],
    });
    fixture = TestBed.createComponent(ToggleJsonViewerComponent);
    component = fixture.componentInstance;
    component.json = {
      'test': 'data',
    };
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    panel = await loader.getHarness(MatExpansionPanelHarness);
  });

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  it('should be collapsed by default', async () => {
    expect(component.openPanel).toBeFalse();
    expect(await panel.isExpanded()).toBeFalse();

    // test for lazy load: not yet loaded
    expect(await panel.getTextContent()).toBe('');
  });

  it('should be expandable', async () => {
    await panel.toggle();
    expect(await panel.isExpanded()).toBeTrue();

    // test for lazy load: loaded
    expect(await panel.getTextContent()).withContext('data').toBeTruthy();
  });
});

describe('ToggleJsonViewer Component Expanded by default', () => {
  let component: ToggleJsonViewerComponent;
  let fixture: ComponentFixture<ToggleJsonViewerComponent>;
  let loader: HarnessLoader;
  let panel: MatExpansionPanelHarness;

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
        BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ToggleJsonViewerComponent],
      imports: [
        ToggleJsonViewerModule,
        NoopAnimationsModule,  // This makes test faster and more stable.
      ],
    });
    fixture = TestBed.createComponent(ToggleJsonViewerComponent);
    component = fixture.componentInstance;
    component.openPanel = true;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    panel = await loader.getHarness(MatExpansionPanelHarness);
  });

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  it('should be expanded by default', async () => {
    expect(component.openPanel).toBeTrue();
    expect(await panel.isExpanded()).toBeTrue();
  });

  it('should be collapsed', async () => {
    await panel.toggle();
    expect(await panel.isExpanded()).toBeFalse();
  });
});
