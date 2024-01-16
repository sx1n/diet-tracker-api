export class InvalidUnitMeasureError extends Error {
  constructor() {
    super("A comida deve conter pelo menos uma medida de unidade");
  }
}
