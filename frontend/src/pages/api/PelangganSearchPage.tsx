// import React, { useState, useEffect } from 'react'
// import { Input, Spin, Table, Typography, Modal, Button, message } from 'antd'
// import { searchBasedNamaBarang } from './SearchBasedNamaBarang'

// import { Pelanggan } from '../../types/Pelanggan'
// import {
//   useAddPelanggan,
//   useGetPelanggansQueryDb,
// } from '../../hooks/pelangganHooks'
// import { searchBasedNamaPelanggan } from './SearchBasedNamaPelanggan'
// import { useAddContact } from '../../hooks/contactHooks'


// const { Title } = Typography

// const PelangganSearchPage = () => {
//   const [searchTerm, setSearchTerm] = useState('')
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
//   const { loading, namaPelanggan } =
//     searchBasedNamaPelanggan(debouncedSearchTerm)
//   const [isModalVisible, setIsModalVisible] = useState(false)
//   const [selectedPelanggan, setSelectedPelanggan] = useState<Pelanggan | null>(
//     null
//   )
//   const { mutateAsync: addPelanggan, isLoading: isAdding } = useAddPelanggan()
//   const { mutateAsync: addContact, isLoading: isAddings } = useAddContact()

//   const { data: pelanggans } = useGetPelanggansQueryDb()

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm)
//     }, 500) // Debounce time before API call

//     return () => clearTimeout(timer) // Cleanup timer on unmount or searchTerm change
//   }, [searchTerm])

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value)
//   }

//   const handleRowClick = (record: Pelanggan) => {
//     setSelectedPelanggan(record)
//     setIsModalVisible(true)
//   }

//   const handleModalClose = () => {
//     setIsModalVisible(false)
//     setSelectedPelanggan(null)
//   }

//   const handleSavePelanggan = async () => {
//     if (selectedPelanggan) {
//       const isDuplicate = pelanggans?.some(
//         (pelanggan: Pelanggan) => pelanggan.id === selectedPelanggan.id
//       )

//       if (isDuplicate) {
//         message.warning('Pelanggan sudah ada di Wakanda!')
//         return
//       }

//       try {
//         await addPelanggan(selectedPelanggan)
//         await addContact(selectedPelanggan)
//         setIsModalVisible(false)
//         setSelectedPelanggan(null)
//         message.success('Pelanggan berhasil disimpan!')
//       } catch (error) {
//         console.error('Error saving pelanggan:', error)
//         message.error('Gagal menyimpan pelanggan!')
//       }
//     }
//   }

//   const columns = [
//     {
//       title: 'ID',
//       dataIndex: 'id',
//       key: 'id',
//     },
//     {
//       title: 'Name',
//       dataIndex: 'name',
//       key: 'name',
//     },
//     {
//       title: 'Alamat',
//       dataIndex: 'address',
//       key: 'address',
//     },
//     {
//       title: 'Kontak',
//       dataIndex: 'phone',
//       key: 'phone',
//     },
//     {
//       title: 'Nama Group',
//       dataIndex: ['group', 'name'],
//       key: 'unit',
//     },
//   ]

//   return (
//     <div>
//       <Title level={2}>Search Pelanggan</Title>
//       <Input
//         placeholder="Search for a pelanggan"
//         value={searchTerm}
//         onChange={handleSearchChange}
//         style={{ width: 300, marginBottom: 20 }}
//       />
//       {loading ? (
//         <Spin size="large" />
//       ) : (
//         <Table
//           dataSource={namaPelanggan}
//           columns={columns}
//           rowKey="_id"
//           pagination={false} // Remove pagination to show all data
//           onRow={(record) => ({
//             onClick: () => handleRowClick(record as any),
//           })}
//         />
//       )}

//       <Modal
//         title="Detail Pelanggan"
//         visible={isModalVisible}
//         onCancel={handleModalClose}
//         footer={null}
//       >
//         {selectedPelanggan && (
//           <div>
//             <p>
//               <strong>ID:</strong> {selectedPelanggan.id}
//             </p>
//             <p>
//               <strong>Name:</strong> {selectedPelanggan.name}
//             </p>
//             <p>
//               <strong>Group Pelanggan:</strong> {selectedPelanggan.group_id}
//             </p>
//             <p>
//               <strong>Alamat Pelanggan:</strong>
//               {selectedPelanggan.address}
//             </p>
//             <p>
//               <strong>Nama Group:</strong>{' '}
//               {selectedPelanggan.group?.name || 'N/A'}
//             </p>
//             <p>
//               <strong>Kontak Pelanggan:</strong> {selectedPelanggan.phone}
//             </p>
//             <Button
//               type="primary"
//               onClick={handleSavePelanggan}
//               loading={isAdding}
//               style={{ marginTop: 20 }}
//             >
//               Simpan Pelanggan Baru
//             </Button>
//           </div>
//         )}
//       </Modal>
//     </div>
//   )
// }

// export default PelangganSearchPage
<></>