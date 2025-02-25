import React, { useContext, useMemo } from 'react';
import { Table, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import { useGetWarehouseTransferByWarehouseId } from '../../hooks/pindahHooks';
import { useIdMutationForCompare } from './useIdMutationForCompare';

const ResentFailedPo: React.FC = () => {
  const navigate = useNavigate();

  const handleRowClick = (record: any) => {
    navigate(`/ulangvalidasi/${record.ref_number}`);
  };

  const userContext = useContext(UserContext);
  const { user } = userContext || {};
  const idOutletLoggedIn = user ? Number(user.id_outlet) : 0;

  const { data: transfers = [], isLoading: loadingTransfers } =
    useGetWarehouseTransferByWarehouseId(idOutletLoggedIn);

  const latestTransfers = useMemo(() => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    return new Set(
      transfers
        .filter(t => 
          t.code === 2 &&
          t.to_warehouse_id === idOutletLoggedIn &&
          new Date(t.trans_date) >= threeDaysAgo
        )
        .map(t => t.ref_number)
    );
  }, [transfers, idOutletLoggedIn]);

  const { getPindahCompare = [], loading: loadingMutations } = useIdMutationForCompare();

  const mutationRefNumbers = useMemo(() => {
    const tigaHariLalu = new Date();
    tigaHariLalu.setDate(tigaHariLalu.getDate() - 3);
    return new Set(
      getPindahCompare
        .filter(item => 
          String(item.ref_number).startsWith("IPO") &&
          new Date(item.trans_date) >= tigaHariLalu &&
          item.to_warehouse_id === idOutletLoggedIn
        )
        .map(item => String(item.ref_number))
    );
  }, [getPindahCompare, idOutletLoggedIn]);

  const differentTransfers = useMemo(() => {
    return transfers
      .filter(t => latestTransfers.has(t.ref_number) && !mutationRefNumbers.has(t.ref_number))
      .map(t => ({
        ref_number: t.ref_number,
        memo: t.memo,
        from_warehouse_id: t.from_warehouse_id,
        trans_date: t.trans_date
      }));
  }, [transfers, latestTransfers, mutationRefNumbers]);

  const columns = [
    { title: 'No PO', dataIndex: 'ref_number', key: 'ref_number' },
    { title: 'Tanggal validasi', dataIndex: 'trans_date', key: 'trans_date' },
    { title: 'Memo', dataIndex: 'memo', key: 'memo' },
  ];

  if (loadingTransfers || loadingMutations) {
    return <Spin tip="Loading data..." />;
  }

  return (
    <div>
      {differentTransfers.length > 0 ? (
        <Table
          dataSource={differentTransfers}
          columns={columns}
          rowKey="ref_number"
          onRow={(record) => ({
            onClick: () => handleRowClick(record) 
          })}
        />
      ) : (
        <p>Tidak ada data yang tersedia</p>
      )}
    </div>
  );
};

export default ResentFailedPo;
