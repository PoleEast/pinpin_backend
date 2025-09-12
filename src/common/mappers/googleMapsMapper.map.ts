import {
  AutoCompletResponse,
  GetLocationByIdResponse,
  GOOGLE_MAPS_PLACE_BUSINESS_STATUS,
  GOOGLE_MAPS_PLACE_PRICE_LEVEL,
  GoogleMapsPlaceBusinessStatus,
  GoogleMapsPlacePriceLevel,
  OpeningTimePeriods,
  Location,
} from "pinpin_library";
import { ORIGINAL_GOOGLE_MAPS_PLACE } from "../constants/constants.js";
import { ConstObjectValues } from "../utils/type.util.js";
import { places_v1 } from "@googleapis/places";

function googleBusinessStatusMapper(businessStatus?: string | null): GoogleMapsPlaceBusinessStatus {
  switch (businessStatus) {
    case ORIGINAL_GOOGLE_MAPS_PLACE.BUSINESS_STATUS.OPERATIONAL:
      return GOOGLE_MAPS_PLACE_BUSINESS_STATUS.OPEN;
    case ORIGINAL_GOOGLE_MAPS_PLACE.BUSINESS_STATUS.CLOSED_TEMPORARILY:
      return GOOGLE_MAPS_PLACE_BUSINESS_STATUS.CLOSE;
    case ORIGINAL_GOOGLE_MAPS_PLACE.BUSINESS_STATUS.CLOSED_PERMANENTLY:
      return GOOGLE_MAPS_PLACE_BUSINESS_STATUS.CLOSE;
    default:
      return GOOGLE_MAPS_PLACE_BUSINESS_STATUS.UNKNOWN;
  }
}

function reverseBusinessStatusMapper(
  businessStatus: GoogleMapsPlaceBusinessStatus,
): ConstObjectValues<typeof ORIGINAL_GOOGLE_MAPS_PLACE.BUSINESS_STATUS> {
  switch (businessStatus) {
    case GOOGLE_MAPS_PLACE_BUSINESS_STATUS.OPEN:
      return ORIGINAL_GOOGLE_MAPS_PLACE.BUSINESS_STATUS.OPERATIONAL;
    case GOOGLE_MAPS_PLACE_BUSINESS_STATUS.CLOSE:
      return ORIGINAL_GOOGLE_MAPS_PLACE.BUSINESS_STATUS.CLOSED_PERMANENTLY;
    case GOOGLE_MAPS_PLACE_BUSINESS_STATUS.UNKNOWN:
    default:
      return ORIGINAL_GOOGLE_MAPS_PLACE.BUSINESS_STATUS.BUSINESS_STATUS_UNSPECIFIED;
  }
}

function googlePriceLevelMapper(pliceLevel?: string | null): GoogleMapsPlacePriceLevel {
  switch (pliceLevel) {
    case ORIGINAL_GOOGLE_MAPS_PLACE.PRICE_LEVEL.PRICE_LEVEL_UNSPECIFIED:
      return GOOGLE_MAPS_PLACE_PRICE_LEVEL.UNKNOWN;
    case ORIGINAL_GOOGLE_MAPS_PLACE.PRICE_LEVEL.PRICE_LEVEL_FREE:
      return GOOGLE_MAPS_PLACE_PRICE_LEVEL.INEXPENSIVE;
    case ORIGINAL_GOOGLE_MAPS_PLACE.PRICE_LEVEL.PRICE_LEVEL_INEXPENSIVE:
      return GOOGLE_MAPS_PLACE_PRICE_LEVEL.INEXPENSIVE;
    case ORIGINAL_GOOGLE_MAPS_PLACE.PRICE_LEVEL.PRICE_LEVEL_MODERATE:
      return GOOGLE_MAPS_PLACE_PRICE_LEVEL.MODERATE;
    case ORIGINAL_GOOGLE_MAPS_PLACE.PRICE_LEVEL.PRICE_LEVEL_EXPENSIVE:
      return GOOGLE_MAPS_PLACE_PRICE_LEVEL.EXPENSIVE;
    case ORIGINAL_GOOGLE_MAPS_PLACE.PRICE_LEVEL.PRICE_LEVEL_VERY_EXPENSIVE:
      return GOOGLE_MAPS_PLACE_PRICE_LEVEL.VERY_EXPENSIVE;
    default:
      return GOOGLE_MAPS_PLACE_PRICE_LEVEL.UNKNOWN;
  }
}

function reversePriceLevelMapper(priceLevel: GoogleMapsPlacePriceLevel): ConstObjectValues<typeof ORIGINAL_GOOGLE_MAPS_PLACE.PRICE_LEVEL> {
  switch (priceLevel) {
    case GOOGLE_MAPS_PLACE_PRICE_LEVEL.UNKNOWN:
      return ORIGINAL_GOOGLE_MAPS_PLACE.PRICE_LEVEL.PRICE_LEVEL_UNSPECIFIED;
    case GOOGLE_MAPS_PLACE_PRICE_LEVEL.INEXPENSIVE:
      return ORIGINAL_GOOGLE_MAPS_PLACE.PRICE_LEVEL.PRICE_LEVEL_INEXPENSIVE;
    case GOOGLE_MAPS_PLACE_PRICE_LEVEL.MODERATE:
      return ORIGINAL_GOOGLE_MAPS_PLACE.PRICE_LEVEL.PRICE_LEVEL_MODERATE;
    case GOOGLE_MAPS_PLACE_PRICE_LEVEL.EXPENSIVE:
      return ORIGINAL_GOOGLE_MAPS_PLACE.PRICE_LEVEL.PRICE_LEVEL_EXPENSIVE;
    case GOOGLE_MAPS_PLACE_PRICE_LEVEL.VERY_EXPENSIVE:
      return ORIGINAL_GOOGLE_MAPS_PLACE.PRICE_LEVEL.PRICE_LEVEL_VERY_EXPENSIVE;
    default:
      return ORIGINAL_GOOGLE_MAPS_PLACE.PRICE_LEVEL.PRICE_LEVEL_UNSPECIFIED;
  }
}

function googleOpeningTimePeriodsMapper(openingTime?: places_v1.Schema$GoogleMapsPlacesV1PlaceOpeningHours): OpeningTimePeriods[] {
  if (!openingTime || !openingTime.periods) {
    return [];
  }

  const result: OpeningTimePeriods[] = openingTime.periods.reduce<OpeningTimePeriods[]>((acc: OpeningTimePeriods[], period) => {
    if (
      typeof period.close?.hour !== "number" ||
      typeof period.close?.minute !== "number" ||
      typeof period.open?.hour !== "number" ||
      typeof period.open?.minute !== "number" ||
      typeof period.open?.day !== "number"
    )
      return acc;

    const openingTimePeriods: OpeningTimePeriods = {
      open: {
        hour: period.open?.hour,
        minute: period.open?.minute,
      },
      close: {
        hour: period.close?.hour,
        minute: period.close?.minute,
      },
      day: [period.open.day],
    };

    if (acc.length === 0) {
      acc.push(openingTimePeriods);
      return acc;
    }

    const index = acc.findIndex(
      (value) =>
        value.open.hour === openingTimePeriods.open.hour &&
        value.open.minute === openingTimePeriods.open.minute &&
        value.close.hour === openingTimePeriods.close.hour &&
        value.close.minute === openingTimePeriods.close.minute,
    );

    if (index === -1) acc.push(openingTimePeriods);
    else acc[index].day.push(period.open.day);
    return acc;
  }, []);

  return result;
}

async function mapGoogleMapsPlaceTextSearchResponseToSearchLocationDto(
  data: places_v1.Schema$GoogleMapsPlacesV1Place,
  photoURLCallback: (name: string, maxImageWidth?: number, maxImageHeight?: number) => Promise<string> | string,
  maxImageWidth?: number,
  imageMaxHeight: number = 200,
): Promise<Location> {
  return {
    phoneNumber: data.internationalPhoneNumber || "",
    rating: data.rating || 0,
    businessStatus: googleBusinessStatusMapper(data.businessStatus),
    priceLevel: googlePriceLevelMapper(data.priceLevel),
    userRatingCount: data.userRatingCount || 0,
    name: data.displayName?.text || "",
    primaryType: data.primaryType || "",
    address: data.shortFormattedAddress || "",
    id: data.id || "",
    photoURL: data.photos?.[0].name ? await photoURLCallback(data.photos[0].name, maxImageWidth, imageMaxHeight) : "",
    IconMaskBaseURL: data.iconMaskBaseUri + ".svg" || "",
  };
}

function mapGoogleMapsPlaceAutocompleteResponseToAutoCompletResponseDto(
  data: places_v1.Schema$GoogleMapsPlacesV1AutocompletePlacesResponseSuggestion,
): AutoCompletResponse {
  return {
    placeId: data.placePrediction?.placeId || "",
    types: data.placePrediction?.types || [],
    text: data.placePrediction?.structuredFormat?.mainText?.text || "",
    address: data.placePrediction?.structuredFormat?.secondaryText?.text || "",
  };
}

function mapGoogleMapsPlaceGetLocationResponseGetLocationByIdResponseDto(data: places_v1.Schema$GoogleMapsPlacesV1Place): GetLocationByIdResponse {
  return {
    phoneNumber: data.internationalPhoneNumber || "",
    rating: data.rating || 0,
    businessStatus: googleBusinessStatusMapper(data.businessStatus),
    priceLevel: googlePriceLevelMapper(data.priceLevel),
    userRatingCount: data.userRatingCount || 0,
    name: data.displayName?.text || "",
    primaryType: data.primaryType || "",
    address: data.shortFormattedAddress || "",
    id: data.id || "",
    photoURL: data.photos?.[0]?.name || "",
    IconMaskBaseURL: data.iconMaskBaseUri + ".svg" || "",
    location: {
      lat: data.location?.latitude || 0,
      lng: data.location?.longitude || 0,
    },
    googleMapsUri: data.googleMapsUri || "",
    website: data.websiteUri || "",
    openingTimePeriods: googleOpeningTimePeriodsMapper(data.regularOpeningHours),
    reviews:
      data.reviews?.map((review) => ({
        reviewerDisplayName: review.authorAttribution?.displayName || "",
        photoUri: review.authorAttribution?.photoUri || "",
        time: review.relativePublishTimeDescription || "",
        rating: review.rating || 0,
        text: review.text?.text || "",
      })) || [],
    priceRange: {
      min: data.priceRange?.startPrice?.units || "",
      max: data.priceRange?.endPrice?.units || "",
      currencyCode: data.priceRange?.endPrice?.currencyCode || "",
    },
    timeZone: data.timeZone?.id || "",
  };
}

export {
  googleBusinessStatusMapper,
  googlePriceLevelMapper,
  reverseBusinessStatusMapper,
  reversePriceLevelMapper,
  mapGoogleMapsPlaceTextSearchResponseToSearchLocationDto,
  mapGoogleMapsPlaceAutocompleteResponseToAutoCompletResponseDto,
  mapGoogleMapsPlaceGetLocationResponseGetLocationByIdResponseDto,
};
