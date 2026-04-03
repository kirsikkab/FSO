const CountryDetails = ({ country }) => {
  const languages = Object.values(country.languages || {})

  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>Capital {country.capital?.[0]}</p>
      <p>Area {country.area}</p>

      <h2>Languages</h2>
      <ul>
        {languages.map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={`flag of ${country.name.common}`}
        width="150"
      />
    </div>
  )
}

export default CountryDetails