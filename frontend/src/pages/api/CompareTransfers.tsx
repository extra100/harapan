import React, { useContext, useMemo } from 'react'
import { Table, Typography, Spin, Card, Badge } from 'antd'
import UserContext from '../../contexts/UserContext'
import { useGetWarehouseTransferByWarehouseId } from '../../hooks/pindahHooks'
import { useIdMutation } from './takeSingleMutation'
import { Link } from 'react-router-dom'
import { useIdMutationForCompare } from './useIdMutationForCompare'

const { Title } = Typography

const CompareTransfers: React.FC = () => {
  const userContext = useContext(UserContext)
  const { user } = userContext || {}
  const idOutletLoggedIn = user ? Number(user.id_outlet) : 0

  const { data: transfers = [], isLoading: loadingTransfers } =
    useGetWarehouseTransferByWarehouseId(idOutletLoggedIn)
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
      

  const { getPindahCompare = [], loading: loadingMutations } = useIdMutationForCompare()

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
    return Array.from(latestTransfers)
      .filter(ref => !mutationRefNumbers.has(ref))
      .map(ref => ({ ref_number: ref }));
  }, [latestTransfers, mutationRefNumbers]);
  



  return (
    <div>
      <Link to={`/bandingkanpo`}>
  {differentTransfers.length > 0 && (
    <Badge
      count="PO BELUM MASUK KE KLEDO"
      style={{
        backgroundColor: 'red',
        color: 'white',
        fontSize: '0.8rem',
        marginLeft: '5px',
      }}
    />
  )}
</Link>

    

    </div>
  )
}

export default CompareTransfers
