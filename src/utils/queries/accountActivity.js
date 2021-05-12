export default `query ($address: String!) {
  transactions (filter: {
    account_addr: {
      eq: $address
    }
  }) {
    id
    aborted
    status
    lt(format: DEC)
    balance_delta(format: DEC)
  }
  
  aggregateTransactions(
    filter: {
      account_addr: {
        eq: "0:e4a74221c8ae35fd2404f844832749982c316b3c09f23088f049dbfec54e07fa"
      }
    }
    
    fields: [{
      field: "id"
      fn: COUNT
    }]
  )
}`
