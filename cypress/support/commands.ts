import { SELECTORS } from './selectors';

Cypress.Commands.add('getIngredientBun', () => {
  cy.get(SELECTORS.INGREDIENT_BUN);
});

Cypress.Commands.add('getIngredientMain', () => {
  cy.get(SELECTORS.INGREDIENT_MAIN);
});

Cypress.Commands.add('getIngredientSauce', () => {
  cy.get(SELECTORS.INGREDIENT_SAUCE); 
});

Cypress.Commands.add('getModal', () => {
  cy.get(SELECTORS.MODAL);
});

Cypress.Commands.add('getOverlay', () => {
  cy.get(SELECTORS.OVERLAY);
});