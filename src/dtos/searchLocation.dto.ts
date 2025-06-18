import { ApiProperty } from "@nestjs/swagger";
import { autoCompletResponseeDTO } from "pinpin_library";

class autoCompleteDTO implements autoCompletResponseeDTO {
  @ApiProperty({
    description: "地點ID",
    example: "ChIJa0aM2VU8j4AR8QrX5A9M4b4",
    externalDocs: {
      description: "Google AutoComplete API",
      url: "https://developers.google.com/maps/documentation/places/web-service/search#placeid",
    },
  })
  placeId: string;

  @ApiProperty({
    description: "類型",
    maxItems: 5,
    example: ["airport", "shopping_mall"],
    externalDocs: {
      description: "Google AutoComplete API",
      url: "https://developers.google.com/maps/documentation/places/web-service/search#types",
    },
  })
  types: string[];

  @ApiProperty({
    description: "名稱",
    example: "台北101",
    externalDocs: {
      description: "Google AutoComplete API",
      url: "https://developers.google.com/maps/documentation/places/web-service/search#text",
    },
  })
  text: string;
}

export { autoCompleteDTO };
