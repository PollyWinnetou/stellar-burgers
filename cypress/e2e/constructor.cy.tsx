/// <reference types="cypress" />
/// <reference path="../support/index.d.ts" />

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Список ингредиентов', () => {
    cy.getIngredientBun().scrollIntoView().should('be.visible');
    cy.getIngredientMain().scrollIntoView().should('be.visible');
    cy.getIngredientSauce().scrollIntoView().should('be.visible');
  });

  it('Должен добавлять ингредиенты в конструктор', () => {
    cy.getIngredientBun()
      .scrollIntoView()
      .find('button')
      .click();

    cy.getIngredientMain()
      .scrollIntoView()
      .find('button')
      .click();

    cy.getIngredientSauce()
      .scrollIntoView()
      .find('button')
      .click();

    cy.get('[data-cy="constructor-bun-top"]').should('be.visible');
    cy.get('[data-cy="constructor-bun-bottom"]').should('be.visible');
    cy.get(
      '[data-cy="constructor-ingredient-643d69a5c3f7b9001cfa0941"]'
    ).should('be.visible');
    cy.get(
      '[data-cy="constructor-ingredient-643d69a5c3f7b9001cfa0942"]'
    ).should('be.visible');
  });
});

describe('Модальные окна ингредиентов', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');

    cy.getIngredientBun()
      .scrollIntoView()
      .should('be.visible');

    cy.getIngredientMain()
      .scrollIntoView()
      .should('be.visible');

    cy.getIngredientSauce()
      .scrollIntoView()
      .should('be.visible');
  });

  it('Открытие модального окна ингредиента', () => {
    cy.getIngredientBun()
      .find('a')
      .click();

    cy.getModal().within(() => {
      cy.get('[data-cy="modal-title"]').should('be.visible');
      cy.contains('Краторная булка N-200i').should('be.visible');
      cy.get('img').should('exist').should('be.visible');
      const nutritionalValues = [
        'Калории, ккал',
        'Белки, г',
        'Жиры, г',
        'Углеводы, г'
      ];
      nutritionalValues.forEach((value) => {
        cy.contains(value).should('be.visible');
      });
      cy.contains(/\d+/).should('be.visible');
    });
  });

  it('Закрытие модального окна по клику на крестик', () => {
    cy.getIngredientBun()
      .find('a')
      .click();

    cy.getModal()
      .should('be.visible')
      .within(() => {
        cy.contains('Краторная булка N-200i').should('be.visible');
      });

    cy.get('[data-cy="modal-close"]').click();

    cy.getModal().should('not.exist');
    cy.getOverlay().should('not.exist');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('Закрытие модального окна по клику на оверлей', () => {
    cy.getIngredientBun()
      .find('a')
      .click();

    cy.getOverlay().should('exist');
    cy.getModal()
      .should('be.visible')
      .within(() => {
        cy.contains('Краторная булка N-200i').should('be.visible');
      });

    cy.getOverlay().click({ force: true });

    cy.getModal().should('not.exist');
    cy.getOverlay().should('not.exist');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.setCookie('accessToken', 'mock-access-token');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().then((win) => {
      win.localStorage.removeItem('refreshToken');
    });
  });

  it('Успешное создание заказа', () => {
    cy.getIngredientBun()
      .scrollIntoView()
      .find('button')
      .click();

    cy.getIngredientMain()
      .scrollIntoView()
      .find('button')
      .click();

    cy.getIngredientSauce()
      .scrollIntoView()
      .find('button')
      .click();

    cy.contains('Краторная булка N-200i (верх)').should('be.visible');
    cy.contains('Краторная булка N-200i (низ)').should('be.visible');
    cy.contains('Биокотлета из марсианской Магнолии').should('be.visible');
    cy.contains('Соус Spicy-X').should('be.visible');

    cy.get('[data-cy="order-button"]')
      .scrollIntoView()
      .should('be.visible')
      .click();

    cy.wait('@createOrder').then((interception) => {
      const orderNumber = interception.response?.body?.order?.number;
      cy.wait(500);
      cy.contains('идентификатор заказа').should('be.visible');
      cy.contains('Ваш заказ начали готовить').should('be.visible');
      cy.contains(orderNumber.toString()).should('be.visible');
    });

    cy.get('[data-cy="modal-close"]').should('exist').click();
    cy.get('[data-cy="order-success-modal"]').should('not.exist');

    cy.get('[data-cy="burger-constructor"]').within(() => {
      cy.contains('Краторная булка N-200i (верх)').should('not.exist');
      cy.contains('Краторная булка N-200i (низ)').should('not.exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('not.exist');
      cy.contains('Соус Spicy-X').should('not.exist');

      cy.contains('Выберите булки').should('be.visible');
      cy.contains('Выберите начинку').should('be.visible');
    });
  });
});
