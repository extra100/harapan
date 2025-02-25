import React, { useEffect, useState } from 'react'
import { Table, Button, Spin } from 'antd'
import {
  useAddPelanggan,
  useGetThenAddPelanggansQuery,
} from '../../hooks/pelangganHooks'

import { useIdNamaPelanggan } from './namaPelanggan'
import { Pelanggan } from '../../types/Pelanggan'

const BatchProcessPelangggans = () => {
  const [offset, setOffset] = useState(0)
  const batchSize = 10
  const [isProcessing, setIsProcessing] = useState(false)
  const [allPelangggans, setAllPelangggans] = useState<Pelanggan[]>([])
  const [pelangganSet, setPelanggganSet] = useState(new Set())
  const { idDataPelanggan } = useIdNamaPelanggan()
  console.log({idDataPelanggan})
  const {
    data: pelanggans,
    refetch,
    isLoading,
  } = useGetThenAddPelanggansQuery(batchSize, offset)
  const addPelanggganMutation = useAddPelanggan()
  const groupNames = idDataPelanggan?.map((item: any) => item.group?.name || null);

  console.log({ groupNames })
  useEffect(() => {
    if (!pelanggans || pelanggans.length === 0) return

    const newPelangggans = pelanggans.filter(
      (pelanggan) => !pelangganSet.has(pelanggan.id)
    )
    setPelanggganSet((prevSet) => {
      const updatedSet = new Set(prevSet)
      newPelangggans.forEach((pelanggan) => updatedSet.add(pelanggan.id))
      return updatedSet
    })

    setAllPelangggans((prevPelangggans) => [
      ...prevPelangggans,
      ...newPelangggans,
    ])

    if (pelanggans.length === batchSize) {
      setTimeout(() => setOffset((prevOffset) => prevOffset + batchSize), 500)
    }
  }, [pelanggans])

  useEffect(() => {
    if (offset > 0) {
      refetch()
    }
  }, [offset])

  const handleSave = async () => {
    setIsProcessing(true);
  
    console.log("Starting save process...");
    for (let i = 0; i < idDataPelanggan.length; i += batchSize) {
      const batch = idDataPelanggan.slice(i, i + batchSize);
      
      console.log("Processing batch:", batch);
  
      for (const pelanggan of batch) {
        try {
          console.log("Saving pelanggan:", pelanggan);
          await addPelanggganMutation.mutateAsync(pelanggan);
          console.log(`Successfully added pelanggan: ${pelanggan.name}`);
        } catch (error) {
          console.error(`Failed to add pelanggan: ${pelanggan.name}`, error);
        }
      }
    }
  
    console.log("Save process completed.");
    setIsProcessing(false);
  };
  

  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      render: (_: any, record: any, index: number) => index + 1,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'group id',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'group id',
      dataIndex: 'group_id',
      key: 'group_id',
    },
    {
      title: 'Nama Group',
      dataIndex: ['group', 'name'],
      key: 'groupName',
    },
  ]

  return (
    <div>
      <h1>Pelangggan List</h1>
      {isLoading ? (
        <Spin tip="Loading pelanggans..." />
      ) : (
        <Table
          dataSource={idDataPelanggan}
          columns={columns}
          rowKey="id"
          // pagination={true}
        />
      )}

      <Button
        type="primary"
        onClick={handleSave}
        disabled={isProcessing || isLoading}
        loading={isProcessing}
        style={{ marginTop: 16 }}
      >
        {isProcessing ? 'Saving...' : 'Save All Pelangggans'}
      </Button>
    </div>
  )
}

export default BatchProcessPelangggans
