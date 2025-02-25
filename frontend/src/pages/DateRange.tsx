import React, { useState, useEffect } from 'react'
import { Col, DatePicker, Row, Slider } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useParams } from 'react-router-dom'
import { useGetTransactionByIdQuery } from '../hooks/transactionHooks'

interface DateRangeProps {
  value?: [string, string]
  difference?: number
  onChange?: (dates: [string, string]) => void
  onDifferenceChange?: (diff: number) => void
  onSave?: (
    startDate: string,
    endDate: string,
    selisih: number,
    termId: number
  ) => void
  defaultValue?: string[] | undefined
}

const DateRange: React.FC<DateRangeProps> = (props) => {
  const { ref_number } = useParams<{ ref_number?: string }>()
  const { data: allTransactions } = useGetTransactionByIdQuery(
    ref_number as string
  )

  const getPosDetail = allTransactions?.find(
    (transaction: any) => transaction.ref_number === ref_number
  )
  // console.log({ getPosDetail })
  const initialStartDate = getPosDetail?.trans_date
    ? dayjs(getPosDetail.trans_date, 'YYYY-MM-DD')
    : dayjs()
  const initialEndDate = getPosDetail?.due_date
    ? dayjs(getPosDetail.due_date, 'YYYY-MM-DD')
    : initialStartDate.add(1, 'day')
  const initialTermId = getPosDetail?.term_id ?? 2

  const [startDate, setStartDate] = useState<Dayjs>(initialStartDate)
  const [endDate, setEndDate] = useState<Dayjs>(initialEndDate)
  const [dateDifference, setDateDifference] = useState<number>(
    initialEndDate.diff(initialStartDate, 'days')
  )
  const [termId, setTermId] = useState<number>(initialTermId)

  useEffect(() => {
    if (props.difference !== undefined && props.difference !== dateDifference) {
      setDateDifference(props.difference)
    }
  }, [props.difference])

  useEffect(() => {
    if (props.onChange) {
      props.onChange([
        startDate.format('DD-MM-YYYY'),
        endDate.format('DD-MM-YYYY'),
      ])
    }
  }, [startDate, endDate])

  useEffect(() => {
    if (props.onDifferenceChange) {
      props.onDifferenceChange(dateDifference)
    }
  }, [dateDifference])

  const handleStartDateChange = (date: Dayjs | null) => {
    if (date) {
      setStartDate(date)
      const newDifference = endDate.diff(date, 'days')
      setDateDifference(newDifference)
    }
  }

  const handleTerminChange = (value: number) => {
    const newEndDate = startDate.add(value, 'days')
    setEndDate(newEndDate)
    setDateDifference(value)

    let newTermId: number
    if (value === 0) newTermId = 2 // COD
    else if (value === 10) newTermId = 7
    else if (value === 14) newTermId = 3
    else if (value === 30) newTermId = 1
    else newTermId = 2

    setTermId(newTermId)

    if (props.onSave) {
      props.onSave(
        startDate.format('DD-MM-YYYY'),
        newEndDate.format('DD-MM-YYYY'),
        value,
        newTermId
      )
    }

    if (props.onDifferenceChange) {
      props.onDifferenceChange(value)
    }
  }

  const marks = {
    0: <strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;COD</strong>,
    10: <strong>10</strong>,
    14: <strong>14</strong>,
    30: <strong>30</strong>,
  }

  return (
    <div style={{ padding: '0px' }}>
      <Row gutter={16} style={{ marginBottom: '10px' }}>
        <Col span={12}>
          <span
            style={{
              display: 'inline-block',
              minWidth: '120px',
              textAlign: 'left',
            }}
          >
            Tgl. Transaksi
          </span>
          <span
            style={{
              display: 'inline-block',
              minWidth: '10px',
              textAlign: 'left',
            }}
          >
            :
          </span>
          <DatePicker
            style={{ width: '70%' }}
            value={startDate}
            onChange={handleStartDateChange}
          />
        </Col>
        <Col span={12} style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              minWidth: '120px',
              textAlign: 'left',
            }}
          >
            Termin (Hari)
          </span>
          <span
            style={{
              display: 'inline-block',
              minWidth: '10px',
              textAlign: 'left',
            }}
          >
            :
          </span>
          <div style={{ display: 'flex', alignItems: 'center', width: '70%' }}>
            <Slider
              marks={marks}
              step={null}
              defaultValue={dateDifference}
              value={dateDifference}
              onChange={handleTerminChange}
              min={0}
              max={30}
              style={{ width: '100%' }}
            />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default DateRange
