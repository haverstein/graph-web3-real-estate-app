import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  PropertyListed,
  PropertyListingCancelled,
  PropertySold,
  SellerRegistered
} from "../generated/RealEstateApp/RealEstateApp"

export function createPropertyListedEvent(
  nftAddress: Address,
  seller: Address,
  tokenIds: Array<BigInt>,
  price: BigInt
): PropertyListed {
  let propertyListedEvent = changetype<PropertyListed>(newMockEvent())

  propertyListedEvent.parameters = new Array()

  propertyListedEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  propertyListedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  propertyListedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenIds",
      ethereum.Value.fromUnsignedBigIntArray(tokenIds)
    )
  )
  propertyListedEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return propertyListedEvent
}

export function createPropertyListingCancelledEvent(
  seller: Address,
  nftAddress: Address,
  tokenIds: Array<BigInt>
): PropertyListingCancelled {
  let propertyListingCancelledEvent = changetype<PropertyListingCancelled>(
    newMockEvent()
  )

  propertyListingCancelledEvent.parameters = new Array()

  propertyListingCancelledEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  propertyListingCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  propertyListingCancelledEvent.parameters.push(
    new ethereum.EventParam(
      "tokenIds",
      ethereum.Value.fromUnsignedBigIntArray(tokenIds)
    )
  )

  return propertyListingCancelledEvent
}

export function createPropertySoldEvent(
  seller: Address,
  buyer: Address,
  nftAddress: Address,
  tokenIds: Array<BigInt>,
  price: BigInt
): PropertySold {
  let propertySoldEvent = changetype<PropertySold>(newMockEvent())

  propertySoldEvent.parameters = new Array()

  propertySoldEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  propertySoldEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  propertySoldEvent.parameters.push(
    new ethereum.EventParam(
      "nftAddress",
      ethereum.Value.fromAddress(nftAddress)
    )
  )
  propertySoldEvent.parameters.push(
    new ethereum.EventParam(
      "tokenIds",
      ethereum.Value.fromUnsignedBigIntArray(tokenIds)
    )
  )
  propertySoldEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )

  return propertySoldEvent
}

export function createSellerRegisteredEvent(
  sellerAddress: Address,
  sellerCounter: BigInt
): SellerRegistered {
  let sellerRegisteredEvent = changetype<SellerRegistered>(newMockEvent())

  sellerRegisteredEvent.parameters = new Array()

  sellerRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "sellerAddress",
      ethereum.Value.fromAddress(sellerAddress)
    )
  )
  sellerRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "sellerCounter",
      ethereum.Value.fromUnsignedBigInt(sellerCounter)
    )
  )

  return sellerRegisteredEvent
}
