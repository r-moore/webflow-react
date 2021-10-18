import React from 'react';
import ReactDOM from 'react-dom';
import {
  Provider,
  createClient,
  cacheExchange,
  fetchExchange,
  useQuery,
  gql,
} from 'urql';

const client = createClient({
  url: 'https://countries.trevorblades.com/',
  exchanges: [cacheExchange, fetchExchange],
});

const CountryList = () => {
  const selectedCountry = window.location.search.replace('?=', '') || null;

  const [{ data, fetching, stale }] = useQuery({
    query: selectedCountry
      ? gql`
          query ($code: ID!) {
            country(code: $code) {
              name
              native
              phone
              continent {
                name
              }
              capital
              currency
              languages {
                name
              }
              states {
                name
              }
            }
          }
        `
      : gql`
          query {
            countries {
              name
              code
            }
          }
        `,
    variables: { code: selectedCountry },
  });

  if (fetching) return <p>loading...</p>;

  if (data) {
    if (data.country)
      return (
        <ul>
          <a href="/" className="underline text-blue-500">
            Back to country list
          </a>
          <li>
            Name: {data.country.name} ({data.country.native})
          </li>
          <li>Continent: {data.country.continent.name}</li>
          <li>Currency: {data.country.currency}</li>
          <li>Phone: +{data.country.phone}</li>
          <li>
            Languages:{' '}
            <ul className="flex-col pl-5">
              {data.country.languages.map(({ name }) => (
                <li>{name}</li>
              ))}
            </ul>
          </li>
          <li>Capital: {data.country.capital}</li>
          {data.country.states.length > 0 && (
            <li>
              States:{' '}
              <ul className="flex-col pl-5">
                {data.country.states.map(({ name }) => (
                  <li>{name}</li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      );
    else if (data.countries)
      return (
        <div className="grid grid-cols-3 gap-4 pt-4">
          {data.countries
            .sort(({ name: a }, { name: b }) => (a < b ? -1 : a > b ? 1 : 0))
            .map(({ name, code }) => (
              <a href={`/?=${code}`} key={code}>
                <div className="p-5 rounded shadow bg-blue-100 text-gray-800 hover:bg-blue-300">
                  {name}
                </div>
              </a>
            ))}
        </div>
      );
  }
};

ReactDOM.render(
  <React.StrictMode>
    <Provider value={client}>
      <p>This is a React component inside of Webflow!</p>
      <p>
        It fetches live data from the GraphQL API at
        https://countries.trevorblades.com/
      </p>
      <CountryList />
    </Provider>
  </React.StrictMode>,
  document.getElementById('react-target')
);
