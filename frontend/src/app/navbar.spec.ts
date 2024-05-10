import {TestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';

import {AppModule} from './app.module';
import {NavbarComponent} from './navbar';

describe('Navbar Component', () => {
  beforeAll(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(
        BrowserDynamicTestingModule, platformBrowserDynamicTesting());
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule, RouterTestingModule,
        NoopAnimationsModule,  // This makes test faster and more stable.
      ],
    });
  });

  it('should be created', () => {
    const comp = TestBed.createComponent(NavbarComponent);
    expect(comp).toBeTruthy();
  });
});
