import { useState, useEffect } from 'react';
import { HOST } from '../../config';
import TOKEN from '../../token';

export interface StokWarehouse {
  id: string;

  warehouse_id: number;
  qty: number;
  product_val: number;
  avg_price: number;
}

export function useStokWarehouse(productIds: string, transDate: string) {
  const [loading, setLoading] = useState(true);
  const [stokWarehouse, setStokWarehouse] = useState<StokWarehouse[]>([]);
  const cacheKey = `${productIds}_${transDate}`;
  const cache = new Map<string, StokWarehouse[]>();

  const fetchWarehouseStock = async () => {
    const response = await fetch(
      `${HOST}/finance/products/stocks?product_ids=${productIds}&trans_date=${transDate}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch warehouse stock');
    }

    const data = await response.json();

    const transformedData: StokWarehouse[] = [];
    data.data.forEach((item: any) => {
      Object.values(item.stocks).forEach((stock: any) => {
        transformedData.push({
          id: item.id,
          warehouse_id: stock.warehouse_id,
          qty: stock.qty || 0,
          product_val: stock.product_val || 0,
          avg_price: stock.avg_price || 0,
        });
      });
    });

    return transformedData;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Check if data is cached
      if (cache.has(cacheKey)) {
        setStokWarehouse(cache.get(cacheKey) || []);
        setLoading(false);
        return;
      }

      try {
        const allWarehouseStock = await fetchWarehouseStock();

        // Set the fetched data
        setStokWarehouse(allWarehouseStock);

        // Cache the result
        cache.set(cacheKey, allWarehouseStock);
      } catch (error) {
        console.error('Error fetching warehouse stock:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productIds, transDate]);

  return { stokWarehouse, loading };
}
