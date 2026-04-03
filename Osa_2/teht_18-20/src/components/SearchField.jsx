const SearchField = ({ value, onChange }) => {
  return (
    <p>
      find countries{' '}
      <input value={value} onChange={onChange} />
    </p>
  )
}

export default SearchField