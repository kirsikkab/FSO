import CountryDetails from './CountryDetails'

const CountrySearchResults = ({ countries, onSelect }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length > 1) {
    return (
      <ul>
        {countries.map(country => (
          <li key={country.name.common}>
            {country.name.common}
            <button onClick={() => onSelect(country)}>
              show
            </button>
          </li>
        ))}
      </ul>
    )
  }

  if (countries.length === 1) {
  return <CountryDetails country={countries[0]} />
  }

  return null
}


export default CountrySearchResults 