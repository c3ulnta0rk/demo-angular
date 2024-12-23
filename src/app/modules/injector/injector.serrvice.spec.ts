import { TestBed } from '@angular/core/testing';
import { ComponentRef, Renderer2, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { C3InjectorService } from './injector.service';
import { C3TestComponent } from './components/c3-injector-test.component';


describe('C3InjectorService (Browser)', () => {
  let service: C3InjectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [C3TestComponent],
      providers: [
        C3InjectorService,
        {
          provide: PLATFORM_ID,
          useValue: 'browser', // forcer l'environnement "navigateur"
        },
      ],
    });
    service = TestBed.inject(C3InjectorService);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it("devrait injecter le composant dans le DOM (plateforme 'browser')", () => {
    const componentRef = service.injectComponent(C3TestComponent) as ComponentRef<C3TestComponent>;
    expect(componentRef).toBeTruthy();

    // Vérifier qu'un div avec la classe .injected-component est ajouté au document.body
    const injectedDiv = document.body.querySelector('.injected-component');
    expect(injectedDiv).toBeTruthy();
    // Vérifier le contenu du composant
    expect(injectedDiv?.textContent).toContain('Test component content');
  });

  it("devrait retirer le composant du DOM lors de l'appel à removeComponent()", () => {
    const componentRef = service.injectComponent(C3TestComponent) as ComponentRef<C3TestComponent>;
    expect(componentRef).toBeTruthy();

    // On s'assure que le composant est bien présent
    const injectedDiv = document.body.querySelector('.injected-component');
    expect(injectedDiv).toBeTruthy();

    // On supprime
    service.removeComponent(componentRef);

    // Vérifier que le conteneur a bien été supprimé du DOM
    const stillThere = document.body.querySelector('.injected-component');
    expect(stillThere).toBeFalsy();
  });
});

describe('C3InjectorService (Server)', () => {
  let service: C3InjectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [C3TestComponent],
      providers: [
        C3InjectorService,
        {
          provide: PLATFORM_ID,
          useValue: 'server', // forcer l'environnement "server"
        },
      ],
    });
    service = TestBed.inject(C3InjectorService);
  });

  it("ne devrait pas injecter le composant si isPlatformServer est 'true'", () => {
    const componentRef = service.injectComponent(C3TestComponent);
    // Vérifier que rien n'a été injecté, car on fait return si server
    expect(componentRef).toBeUndefined();

    // Vérifier qu'aucun div n'a été ajouté
    const injectedDiv = document.body.querySelector('.injected-component');
    expect(injectedDiv).toBeNull();
  });
});
