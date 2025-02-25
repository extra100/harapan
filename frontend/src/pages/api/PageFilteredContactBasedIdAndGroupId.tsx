import React, { useState, useEffect, useContext } from 'react'
import { Select, Row, Col, Table, Input } from 'antd'
import { useIdContact } from './NamaContact'
import { useNavigate } from 'react-router-dom'
import { useGetContactsQuery } from '../../hooks/contactHooks'
import { TakePiutangToPerContactStatusIdAndMemoMny } from './TakePiutangToPerContactStatusIdAndMemoMny'

import { useUserDataQuery } from '../../hooks/userHooks'
import UserContext from '../../contexts/UserContext'

const { Option } = Select

const FilteredContact: React.FC = () => {
  const navigate = useNavigate()
  const { data: contacts } = useGetContactsQuery()
  const { data: users } = useUserDataQuery()
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  let idOutletLoggedIn = ''

  if (user) {
    idOutletLoggedIn = user.id_outlet
  }
  console.log({ idOutletLoggedIn })
  const outletName =
    (Array.isArray(users) &&
      users.find((user) => user.id_outlet === idOutletLoggedIn)?.name) ||
    'Outlet Tidak Diketahui'
  console.log({ outletName })

  const matchingGroupName = Array.isArray(contacts)
    ? contacts.find(
        (contact) =>
          typeof contact.group === 'object' &&
          contact.group?.name === outletName
      )?.group?.name
    : 'Grup Tidak Ditemukan'
  console.log({ matchingGroupName })

  const [selectedContactGroup, setSelectedContactGroup] = useState<any | null>(
    Array.isArray(contacts)
      ? contacts.find(
          (contact: any) =>
            typeof contact.group === 'object' &&
            contact.group?.name === matchingGroupName
        )?.group?.id ?? null
      : null
  )
  const { idContact } = useIdContact(selectedContactGroup)
 

  const [filteredContacts, setFilteredContacts] = useState<any[]>([])

  const handleContactGroupChange = (value: string) => {
    setSelectedContactGroup(value)
  }
  const [searchName, setSearchName] = useState<string>('')

  useEffect(() => {
    let contactsToDisplay = idContact || []
  
    if (selectedContactGroup) {
      contactsToDisplay = contactsToDisplay.filter(
        (contact: any) =>
          contact.group_id === selectedContactGroup &&
          parseFloat(contact.receivable) !== 0
      )
    }
  
    if (searchName) {
      contactsToDisplay = contactsToDisplay.filter((contact: any) =>
        contact.name.toLowerCase().includes(searchName.toLowerCase())
      )
    }
  
    // Sort contacts by receivable in descending order
    contactsToDisplay = contactsToDisplay.sort(
      (a: any, b: any) => b.receivable - a.receivable
    )
  
    setFilteredContacts(contactsToDisplay)
  }, [selectedContactGroup, idContact, searchName])
  
  const columns = [
    {
      title: 'Nama Outlet',
      dataIndex: 'group_name',
      key: 'group_name',
    },
    {
      title: 'Nama Pelanggan',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Id Pelanggan',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => navigate(`/detailpiutangperkontak?id=${id}`)}
        >
          {id}
        </span>
      ),
    },
    {
      title: 'Piutang/Pelanggan',
      dataIndex: 'receivable',
      key: 'receivable',
      render: (receivable: number) => (
        <div style={{ textAlign: 'right' }}>
          {`Rp ${Math.round(receivable)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`}
        </div>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: '10px' }}>
        <Col span={12}>
          <Select
            showSearch
            placeholder="Pilih Kontak Group"
            style={{ width: '70%' }}
            optionFilterProp="label"
            filterOption={(input: any, option: any) =>
              option?.label
                ?.toString()
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            value={selectedContactGroup}
            onChange={handleContactGroupChange}
          >
            {Array.isArray(contacts) &&
              [
                ...new Map(
                  contacts.map((item) => [item.group_id, item])
                ).values(),
              ].map((item) => (
                <Option
                  key={item.group_id}
                  value={item.group_id}
                  label={item.group_id}
                >
                  {item.group?.name ?? 'Unknown Group'}{' '}
                </Option>
              ))}
          </Select>
        </Col>
        <Col span={12}>
          <Input
            placeholder="Cari Nama Pelanggan"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>

      <Table
  dataSource={filteredContacts.map((contact) => ({
    key: contact.id,
    id: contact.id,
    name: contact.name,
    group_name: contact.group_name,
    receivable: contact.receivable,
  }))}
  columns={columns}
  rowKey="id"
  pagination={{ pageSize: 100 }} // Tambahkan pagination dengan pageSize 100
  summary={(pageData) => {
    let totalAmount = 0

    pageData.forEach(({ receivable: amount }) => {
      totalAmount += Number(amount)
    })

    return (
      <Table.Summary.Row>
        <Table.Summary.Cell index={0} colSpan={2}>
          <div style={{ textAlign: 'left' }}>
            <strong>Total</strong>
          </div>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={0} colSpan={2}>
          <div style={{ textAlign: 'right' }}>
            <strong>{`${totalAmount.toLocaleString()}`}</strong>
          </div>
        </Table.Summary.Cell>
      </Table.Summary.Row>
    )
  }}
/>

    </div>
  )
}

export default FilteredContact
