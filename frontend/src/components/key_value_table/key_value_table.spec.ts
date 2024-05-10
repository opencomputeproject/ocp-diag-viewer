import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatExpansionPanelHarness} from '@angular/material/expansion/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {KeyValueTableComponent} from './key_value_table';
import {KeyValueTableModule} from './key_value_table_module';


describe('KeyValueTableComponent Component', () => {
  let fixture: ComponentFixture<KeyValueTableComponent>;
  let component: KeyValueTableComponent;
  let loader: HarnessLoader;

  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
        BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [KeyValueTableComponent],
      imports: [
        KeyValueTableModule,
        NoopAnimationsModule,  // This makes test faster and more stable.
      ],
    });

    fixture = TestBed.createComponent(KeyValueTableComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  it('should list keys and values.', () => {
    component.dataSource = [
      ['Integer', 12], ['String', 'string'], ['Array', ['a', 'b']],
      ['Object', {a: 'a', b: 'b'}]
    ];
    fixture.detectChanges();

    const keyEls = fixture.nativeElement.querySelectorAll('td.mat-column-key');
    expect(keyEls.length).toBe(component.dataSource.length);
    for (let i = 0; i < keyEls.length; i++) {
      expect(keyEls[i].innerText).toBe(component.dataSource[i][0]);
    }

    const valueEls =
        fixture.nativeElement.querySelectorAll('td.mat-column-value');
    expect(valueEls.length).toBe(component.dataSource.length);
    expect(valueEls[0].innerText).toBe('12');
    expect(valueEls[1].innerText).toBe('string');
    // array, value should be displayed by toggle-json-viewer.
    expect(valueEls[2].querySelector('toggle-json-viewer')).toBeTruthy();
    expect(valueEls[3].querySelector('toggle-json-viewer')).toBeTruthy();
  });

  it('panel should be closed by default.', async () => {
    component.dataSource = [['Object', {a: 'a', b: 'b'}]];
    fixture.detectChanges();
    const panel: MatExpansionPanelHarness =
        await loader.getHarness(MatExpansionPanelHarness);

    expect(await panel.isExpanded()).toBe(false);
  });

  it('panel should be opened.', async () => {
    component.dataSource = [['Object', {a: 'a', b: 'b'}]];
    component.openAllPanels = true;
    fixture.detectChanges();
    const panel: MatExpansionPanelHarness =
        await loader.getHarness(MatExpansionPanelHarness);

    expect(await panel.isExpanded()).toBe(true);
  });
});
