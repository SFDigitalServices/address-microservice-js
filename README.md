# address-microservice-js
This is microservice to transform address data for [form.io](https://form.io) components with [URL Data Source](https://help.form.io/userguide/form-components/#url)

## `api/eas/lookup`

### Query string parameters
* `search` search query to perform address lookup

* additional query parameters supported by [Socrata API](https://dev.socrata.com/docs/queries/)

### Cache Logic
* [`Stale-While-Revalidate`](https://vercel.com/docs/v2/edge-network/caching#stale-while-revalidate)

* Set `max-age` until next refresh based on `EAS_REFRESH_TIME` environment variable
