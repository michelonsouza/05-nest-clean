export abstract class WatchedList<DataType> {
  public currentItems: DataType[];
  #initial: DataType[];
  #new: DataType[];
  #removed: DataType[];

  constructor(initialItems?: DataType[]) {
    this.#initial = initialItems || [];
    this.currentItems = initialItems || [];
    this.#new = [];
    this.#removed = [];
  }

  abstract compareItems(itemA: DataType, itemB: DataType): boolean;

  public getItems(): DataType[] {
    return this.currentItems;
  }

  public getNewItems(): DataType[] {
    return this.#new;
  }

  public getRemovedItems(): DataType[] {
    return this.#removed;
  }

  #isCurrentItem(item: DataType): boolean {
    return (
      this.currentItems.filter((currentItem) =>
        this.compareItems(currentItem, item),
      ).length !== 0
    );
  }

  #isNewItem(item: DataType): boolean {
    return (
      this.#new.filter((newItem) => this.compareItems(newItem, item)).length !==
      0
    );
  }

  #isRemovedItem(item: DataType): boolean {
    return (
      this.#removed.filter((removedItem) =>
        this.compareItems(removedItem, item),
      ).length !== 0
    );
  }

  #removeFromNew(item: DataType): void {
    this.#new = this.#new.filter(
      (newItem) => !this.compareItems(newItem, item),
    );
  }

  #removeFromCurrent(item: DataType): void {
    this.currentItems = this.currentItems.filter(
      (currentItem) => !this.compareItems(currentItem, item),
    );
  }

  #removeFromRemoved(item: DataType): void {
    this.#removed = this.#removed.filter(
      (removedItem) => !this.compareItems(removedItem, item),
    );
  }

  #wasAddedInitially(item: DataType): boolean {
    return (
      this.#initial.filter((initialItem) =>
        this.compareItems(initialItem, item),
      ).length !== 0
    );
  }

  public exists(item: DataType): boolean {
    return this.#isCurrentItem(item);
  }

  public add(item: DataType): void {
    if (this.#isRemovedItem(item)) {
      this.#removeFromRemoved(item);
    }

    if (!this.#isNewItem(item) && !this.#wasAddedInitially(item)) {
      this.#new.push(item);
    }

    if (!this.#isCurrentItem(item)) {
      this.currentItems.push(item);
    }
  }

  public remove(item: DataType): void {
    this.#removeFromCurrent(item);

    if (this.#isNewItem(item)) {
      this.#removeFromNew(item);

      return;
    }

    if (!this.#isRemovedItem(item)) {
      this.#removed.push(item);
    }
  }

  public update(items: DataType[]): void {
    const newItems = items.filter(
      (item) => !this.getItems().some((i) => this.compareItems(item, i)),
    );

    const removedItems = this.getItems().filter(
      (item) => !items.some((i) => this.compareItems(item, i)),
    );

    this.currentItems = items;
    this.#new = newItems;
    this.#removed = removedItems;
  }
}
