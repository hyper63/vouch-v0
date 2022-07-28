# Vouch DAO v0

Vouch DAO is a decentralized identity validation service; the concept is to allow many different types of services to be used to validate or vouch a user's identity. These services can range from several identity platforms online. Why? This DAO aims to enable a sustainable and flexible identity management system that helps dApps and smart contracts prevent Sybil attacks on their systems.

## How it works?

The DAO will be a collection of identity management services that support the same output protocol so that dApps and Warp Contracts can quickly query and discover if a caller of specific contract action or data-entry request is valid. This service will help applications and contracts protect against Sybil attacks in a permissionless system.

The user will visit one of these services, for example, blue.arweave.dev, and they will connect their wallet and execute the service verification workflow. (For the Twitter service, they will send a tweet) This workflow will step the user through the verification process. Once completed, the workflow will POST the required input to the /vouch endpoint; this endpoint will be responsible for writing the data-entry record to the Arweave network. An AR fee from the user getting validated will be required.


## Usage

Feature: Create a Vouch Record for my wallet using Twitter Blue Vouch DAO Service

```
As a user with an Arweave Wallet that contains AR
I want to create a Voucher for my wallet
So that I can play the Passport Game on Permapages
```

Scenario: Success

```
Given I am visiting blue.arweave.dev 
And I have connected my wallet
When I click the Vouch button
And I post a tweet `I am in the process of getting a Voucher for the Arweave ecosystem, my wallet address is XXXXXXXXXXXXXX`
And I post to the `/vouch` endpoint my wallet information 
Then I should get back a successfully Vouched message
And I should be able to query the Arweave gateway and find my Vouch DAO transaction showing that the Vouch transaction is successful
```

Scenario: Failure could not find the tweet

```
Given I am visiting blue.arweave.dev
And I have connected my wallet 
When I click the Vouch button
And I do not post a tweet
And I click the check status button
Then I should get back a `Not Found` message tweet!
```


Scenario: Failure tweet messages found from different accounts

```
Given I am visiting blue.arweave.dev
And I have connected my wallet
When I click the Vouch button
And I post a tweet from multiple accounts
And I click the check status button
Then I should get back a `Bad Request` message
```