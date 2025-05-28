import { WatchedList } from './watched-list';

class NumberWatchedList extends WatchedList<number> {
  compareItems(itemA: number, itemB: number): boolean {
    return itemA === itemB;
  }
}

describe('WatchedList', () => {
  it('should be able to create a watched list with initial items', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    expect(list.getItems()).toHaveLength(3);
  });

  it('should be able to add new items to the list', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.add(4);

    expect(list.getItems()).toHaveLength(4);
    expect(list.getNewItems()).toEqual([4]);
  });

  it('should be able to remove items from the list', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.remove(2);

    expect(list.getItems()).toHaveLength(2);
    expect(list.getRemovedItems()).toEqual([2]);
  });

  it('should be able to add an item even if was removed before', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.remove(2);
    list.add(2);

    expect(list.getItems()).toHaveLength(3);
    expect(list.getRemovedItems()).toEqual([]);
    expect(list.getNewItems()).toEqual([]);
  });

  it('should be able to remove an item even if was added before', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.add(4);
    list.remove(4);

    expect(list.getItems()).toHaveLength(3);
    expect(list.getRemovedItems()).toEqual([]);
    expect(list.getNewItems()).toEqual([]);
  });

  it('should be able to update watched list items', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    list.update([1, 3, 5]);

    expect(list.getItems()).toHaveLength(3);
    expect(list.getRemovedItems()).toEqual([2]);
    expect(list.getNewItems()).toEqual([5]);
  });

  it('should be able verify an item exists', () => {
    const list = new NumberWatchedList([1, 2, 3]);

    const exists = list.exists(2);

    expect(list.getItems()).toHaveLength(3);
    expect(exists).toBe(true);
  });

  it('should be initilize empty watched list', () => {
    const list = new NumberWatchedList();

    expect(list.getItems()).toHaveLength(0);
  });
});
