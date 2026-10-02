import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render a repository view', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.repository-identity')?.textContent).toContain('Public');
    expect(compiled.querySelectorAll('.file-tree button').length).toBeGreaterThan(0);
    expect(compiled.querySelector('.source-code code')?.textContent?.trim().length).toBeGreaterThan(20);
  });
});
