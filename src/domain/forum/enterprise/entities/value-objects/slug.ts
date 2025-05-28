export class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(slug: string): Slug {
    return new Slug(slug);
  }

  /**
   * @description Receives a string and normalize it as slug
   *
   * @param {string} text
   * @returns {string}
   *
   *@example
   * const slug = Slug.createFromText('Hello World'); // hello-world
   */
  public static createFromText(text: string): Slug {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '');

    return new Slug(slugText);
  }
}
