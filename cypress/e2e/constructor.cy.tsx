import type {} from 'cypress';

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Список ингредиентов', () => {
    cy.get('[data-cy="ingredient-bun-643d69a5c3f7b9001cfa093c"]')
      .scrollIntoView()
      .should('be.visible');

    cy.get('[data-cy="ingredient-main-643d69a5c3f7b9001cfa0941"]')
      .scrollIntoView()
      .should('be.visible');

    cy.get('[data-cy="ingredient-sauce-643d69a5c3f7b9001cfa0942"]')
      .scrollIntoView()
      .should('be.visible');
  });

  it('должен добавлять ингредиенты в конструктор', () => {
    cy.get('[data-cy="ingredient-bun-643d69a5c3f7b9001cfa093c"]')
      .scrollIntoView()
      .find('button')
      .click();

    cy.get('[data-cy="ingredient-main-643d69a5c3f7b9001cfa0941"]')
      .scrollIntoView()
      .find('button')
      .click();

    cy.get('[data-cy="ingredient-sauce-643d69a5c3f7b9001cfa0942"]')
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

    cy.get('[data-cy="ingredient-bun-643d69a5c3f7b9001cfa093c"]')
      .scrollIntoView()
      .should('be.visible');

    cy.get('[data-cy="ingredient-main-643d69a5c3f7b9001cfa0941"]')
      .scrollIntoView()
      .should('be.visible');

    cy.get('[data-cy="ingredient-sauce-643d69a5c3f7b9001cfa0942"]')
      .scrollIntoView()
      .should('be.visible');
  });

  it('Открытие модального окна ингредиента', () => {
    cy.get('[data-cy="ingredient-bun-643d69a5c3f7b9001cfa093c"]')
      .find('a')
      .click();

    cy.get('[data-cy="modal"]').within(() => {
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
    cy.get('[data-cy="ingredient-bun-643d69a5c3f7b9001cfa093c"]')
      .find('a')
      .click();

    cy.get('[data-cy="modal"]')
      .should('be.visible')
      .within(() => {
        cy.contains('Краторная булка N-200i').should('be.visible');
      });

    cy.get('[data-cy="modal-close"]').click();

    cy.get('[data-cy="modal"]').should('not.exist');
    cy.get('[data-cy="modal-overlay"]').should('not.exist');
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('Закрытие модального окна по клику на оверлей', () => {
    cy.get('[data-cy="ingredient-bun-643d69a5c3f7b9001cfa093c"]')
      .find('a')
      .click();

    cy.get('[data-cy="modal-overlay"]').should('exist');
    cy.get('[data-cy="modal"]')
      .should('be.visible')
      .within(() => {
        cy.contains('Краторная булка N-200i').should('be.visible');
      });

    cy.get('[data-cy="modal-overlay"]').click({ force: true });

    cy.get('[data-cy="modal"]').should('not.exist');
    cy.get('[data-cy="modal-overlay"]').should('not.exist');
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
    cy.get('[data-cy="ingredient-bun-643d69a5c3f7b9001cfa093c"]')
      .scrollIntoView()
      .find('button')
      .click();

    cy.get('[data-cy="ingredient-main-643d69a5c3f7b9001cfa0941"]')
      .scrollIntoView()
      .find('button')
      .click();

    cy.get('[data-cy="ingredient-sauce-643d69a5c3f7b9001cfa0942"]')
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
