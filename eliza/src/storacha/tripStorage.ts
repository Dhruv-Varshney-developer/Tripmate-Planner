import { elizaLogger, HandlerCallback, Memory, State } from "@elizaos/core";

export async function storeTripData(state: State, callback: HandlerCallback, storageClient) {
  const tripData=state.recentMessages

  if (!tripData) {
    await callback?.({ text: "Invalid or missing trip data." });
    return;
  }

  const username = state?.actorsData?.[0]?.username || 'AlienX';
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  try {
    const jsonString = JSON.stringify(tripData, null, 2);
    const blobContent = new Blob([jsonString], { type: "application/json" });

    const tripFile = new File([blobContent], `${username}-TripData.json`, {
      type: "application/json"
    });

    const metaBlob = new Blob([
      `User: ${username}\n`,
      `Timestamp: ${timestamp}\n`,
      `MessagesCount: ${tripData.length}\n`
    ], {
      type: "text/plain"
    });

    const metaFile = new File([metaBlob], `${username}-MetaInfo.txt`, {
      type: "text/plain"
    });

    elizaLogger.info(`Uploading trip data for ${username} to Storacha...`);
    const files= [tripFile, metaFile];

    const directoryCID = await storageClient.getStorage().uploadDirectory(files);

    await callback?.({ text: `Trip data saved! Here is your link: https://${directoryCID}.ipfs.web3.link/  Secure it in your saved messages!` });
  } catch (error) {
    console.log(`error in storeTripData--`, error)
    await callback?.({ text: "Error uploading trip data." });
  }
}