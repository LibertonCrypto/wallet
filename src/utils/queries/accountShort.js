export default `query ($id: String!) {
  accounts (filter: {
    id: {
      eq: $id
    }
  }) {
    boc
    acc_type
    last_paid
    code_hash
    balance(format: DEC)
  }
}`
