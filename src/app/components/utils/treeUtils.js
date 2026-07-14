export function removeItemById(items, id) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      const removed = items[i];
      const newItems = [...items.slice(0, i), ...items.slice(i + 1)];
      return { items: newItems, removed };
    }
    if (items[i].children?.length) {
      const result = removeItemById(items[i].children, id);
      if (result.removed) {
        const newItems = items.map((it, idx) =>
          idx === i ? { ...it, children: result.items } : it,
        );
        return { items: newItems, removed: result.removed };
      }
    }
  }
  return { items, removed: null };
}

export function insertAtTarget(items, containerId, targetIndex, newItem) {
  if (containerId === null) {
    const copy = [...items];
    copy.splice(targetIndex, 0, newItem);
    return copy;
  }
  return items.map((it) => {
    if (it.id === containerId) {
      const children = it.children ? [...it.children] : [];
      children.splice(targetIndex, 0, newItem);
      return { ...it, children };
    }
    if (it.children?.length) {
      return {
        ...it,
        children: insertAtTarget(
          it.children,
          containerId,
          targetIndex,
          newItem,
        ),
      };
    }
    return it;
  });
}

export function findLocation(items, id, parentId = null) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) return { parentId, index: i };
    if (items[i].children?.length) {
      const found = findLocation(items[i].children, id, items[i].id);
      if (found) return found;
    }
  }
  return null;
}

export function findItemById(items, id) {
  for (const it of items) {
    if (it.id === id) return it;
    if (it.children?.length) {
      const found = findItemById(it.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function updateItemById(items, id, updater) {
  return items.map((it) => {
    if (it.id === id) return updater(it);
    if (it.children?.length) {
      return { ...it, children: updateItemById(it.children, id, updater) };
    }
    return it;
  });
}
