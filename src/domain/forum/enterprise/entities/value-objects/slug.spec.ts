import { fakerPT_BR as faker } from '@faker-js/faker';

import { Slug } from './slug';

let text: string;

describe('Value Objects - Slug', () => {
  beforeEach(() => {
    text = faker.word.words({ count: 5 });
  });

  it('should create a slug from a text', () => {
    const expectedSlug = faker.helpers.slugify(text).toLowerCase();
    const sut = Slug.createFromText(text);

    expect(sut.value).toEqual(expectedSlug);
  });
});
