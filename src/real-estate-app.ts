import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
import {
  RealEstateApp,
  PropertyListed as PropertyListedEvent,
  PropertyListingCancelled as PropertyListingCancelledEvent,
  PropertySold as PropertySoldEvent,
  SellerRegistered as SellerRegisteredEvent,
} from "../generated/RealEstateApp/RealEstateApp";
import {
  ActiveProperty,
  PropertyListed,
  PropertySold,
  PropertyListingCancelled,
  RegisteredSeller,
} from "../generated/schema";

let sellerCounter: any;
export function handlePropertyListed(event: PropertyListedEvent): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let propertyListed = PropertyListed.load(
    getIdFromEventParams(event.params.tokenIds[0], event.params.nftAddress)
  );
  let activeProperty = ActiveProperty.load(
    getIdFromEventParams(event.params.tokenIds[0], event.params.nftAddress)
  );
  let registeredSeller = RegisteredSeller.load(
    event.params.seller.toHexString()
  );

  if (!propertyListed) {
    propertyListed = new PropertyListed(
      getIdFromEventParams(event.params.tokenIds[0], event.params.nftAddress)
    );
  }
  if (!activeProperty) {
    activeProperty = new ActiveProperty(
      getIdFromEventParams(event.params.tokenIds[0], event.params.nftAddress)
    );
  }
  if (!registeredSeller) {
    registeredSeller = new RegisteredSeller(event.params.seller.toHexString());
    sellerCounter = sellerCounter + 1n;
    registeredSeller.sellerCounter = sellerCounter;
    registeredSeller.seller = event.params.seller;
    registeredSeller.properties = [
      Address.fromString("0x0000000000000000000000000000000000000000"),
    ];
  }

  let properties = [];
  if (!registeredSeller?.properties) {
    properties.push(event.params.nftAddress);
  } else {
    properties = registeredSeller.properties;
    properties.push(event.params.nftAddress);
  }

  registeredSeller.properties = properties;

  propertyListed.seller = event.params.seller;
  activeProperty.seller = event.params.seller;

  propertyListed.nftAddress = event.params.nftAddress;
  activeProperty.nftAddress = event.params.nftAddress;

  let array_tokenId = event.params.tokenIds.map((tokenId) => {
    return parseInt(tokenId.toString());
  });

  propertyListed.tokenIds = event.params.tokenIds;
  activeProperty.tokenIds = event.params.tokenIds;

  propertyListed.price = event.params.price;
  activeProperty.price = event.params.price;

  activeProperty.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );

  activeProperty.save();
  propertyListed.save();
  registeredSeller?.save();
}

export function handlePropertyListingCancelled(
  event: PropertyListingCancelledEvent
): void {
  let propertyCancelled = PropertyListingCancelled.load(
    getIdFromEventParams(event.params.tokenIds[0], event.params.nftAddress)
  );
  let activeProperty = ActiveProperty.load(
    getIdFromEventParams(event.params.tokenIds[0], event.params.nftAddress)
  );
  let registeredSeller = RegisteredSeller.load(
    event.params.seller.toHexString()
  );

  if (!propertyCancelled) {
    propertyCancelled = new PropertyListingCancelled(
      getIdFromEventParams(event.params.tokenIds[0], event.params.nftAddress)
    );
  }
  propertyCancelled.seller = event.params.seller;
  propertyCancelled.nftAddress = event.params.nftAddress;
  propertyCancelled.tokenIds = event.params.tokenIds;
  activeProperty!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000dEaD"
  );
  registeredSeller!.properties = remove(
    registeredSeller!.properties,
    event.params.nftAddress
  );
  activeProperty!.save();
  propertyCancelled.save();
  registeredSeller!.save();
}

export function handlePropertySold(event: PropertySoldEvent): void {
  let propertySold = PropertySold.load(
    getIdFromEventParams(event.params.tokenIds[0], event.params.nftAddress)
  );
  let activeProperty = ActiveProperty.load(
    getIdFromEventParams(event.params.tokenIds[0], event.params.nftAddress)
  );
  let registeredSeller = RegisteredSeller.load(
    event.params.seller.toHexString()
  );
  if (!propertySold) {
    propertySold = new PropertySold(
      getIdFromEventParams(event.params.tokenIds[0], event.params.nftAddress)
    );
  }
  propertySold.buyer = event.params.buyer;
  propertySold.nftAddress = event.params.nftAddress;
  propertySold.tokenIds = event.params.tokenIds;
  activeProperty!.buyer = event.params.buyer;

  registeredSeller!.properties = remove(
    registeredSeller!.properties,
    event.params.nftAddress
  );

  propertySold.save();
  activeProperty!.save();
  registeredSeller?.save();
}

export function handleSellerRegistered(event: SellerRegisteredEvent): void {
  let registeredSeller = RegisteredSeller.load(
    event.params.sellerAddress.toHexString()
  );
  if (!registeredSeller) {
    registeredSeller = new RegisteredSeller(
      event.params.sellerAddress.toHexString()
    );
  }
  sellerCounter = event.params.sellerCounter;
  registeredSeller.seller = event.params.sellerAddress;
  registeredSeller.sellerCounter = event.params.sellerCounter;
  registeredSeller.properties = [
    Address.fromString("0x0000000000000000000000000000000000000000"),
  ];
  registeredSeller.save();
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString();
}
function remove(array: Address[] | null, add: Address): Address[] {
  let a: number = -1;
  if (array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] == add) a = i;
    }
    if (a > -1) array.splice(a, 1);
    return array;
  } else {
    return [Address.fromString("0x0000000000000000000000000000000000000000")];
  }
}
