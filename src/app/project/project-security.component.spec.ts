import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectSecurityComponent } from './project-security.component';

describe('ProjectSecurityComponent', () => {
  let component: ProjectSecurityComponent;
  let fixture: ComponentFixture<ProjectSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectSecurityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
