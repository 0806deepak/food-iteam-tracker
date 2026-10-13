import { InventoryItem, SortField, SortOrder } from '../types/inventory';

/**
 * Reusable sorting utility for inventory items
 */
export function sortInventory(
  items: InventoryItem[],
  field: SortField = 'expiryDate',
  order: SortOrder = 'asc'
): InventoryItem[] {
  const sorted = [...items];

  sorted.sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'expiryDate': {
        const timeA = new Date(a.expiryDate).getTime() || 0;
        const timeB = new Date(b.expiryDate).getTime() || 0;
        comparison = timeA - timeB;
        break;
      }
      case 'manufactureDate': {
        const timeA = new Date(a.manufactureDate).getTime() || 0;
        const timeB = new Date(b.manufactureDate).getTime() || 0;
        comparison = timeA - timeB;
        break;
      }
      case 'productName': {
        comparison = a.productName.localeCompare(b.productName, undefined, { sensitivity: 'base' });
        break;
      }
      case 'quantity': {
        comparison = (a.quantity || 0) - (b.quantity || 0);
        break;
      }
      case 'category': {
        comparison = a.category.localeCompare(b.category);
        break;
      }
      case 'createdAt': {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        comparison = timeA - timeB;
        break;
      }
      default:
        comparison = 0;
    }

    return order === 'desc' ? -comparison : comparison;
  });

  return sorted;
}
