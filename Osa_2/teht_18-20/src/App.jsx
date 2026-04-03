import { useState, useEffect } from 'react'
import countryService from './services/countries'
import SearchField from './components/SearchField'
import CountrySearchResults from './components/CountrySearchResults'
import CountryDetails from './components/CountryDetails'


const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    countryService.getAll().then(data => {
      setCountries(data)
    })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <SearchField value={search} onChange={handleSearchChange} />

      {selectedCountry
        ? <CountryDetails country={selectedCountry} />
        : <CountrySearchResults
            countries={filteredCountries}
            onSelect={setSelectedCountry}
          />
      }
    </div>
  )
}

export default App
