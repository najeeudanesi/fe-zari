import { Loader } from '@googlemaps/js-api-loader'

export const useGoogleMap = () => {
  const config = useRuntimeConfig()
  const loader = new Loader({
    apiKey: config.public.googleApiKey,
    version: 'quarterly',
    libraries: ['places']
  })
  let google: Awaited<ReturnType<typeof loader.load>>
  const mapRef = ref<HTMLDivElement>()
  const searchPlaces = async (
    input: string
  ): Promise<
    [
      google.maps.places.QueryAutocompletePrediction[] | null,
      google.maps.places.PlacesServiceStatus
    ]
  > => {
    if (!google) {
      google = await loader.load()
    }
    return new Promise((resolve) => {
      if (!input)
        return resolve([
          null,
          google.maps.places.PlacesServiceStatus.INVALID_REQUEST
        ])
      const service = new google.maps.places.AutocompleteService()
      service.getQueryPredictions({ input }, (results, status) =>
        resolve([results, status])
      )
    })
  }
  const getPlace = async (
    request: google.maps.places.PlaceDetailsRequest
  ): Promise<google.maps.places.PlaceResult> => {
    if (!google) {
      google = await loader.load()
    }
    return new Promise((resolve, reject) => {
      if (!mapRef.value) return reject('INVALID_REQUEST')
      const service = new google.maps.places.PlacesService(mapRef.value)
      service.getDetails(request, (place, status) => {
        if (status != google.maps.places.PlacesServiceStatus.OK || !place)
          return reject(status)
        return resolve(place)
      })
    })
  }
  return { getPlace, searchPlaces, loader, mapRef }
}
