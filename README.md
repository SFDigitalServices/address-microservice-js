# address-microservice-js
This is microservice to transform address data for [form.io](https://form.io) components with [URL Data Source](https://help.form.io/userguide/form-components/#url)

## `api/eas/lookup`
Query EAS for list of addresses via partial address string. Example to be used for autocomplete.

### Query string parameters
* `search` search query to perform address lookup

* additional query parameters supported by [Socrata API](https://dev.socrata.com/docs/queries/)



## `api/eas/json`
Query and filter EAS data in JSON
### [Simple Filtering](https://dev.socrata.com/docs/filtering.html)

Example filter by `address`
```
$ curl https://<host>/api/eas/json?address=200%20MAIN%20ST
```
Example filter by `address`, `block`, and `lot`
```
$ curl https://<host>/api/eas/json?address=200%20MAIN%20ST&block=3739&lot=008
```

### [Queries](https://dev.socrata.com/docs/queries/)

Example query `address_number`, `address_number_suffix`, `street_name`, `street_type`, and `unit_number` with `address`, `block`, and `lot`
```
$ curl http://<host>/api/eas/json?$select=address,address_number,address_number_suffix,street_name,street_type,unit_number,block,lot,parcel_number&$where=address=%2777%20VAN%20NESS%20AVE%20%23100%27%20AND%20block%20=%270834%27%20AND%20lot=%27144%27
```

## Cache Logic
* [`Stale-While-Revalidate`](https://vercel.com/docs/v2/edge-network/caching#stale-while-revalidate)

* Set `max-age` until next refresh based on `EAS_REFRESH_TIME` environment variable
