# Tamper Proof Data

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal server or database is breached. 

**1. How does the client ensure that their data has not been tampered with?**

The client ensures data integrity by calculating a checksum (SHA-256 hash) of the data whenever it is retrieved or updated. This checksum is compared against the checksum stored on the server. If the checksums match, the data is intact; otherwise, the data has been tampered with. The verification process is handled in the verifyData function, which alerts the user if the data has been compromised.

**2. If the data has been tampered with, how can the client recover the lost data?**

If the data has been tampered with, the client can recover the lost data by rolling back to a previous version stored on the server. The server keeps an array of all previous versions of the data, each with its own checksum. The client can fetch these versions and choose to roll back to a specific version using the rollbackData function, which sends a request to the server to restore the data to the selected previous state.


Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:
```npm run start``` in both the frontend and backend

## To make a submission:
1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance
