declare namespace Cypress {
  interface Chainable {
    // Ингредиенты
    getIngredientBun(): Chainable<JQuery<HTMLElement>>;
    getIngredientMain(): Chainable<JQuery<HTMLElement>>;
    getIngredientSauce(): Chainable<JQuery<HTMLElement>>;

    // Модальные окна
    getModal(): Chainable<JQuery<HTMLElement>>;
    getOverlay(): Chainable<JQuery<HTMLElement>>;
  }
}
